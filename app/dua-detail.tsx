import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  LayoutAnimation,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BouncingButton } from '../components/ui/BouncingButton';
import { CombinedDuaDisplay } from '../components/ui/CombinedDuaDisplay';
import { FloatingParticles } from '../components/ui/FloatingParticles';
import { MashaAllahCelebration } from '../components/ui/MashaAllahCelebration';
import { RepeatBadge } from '../components/ui/RepeatBadge';
import { SwipeNavigation } from '../components/ui/SwipeNavigation';
import { WordByWordDisplay } from '../components/ui/WordByWordDisplay';
import { THEME, localImages } from '../constants/AppTheme';

import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCustomAudioPlayer } from '../lib/audio/useCustomAudioPlayer';
import { Dua, getAllDuas, getWordAudioPairsByDua } from '../lib/data/duas';
import { useAppSettingsStore } from '../stores/appSettingsStore';
import { MemorizationStatus, useUserProgressStore } from '../stores/userProgressStore';

// Import PNG images for buttons
const BtnPrevious = require('../assets/btns/btn_back.png');
const BtnNext = require('../assets/btns/btn_next.png');
const BtnPause = require('../assets/btns/btn_pause.png');
const BtnPlay = require('../assets/btns/btn_play.png');
const BtnRepeat = require('../assets/btns/btn_repeat.png');
const BtnHome = require('../assets/btns/btn_setting.png');

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

// Custom Layout Animation Preset for Smooth Transitions
const customLayoutAnimation = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

// FIXED: Updated getLocalImage function to handle undefined imagePath
const getLocalImage = (duaId: string, duaNumber?: string, localImageIndex?: string, imagePath?: string | any) => {
  if (imagePath && typeof imagePath === 'number') return imagePath;

  if (imagePath && typeof imagePath === 'string') {
    try {
      const imageKey = (imagePath.split('/').pop()?.replace('.png', '') || 'kaaba') as keyof typeof localImages;
      if (localImages[imageKey]) return localImages[imageKey];
    } catch {}
  }

  if (localImageIndex) {
    const imageKey = `dua_${localImageIndex}` as keyof typeof localImages;
    if (localImages[imageKey]) return localImages[imageKey];
  }

  if (duaNumber) {
    const imageKey = `dua_${duaNumber}` as keyof typeof localImages;
    if (localImages[imageKey]) return localImages[imageKey];
  }

  const imageIndex = (parseInt(duaId || '1') % 32) || 1;
  return localImages[`dua_${imageIndex}` as keyof typeof localImages] || localImages.kaaba;
};

export default function DuaDetailScreen() {
  const { width } = useWindowDimensions();
  const illustrationHeight = width >= 600 ? 320 : 250;

  const router = useRouter();
  const params = useLocalSearchParams();

  const getStringParam = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) {
      return param[0] || '';
    }
    return param || '';
  };

  // State declarations
  const [currentRepeatIteration, setCurrentRepeatIteration] = useState(0);
  const [allDuas, setAllDuas] = useState<Dua[]>([]);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState<'full' | 'word'>('word');
  const [wordAudioPairs, setWordAudioPairs] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  // Zustand stores — granular selectors to avoid unnecessary re-renders
  const favorites = useUserProgressStore((s) => s.favorites);
  const memorization = useUserProgressStore((s) => s.memorization);
  const toggleFavorite = useUserProgressStore((s) => s.toggleFavorite);
  const setMemorizationStatus = useUserProgressStore((s) => s.setMemorizationStatus);
  const readDuaTitle = useAppSettingsStore((s) => s.readDuaTitle);
  const autoPlayAudio = useAppSettingsStore((s) => s.autoPlayAudio);
  const wordByWordPause = useAppSettingsStore((s) => s.wordByWordPause);
  const pauseDuration = useAppSettingsStore((s) => s.pauseDuration);
  const arabicFontSize = useAppSettingsStore((s) => s.arabicFontSize);
  const enableRewards = useAppSettingsStore((s) => s.enableRewards);
  const hapticFeedback = useAppSettingsStore((s) => s.hapticFeedback);
  const autoNextDuas = useAppSettingsStore((s) => s.autoNextDuas);
  const playbackMode = useAppSettingsStore((s) => s.playbackMode);
  const updateSetting = useAppSettingsStore((s) => s.updateSetting);

  // Keep a ref copy of settings so async effects/callbacks always read fresh values
  const settingsRef = useRef({ hapticFeedback, enableRewards, wordByWordPause, pauseDuration, autoNextDuas });
  settingsRef.current = { hapticFeedback, enableRewards, wordByWordPause, pauseDuration, autoNextDuas };

  // Ref kept in sync with navigateToNextDua so triggerCelebration can call it without circular deps
  const navigateToNextDuaRef = useRef<() => void>(() => {});
  const [repeatMode, setRepeatMode] = useState<'empty' | '1' | '2' | '3' | 'infinite'>('empty');
  // Ref mirror — lets getRepeatCount stay stable so changing repeat mode mid-play
  // never triggers a dep-array re-run of the word-by-word effect.
  const repeatModeRef = useRef<'empty' | '1' | '2' | '3' | 'infinite'>('empty');
  repeatModeRef.current = repeatMode;
  const [showRepeatBadge, setShowRepeatBadge] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // ✅ IMPROVED: Track completion state with better management
  const [hasCompletedPlayback, setHasCompletedPlayback] = useState(false);
  const [isCelebrationVisible, setIsCelebrationVisible] = useState(false);
  
  // ✅ NEW: Track title audio playback state
  const [isPlayingTitleAudio, setIsPlayingTitleAudio] = useState(false);
  // Ref (not state) — changing it must never re-trigger effects or re-renders
  const hasPlayedTitleAudioRef = useRef(false);

  // Use ref to track current index to avoid stale closures
  const currentDuaIndexRef = useRef(currentDuaIndex);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleAudioSoundRef = useRef<Audio.Sound | null>(null);
  // Single source of truth for the currently playing word sound
  const currentWordSoundRef = useRef<Audio.Sound | null>(null);
  // Stored resolve functions — calling them interrupts the pending promise immediately
  const wordAudioResolveRef = useRef<(() => void) | null>(null);
  const titleAudioResolveRef = useRef<(() => void) | null>(null);

  // Add animated values for mode buttons
  const wordModeScale = useRef(new Animated.Value(1)).current;
  const fullModeScale = useRef(new Animated.Value(1)).current;

  // Update ref whenever currentDuaIndex changes
  useEffect(() => {
    currentDuaIndexRef.current = currentDuaIndex;
  }, [currentDuaIndex]);

  // ✅ FIXED: Helper functions for repeat logic
  const getRepeatCount = useCallback(() => {
    switch (repeatModeRef.current) {
      case '1': return 1;
      case '2': return 2;
      case '3': return 3;
      case 'infinite': return Infinity;
      default: return 0;
    }
  }, []); // stable — reads from ref, never forces an effect re-run

  const checkShouldRepeat = useCallback((currentIteration: number) => {
    const totalRepeats = getRepeatCount();
    const shouldRepeat = currentIteration < totalRepeats;
    console.log(`🔄 Check Repeat: current=${currentIteration}, total=${totalRepeats}, shouldRepeat=${shouldRepeat}`);
    return shouldRepeat;
  }, [getRepeatCount]);

  // Stops and unloads all active audio immediately — safe to call from any context
  const stopAllAudio = () => {
    // Interrupt pending promises so any awaiting code unblocks right away
    titleAudioResolveRef.current?.();
    titleAudioResolveRef.current = null;
    wordAudioResolveRef.current?.();
    wordAudioResolveRef.current = null;

    const ts = titleAudioSoundRef.current;
    titleAudioSoundRef.current = null;
    if (ts) { ts.stopAsync().catch(() => {}); ts.unloadAsync().catch(() => {}); }

    const ws = currentWordSoundRef.current;
    currentWordSoundRef.current = null;
    if (ws) { ws.stopAsync().catch(() => {}); ws.unloadAsync().catch(() => {}); }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) clearTimeout(celebrationTimeoutRef.current);
      stopAllAudio();
    };
  }, []);

  // Add this useEffect to handle celebration timeout safety
  useEffect(() => {
    if (showCelebration) {
      const safetyTimeout = setTimeout(() => {
        console.log('🛡️ Safety timeout: Forcing celebration to hide');
        setShowCelebration(false);
        setIsCelebrationVisible(false);
      }, 5000); // 5 second safety timeout

      return () => clearTimeout(safetyTimeout);
    }
  }, [showCelebration]);

  // ✅ FIXED: Enhanced celebration handler — respects enableRewards + autoNextDuas settings
  const triggerCelebration = useCallback(() => {
    // Mark playback complete regardless of rewards setting
    setHasCompletedPlayback(true);

    if (!settingsRef.current.enableRewards) {
      // No celebration — but still auto-navigate if enabled
      if (settingsRef.current.autoNextDuas) {
        celebrationTimeoutRef.current = setTimeout(() => navigateToNextDuaRef.current(), 1000);
      }
      return;
    }

    if (!isCelebrationVisible && !showCelebration) {
      setShowCelebration(true);
      setIsCelebrationVisible(true);
      // Schedule auto-navigation after celebration finishes (3.5 s)
      if (settingsRef.current.autoNextDuas) {
        celebrationTimeoutRef.current = setTimeout(() => navigateToNextDuaRef.current(), 3500);
      }
    }
  }, [isCelebrationVisible, showCelebration]);

  const handleCelebrationHide = useCallback(() => {
    console.log('🎉 Celebration hide callback called');
    setShowCelebration(false);
    setIsCelebrationVisible(false);
  }, []);

  // ✅ FIXED: Reset completion state when changing modes or duas
  const resetCompletionState = useCallback(() => {
    console.log('🔄 Resetting completion state');
    setCurrentRepeatIteration(0);
    setHasCompletedPlayback(false);
    setIsCelebrationVisible(false);
    setShowCelebration(false);
    hasPlayedTitleAudioRef.current = false;
    setIsPlayingTitleAudio(false);
    
    if (celebrationTimeoutRef.current) {
      clearTimeout(celebrationTimeoutRef.current);
      celebrationTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const loadAllDuasAndFindPosition = async () => {
      try {
        setIsLoading(true);
        console.log('🔄 Loading ALL duas from static data...');

        const duas = getAllDuas();
        console.log(`📚 Loaded ${duas.length} duas from static data`);

        setAllDuas(duas);

        const currentDuaId = getStringParam(params.id);
        console.log('🔍 Looking for dua ID:', currentDuaId);

        const foundIndex = duas.findIndex(dua => dua.id === currentDuaId);
        console.log('📍 Found index:', foundIndex);

        if (foundIndex !== -1) {
          setCurrentDuaIndex(foundIndex);
          currentDuaIndexRef.current = foundIndex;
          console.log(`📍 Starting at dua ${foundIndex + 1} of ${duas.length}`);
        } else {
          console.log('❌ Current dua not found in list, using index 0');
          setCurrentDuaIndex(0);
          currentDuaIndexRef.current = 0;
        }
      } catch (error) {
        console.error('Error loading duas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllDuasAndFindPosition();
  }, [params.id]);

  // Get current dua data
  const currentDua = allDuas[currentDuaIndex];

  // Memoized — only recomputes when the active dua record changes, not on every re-render
  const { arabic, translation, reference, title, duaNumber, id, categoryName, steps, imagePath, audioFull, titleAudioResId } = useMemo(() => {
    if (currentDua) {
      return {
        arabic: currentDua.arabic_text || "بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ",
        translation: currentDua.translation || "Translation not available",
        reference: currentDua.reference || "Reference not available",
        title: currentDua.title || "Beautiful Dua",
        duaNumber: currentDua.duaNumber || currentDua.order_index?.toString() || "1",
        id: currentDua.id || "",
        categoryName: currentDua.textheading || "",
        steps: currentDua.steps || "",
        imagePath: currentDua.image_path,
        audioFull: currentDua.audio_full || "",
        audioWordByWord: currentDua.audio_word_by_word || "",
        titleAudioResId: currentDua.titleAudioResId || null,
      };
    }
    return {
      arabic: getStringParam(params.arabic) || "بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ",
      translation: getStringParam(params.translation) || "Translation not available",
      reference: getStringParam(params.reference) || "Reference not available",
      title: getStringParam(params.title) || "Beautiful Dua",
      duaNumber: getStringParam(params.duaNumber) || "1",
      id: getStringParam(params.id) || "",
      categoryName: getStringParam(params.categoryName) || "",
      steps: getStringParam(params.steps) || "",
      imagePath: getStringParam(params.imagePath) || "",
      audioFull: getStringParam(params.audio_full) || "",
      audioWordByWord: getStringParam(params.audio_word_by_word) || "",
      titleAudioResId: null,
    };
  }, [currentDua]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived from persisted context (auto-updates when dua changes or user toggles)
  const isFavorite = favorites[id] ?? false;
  const memorizationStatus: MemorizationStatus = memorization[id] ?? 'not_started';

  useEffect(() => {
    if (id) {
      try {
        const pairs = getWordAudioPairsByDua(id);
        setWordAudioPairs(pairs || []);
      } catch (error) {
        console.error('Error loading word audio pairs:', error);
        setWordAudioPairs([]);
      }
    } else {
      setWordAudioPairs([]);
    }
  }, [id]);

  // ✅ FIXED: Function to get appropriate audio URL based on mode
  const getAudioUrlForCurrentMode = useCallback(() => {
    // For word mode, we don't need a single audio file since we're using wordAudioPairs
    const audioSource = currentMode === 'full' ? audioFull : undefined;

    return audioSource;
  }, [currentMode, audioFull, wordAudioPairs]);

  // ✅ FIXED: Initialize audio player only for full mode
  const {
    isPlaying: audioIsPlaying,
    play: audioPlay,
    pause: audioPause,
    playPause: audioPlayPause,
    replay: audioReplay,
    status: audioStatus,
    seekTo: audioSeekTo,
    setVolume: audioSetVolume,
    toggleMute: audioToggleMute,
    isMuted: audioIsMuted,
    currentVolume: audioCurrentVolume,
    didJustFinish: audioDidJustFinish,
    loadError,
  } = useCustomAudioPlayer(
    currentMode === 'full' ? getAudioUrlForCurrentMode() : undefined
  );

  const playButtonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ring1Anim = useRef(new Animated.Value(0)).current;
  const ring2Anim = useRef(new Animated.Value(0)).current;
  const ring3Anim = useRef(new Animated.Value(0)).current;
  const favoriteScale = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;
  const repeatScale = useRef(new Animated.Value(1)).current;
  const swipeHintOpacity  = useRef(new Animated.Value(1)).current;
  const modeSlideAnim     = useRef(new Animated.Value(0)).current; // 0=word, 1=full
  const [modeSegWidth, setModeSegWidth] = useState(0);
  const modeIconScale0 = useRef(modeSlideAnim.interpolate({ inputRange: [0, 1], outputRange: [1.16, 0.82] })).current;
  const modeIconScale1 = useRef(modeSlideAnim.interpolate({ inputRange: [0, 1], outputRange: [0.82, 1.16] })).current;

  // Restore persisted mode once after screen data finishes loading.
  // Keyed on isLoading so it fires exactly once per mount, after the store has hydrated.
  useEffect(() => {
    if (!isLoading && allDuas.length > 0) {
      setCurrentMode(playbackMode);
      modeSlideAnim.setValue(playbackMode === 'full' ? 1 : 0);
    }
  }, [isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // FIXED: Use the updated getLocalImage function with proper error handling
  const illustrationImage = getLocalImage(
    id || '1',
    duaNumber,
    String(((parseInt(id || '1')) % 32) + 1),
    imagePath
  );

  // ✅ FIXED: Safe words array initialization
  const words = (arabic || "بِسْمِ اللّٰہِ").split(' ').filter(word => word.trim().length > 0);

  // Plays the dua title audio and resolves when it finishes (or is interrupted)
  const playTitleAudio = async (): Promise<void> => {
    if (!titleAudioResId || hasPlayedTitleAudioRef.current) return;

    return new Promise(async (resolve) => {
      let settled = false;
      const safeResolve = () => {
        if (!settled) {
          settled = true;
          titleAudioResolveRef.current = null;
          resolve();
        }
      };
      // Register so stopAllAudio() can unblock this promise instantly
      titleAudioResolveRef.current = safeResolve;

      try {
        setIsPlayingTitleAudio(true);
        const { sound } = await Audio.Sound.createAsync(titleAudioResId);
        titleAudioSoundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            if (titleAudioSoundRef.current === sound) titleAudioSoundRef.current = null;
            sound.unloadAsync().catch(() => {});
            setIsPlayingTitleAudio(false);
            hasPlayedTitleAudioRef.current = true;
            safeResolve();
          }
        });

        await sound.playAsync();

        // Safety timeout — fires only if the status callback never fires
        const status = await sound.getStatusAsync();
        const duration = (status.isLoaded && status.durationMillis) ? status.durationMillis : 3000;
        setTimeout(() => {
          if (titleAudioSoundRef.current === sound) titleAudioSoundRef.current = null;
          sound.unloadAsync().catch(() => {});
          setIsPlayingTitleAudio(false);
          hasPlayedTitleAudioRef.current = true;
          safeResolve();
        }, duration + 300);
      } catch {
        setIsPlayingTitleAudio(false);
        titleAudioSoundRef.current = null;
        safeResolve();
      }
    });
  };

  // Plays one word's audio clip. Stops any previously playing word audio first.
  const playWordAudio = async (audioSource: any): Promise<void> => {
    // Evict whatever was playing before — one sound at a time
    const prev = currentWordSoundRef.current;
    currentWordSoundRef.current = null;
    wordAudioResolveRef.current = null;
    if (prev) { prev.stopAsync().catch(() => {}); prev.unloadAsync().catch(() => {}); }

    return new Promise(async (resolve) => {
      let settled = false;
      const safeResolve = () => {
        if (!settled) {
          settled = true;
          wordAudioResolveRef.current = null;
          resolve();
        }
      };
      // Register so stopAllAudio() can unblock this promise instantly
      wordAudioResolveRef.current = safeResolve;

      try {
        const { sound } = await Audio.Sound.createAsync(audioSource);
        currentWordSoundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            if (currentWordSoundRef.current === sound) currentWordSoundRef.current = null;
            sound.unloadAsync().catch(() => {});
            safeResolve();
          }
        });

        await sound.playAsync();

        // Safety timeout — fires only if the status callback never fires
        const status = await sound.getStatusAsync();
        const duration = (status.isLoaded && status.durationMillis) ? status.durationMillis : 1500;
        setTimeout(() => {
          if (currentWordSoundRef.current === sound) currentWordSoundRef.current = null;
          sound.unloadAsync().catch(() => {});
          safeResolve();
        }, duration + 300);
      } catch {
        currentWordSoundRef.current = null;
        safeResolve();
      }
    });
  };

  // ✅ FIXED: Reset completion state when changing modes or duas
  useEffect(() => {
    resetCompletionState();
  }, [currentMode, currentDuaIndex, resetCompletionState]);

  // Auto-play when a dua finishes loading (respects autoPlayAudio setting)
  useEffect(() => {
    if (!isLoading && autoPlayAudio && allDuas.length > 0) {
      const timer = setTimeout(() => setIsPlaying(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading]); // intentionally only fires once when loading completes

  // Sync local isPlaying state with audio player
  useEffect(() => {
    setIsPlaying(audioIsPlaying);
  }, [audioIsPlaying]);

  // ✅ FIXED: Enhanced audio completion handler for full mode
  useEffect(() => {
    if (audioDidJustFinish && currentMode === 'full' && !hasCompletedPlayback) {
      console.log('🎵 Full audio finished playing', {
        currentIteration: currentRepeatIteration,
        repeatMode,
        totalRepeats: getRepeatCount(),
        shouldRepeat: checkShouldRepeat(currentRepeatIteration),
        hasCompletedPlayback
      });

      const shouldRepeat = checkShouldRepeat(currentRepeatIteration);

      if (shouldRepeat) {
        console.log(`🔄 Repeating full audio (${currentRepeatIteration + 1}/${getRepeatCount()})`);
        
        setCurrentRepeatIteration(prev => prev + 1);

        // Restart audio for repeat (only the dua portion)
        const restartAudio = async () => {
          try {
            console.log('🔄 Restarting dua audio for repeat...');
            await new Promise(resolve => setTimeout(resolve, 100));
            await audioReplay();
            console.log('✅ Dua audio restarted successfully for repeat');
          } catch (error) {
            console.error('❌ Error restarting audio:', error);
          }
        };

        restartAudio();
      } else {
        // No more repeats - show completion
        console.log('🎉 Full audio playback completed - all repeats done');
        setIsPlaying(false);
        triggerCelebration();
        setCurrentRepeatIteration(0);
      }
    }
  }, [audioDidJustFinish, currentMode, currentRepeatIteration, repeatMode, checkShouldRepeat, getRepeatCount, audioReplay, hasCompletedPlayback, triggerCelebration]);

  // ✅ FIXED: Enhanced word-by-word completion handler with title audio
  useEffect(() => {
    let currentAudioIndex = 0;
    let currentIteration = currentRepeatIteration;
    let isCancelled = false;

    const playWordByWord = async () => {
      if (isCancelled || !isPlaying || hasCompletedPlayback) return;

      console.log(`🔊 Starting playback: iteration=${currentIteration}, words=${wordAudioPairs.length}`);

      // Play title audio only on first iteration (respects readDuaTitle setting)
      if (currentIteration === 0 && !hasPlayedTitleAudioRef.current && titleAudioResId && readDuaTitle) {
        console.log('🎵 Playing title audio before dua...');
        await playTitleAudio();
        if (isCancelled || !isPlaying) return;
      }

      while (currentAudioIndex < (wordAudioPairs?.length || 0) && isPlaying && !isCancelled && !hasCompletedPlayback) {
        setCurrentWordIndex(currentAudioIndex);

        // Play individual word audio and wait for it to finish
        const wordAudio = wordAudioPairs?.[currentAudioIndex];
        if (wordAudio && wordAudio.audio_res_id) {
          console.log(`🔊 Playing word ${currentAudioIndex + 1}/${wordAudioPairs.length}:`, wordAudio.word_text);
          try {
            await playWordAudio(wordAudio.audio_res_id);
          } catch (error) {
            console.error('Error playing word audio:', error);
          }
        } else {
          // If no audio file, wait for a default duration
          await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (isCancelled || !isPlaying || hasCompletedPlayback) break;

        // Pause between words if setting is enabled (skip pause after the last word)
        if (settingsRef.current.wordByWordPause && currentAudioIndex < (wordAudioPairs?.length || 0) - 1) {
          await new Promise(resolve => setTimeout(resolve, settingsRef.current.pauseDuration * 1000));
          if (isCancelled || !isPlaying || hasCompletedPlayback) break;
        }

        currentAudioIndex++;

        // Check if we completed all words in this iteration
        if (currentAudioIndex >= (wordAudioPairs?.length || 0)) {
          console.log(`🎉 Word-by-word playback completed iteration ${currentIteration + 1}`);

          const shouldRepeat = checkShouldRepeat(currentIteration);

          if (shouldRepeat) {
            // Repeat the playback (only the dua portion, not title audio)
            console.log(`🔄 Repeating word playback (${currentIteration + 1}/${getRepeatCount()})`);
            const nextIteration = currentIteration + 1;
            
            // Update state and wait briefly
            setCurrentRepeatIteration(nextIteration);
            await new Promise(resolve => setTimeout(resolve, 500));

            if (isPlaying && !isCancelled && !hasCompletedPlayback) {
              currentAudioIndex = 0;
              currentIteration = nextIteration;
              setCurrentWordIndex(-1);
              console.log(`🔄 Starting repeat iteration ${nextIteration}`);
              continue;
            }
          } else {
            // Finished all repetitions - trigger celebration
            if (!isCancelled && !hasCompletedPlayback) {
              console.log('🎉 Word-by-word playback fully completed - showing celebration');
              setIsPlaying(false);
              setCurrentWordIndex(-1);
              setCurrentRepeatIteration(0);
              triggerCelebration();
            }
            break;
          }
        }
      }
    };

    if (isPlaying && currentMode === 'word' && wordAudioPairs && wordAudioPairs.length > 0 && !hasCompletedPlayback) {
      playWordByWord();
    }

    return () => {
      isCancelled = true;
      stopAllAudio();
    };
  }, [isPlaying, currentMode, wordAudioPairs, currentRepeatIteration, checkShouldRepeat, getRepeatCount, hasCompletedPlayback, triggerCelebration, titleAudioResId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(swipeHintOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSwipeHint(false);
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(imageScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentDuaIndex]);

  useEffect(() => {
    if (isPlaying && !isPlayingTitleAudio) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.10,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying, isPlayingTitleAudio, pulseAnim]);

  // Expanding ring pulse — radiates outward from play button while audio is active
  useEffect(() => {
    let active = true;
    if (!(isPlaying || isPlayingTitleAudio)) {
      ring1Anim.setValue(0);
      ring2Anim.setValue(0);
      ring3Anim.setValue(0);
      return;
    }
    const pulse = () => {
      if (!active) return;
      ring1Anim.setValue(0);
      ring2Anim.setValue(0);
      ring3Anim.setValue(0);
      Animated.stagger(300, [
        Animated.timing(ring1Anim, { toValue: 1, duration: 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(ring2Anim, { toValue: 1, duration: 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(ring3Anim, { toValue: 1, duration: 1000, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]).start(() => { if (active) setTimeout(pulse, 200); });
    };
    pulse();
    return () => { active = false; };
  }, [isPlaying, isPlayingTitleAudio]);

  const cycleMemorizationStatus = useCallback(() => {
    const order: MemorizationStatus[] = ['not_started', 'learning', 'memorized'];
    const currentIdx = order.indexOf(memorizationStatus);
    const nextStatus = order[(currentIdx + 1) % order.length];
    handleMemorizationChange(nextStatus);
  }, [memorizationStatus, handleMemorizationChange]);

  // FIXED: Navigation functions using useCallback to avoid stale closures
  const changeCurrentDua = useCallback((newIndex: number) => {
    if (newIndex < 0 || newIndex >= allDuas.length || isLoading) {
      console.log(`🚫 Cannot navigate to index ${newIndex}. Valid range: 0-${allDuas.length - 1}`);
      return;
    }

    const currentIndex = currentDuaIndexRef.current;
    if (newIndex === currentIndex) {
      console.log('⚠️ Already on this dua, ignoring navigation');
      return;
    }

    console.log(`🔄 Changing from dua ${currentIndex + 1} to ${newIndex + 1}`);

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Stop audio when changing duas
    if (isPlaying) {
      if (currentMode === 'full') {
        audioPause();
      }
      setIsPlaying(false);
    }
    
    resetCompletionState();
    setCurrentWordIndex(-1);
    setCurrentDuaIndex(newIndex);
    currentDuaIndexRef.current = newIndex;

    // Show celebration when moving to next dua (optional)
    if (newIndex > currentIndex) {
      console.log('🎉 Showing celebration for next dua');
      triggerCelebration();
    }
  }, [allDuas.length, isLoading, isPlaying, audioPause, currentMode, resetCompletionState, triggerCelebration]);

  const navigateToNextDua = useCallback(() => {
    const currentIndex = currentDuaIndexRef.current;
    console.log('👉 Next button pressed, current index:', currentIndex);
    const nextIndex = currentIndex + 1;
    if (nextIndex < allDuas.length) {
      changeCurrentDua(nextIndex);
    } else {
      console.log('🎉 Reached the last dua');
    }
  }, [allDuas.length, changeCurrentDua]);

  // Keep ref in sync so triggerCelebration can call it without circular deps
  navigateToNextDuaRef.current = navigateToNextDua;

  const navigateToPrevDua = useCallback(() => {
    const currentIndex = currentDuaIndexRef.current;
    console.log('👈 Previous button pressed, current index:', currentIndex);
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      changeCurrentDua(prevIndex);
    } else {
      console.log('⏮️ Reached the first dua');
    }
  }, [changeCurrentDua]);

  // FIXED: Handle swipe gestures using useCallback
  const handleSwipeLeft = useCallback(() => {
    console.log('⬅️ Handle swipe left called');
    navigateToNextDua();
  }, [navigateToNextDua]);

  const handleSwipeRight = useCallback(() => {
    console.log('➡️ Handle swipe right called');
    navigateToPrevDua();
  }, [navigateToPrevDua]);

  // ✅ UPDATED: Enhanced play/pause handler with title audio support
  const handlePlayPause = useCallback(async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    try {
      if (currentMode === 'full') {
        if (isPlaying) {
          await audioPause();
        } else {
          // If we've completed playback and user presses play again, treat as restart
          if (hasCompletedPlayback) {
            console.log('🔄 Restarting from completed state');
            resetCompletionState();
            // Play title audio first, then the dua
            if (titleAudioResId && !hasPlayedTitleAudioRef.current) {
              await playTitleAudio();
            }
            await audioReplay();
          } else {
            // First time playing - play title audio then dua
            if (titleAudioResId && !hasPlayedTitleAudioRef.current) {
              await playTitleAudio();
            }
            await audioPlay();
          }
        }
      } else {
        // Word mode logic
        if (isPlaying) {
          setIsPlaying(false);
        } else {
          // If we've completed playback and user presses play again, restart
          if (hasCompletedPlayback || currentWordIndex >= (wordAudioPairs?.length || words.length) - 1) {
            console.log('🔄 Restarting word playback from beginning');
            resetCompletionState();
            setCurrentWordIndex(-1);
          }
          setIsPlaying(true);
        }
      }

      Animated.sequence([
        Animated.spring(playButtonScale, {
          toValue: 0.85,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(playButtonScale, {
          toValue: 1,
          tension: 100,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (error) {
      console.error('Error handling play/pause:', error);
    }
  }, [isPlaying, currentMode, hasCompletedPlayback, currentWordIndex, wordAudioPairs, words.length, audioReplay, audioPlay, audioPause, playButtonScale, resetCompletionState, titleAudioResId]);

  const handleFavorite = useCallback(() => {
    if (settingsRef.current.hapticFeedback) Vibration.vibrate(50);
    toggleFavorite(id);

    Animated.sequence([
      Animated.spring(favoriteScale, {
        toValue: 1.3,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(favoriteScale, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [id, toggleFavorite, favoriteScale]);

  const handleMemorizationChange = useCallback((newStatus: MemorizationStatus) => {
    if (newStatus === memorizationStatus) return;
    if (settingsRef.current.hapticFeedback) Vibration.vibrate(30);
    setMemorizationStatus(id, newStatus);
    if (newStatus === 'memorized') {
      triggerCelebration();
    }
  }, [id, memorizationStatus, setMemorizationStatus, triggerCelebration]);

  // ✅ FIXED: Enhanced repeat handler
  const handleRepeat = useCallback(() => {
    if (settingsRef.current.hapticFeedback) Vibration.vibrate(30);

    const modes: Array<'empty' | '1' | '2' | '3' | 'infinite'> = ['empty', '1', '2', '3', 'infinite'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];

    console.log(`🔄 Repeat mode changing: ${repeatMode} -> ${nextMode}`);
    
    setRepeatMode(nextMode);
    // Don't disturb in-progress playback — the new count takes effect after the
    // current pass finishes. Only reset when idle so the user can replay.
    if (!isPlaying && !isPlayingTitleAudio) {
      resetCompletionState();
    }
    setShowRepeatBadge(true);

    Animated.sequence([
      Animated.spring(repeatScale, {
        toValue: 1.2,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(repeatScale, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setShowRepeatBadge(false);
    }, 1500);
  }, [repeatMode, repeatScale, resetCompletionState, isPlaying, isPlayingTitleAudio]);

  const handleBack = useCallback(() => {
    if (currentMode === 'full' && isPlaying) audioPause();
    setIsPlaying(false);
    stopAllAudio();
    router.back();
  }, [isPlaying, audioPause, router, currentMode]);

  const handleHome = useCallback(() => {
    if (currentMode === 'full' && isPlaying) audioPause();
    setIsPlaying(false);
    stopAllAudio();
    router.push('/');
  }, [isPlaying, audioPause, router, currentMode]);

  // ✅ UPDATED: Enhanced mode change handlers with smooth animations
  const handleWordMode = useCallback(() => {
    if (currentMode === 'word') return;
    // Animate the slider immediately on the native thread — no render cycle lag
    Animated.spring(modeSlideAnim, { toValue: 0, tension: 340, friction: 26, useNativeDriver: true }).start();
    setCurrentMode('word');
    updateSetting('playbackMode', 'word');
    if (isPlaying) {
      if (currentMode === 'full') audioPause();
      setIsPlaying(false);
    }
    resetCompletionState();
    setCurrentWordIndex(-1);
  }, [isPlaying, audioPause, currentMode, resetCompletionState, modeSlideAnim, updateSetting]);

  const handleFullMode = useCallback(() => {
    if (currentMode === 'full') return;
    // Animate the slider immediately on the native thread — no render cycle lag
    Animated.spring(modeSlideAnim, { toValue: 1, tension: 340, friction: 26, useNativeDriver: true }).start();
    setCurrentMode('full');
    updateSetting('playbackMode', 'full');
    if (isPlaying) setIsPlaying(false);
    resetCompletionState();
    setCurrentWordIndex(-1);
  }, [isPlaying, resetCompletionState, currentMode, modeSlideAnim, updateSetting]);



  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[THEME.header, '#fef9c3']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <BouncingButton onPress={handleBack}>
            <LinearGradient
              colors={['#7E57C2', '#9C77D9']}
              style={styles.gradientBorder}
            >
              <Image source={BtnPrevious} style={styles.headerButton} />
            </LinearGradient>
          </BouncingButton>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>
              {`Dua ${currentDuaIndex + 1} of ${allDuas.length}`}
            </Text>
          </View>

          <BouncingButton onPress={handleHome}>
            <LinearGradient
              colors={['#FFD166', '#FFB347']}
              style={styles.gradientBorder}
            >
              <Image source={BtnHome} style={styles.headerButton} />
            </LinearGradient>
          </BouncingButton>
        </View>
      </LinearGradient>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME.primary} />
          <Text style={styles.loadingText}>Loading Dua... 🌟</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (allDuas.length === 0 && !isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={THEME.header} />
        {renderHeader()}
        <View style={styles.noDuasContainer}>
          <Text style={styles.noDuasEmoji}>😔</Text>
          <Text style={styles.noDuasText}>No Duas Found</Text>
          <Text style={styles.noDuasSubtext}>
            There are no duas available.
          </Text>
          <BouncingButton onPress={handleBack}>
            <LinearGradient
              colors={['#7E57C2', '#9C77D9']}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>Go Back ↩️</Text>
            </LinearGradient>
          </BouncingButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.header} />

      {/* ✅ USING EXTERNAL COMPONENTS */}
      <FloatingParticles />

      <MashaAllahCelebration
        visible={showCelebration}
        onHide={handleCelebrationHide}
      />

      <RepeatBadge mode={repeatMode} isVisible={showRepeatBadge} />

      {showSwipeHint && (
        <Animated.View style={[styles.swipeHint, { opacity: swipeHintOpacity }]}>
          <LinearGradient
            colors={['rgba(126, 87, 194, 0.9)', 'rgba(156, 119, 217, 0.9)']}
            style={styles.swipeHintGradient}
          >
            <Text style={styles.swipeHintText}>
              👉 Swipe RIGHT for previous • Swipe LEFT for next 👈
            </Text>
          </LinearGradient>
        </Animated.View>
      )}

      {renderHeader()}

      <SwipeNavigation
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
      >
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          scrollEventThrottle={16}
          directionalLockEnabled={true}
          alwaysBounceVertical={true}
          bounces={true}
        >
          <Animated.View
            style={[
              styles.illustrationContainer,
              {
                height: illustrationHeight,
                transform: [{ scale: imageScale }],
              }
            ]}
          >
            <Image
              source={illustrationImage}
              style={styles.illustration}
              resizeMode="cover"
            />

            <Animated.View
              style={[
                styles.favoriteButtonContainer,
                { transform: [{ scale: favoriteScale }] }
              ]}
            >
              <BouncingButton onPress={handleFavorite}>
                <LinearGradient
                  colors={isFavorite ? ['#FF6B6B', '#FF8E8E'] : ['#FFFFFF', '#F8F9FA']}
                  style={styles.favoriteButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={[
                    styles.favoriteButtonEmoji,
                    isFavorite && styles.favoriteButtonEmojiActive
                  ]}>
                    {isFavorite ? '❤️' : '🤍'}
                  </Text>
                </LinearGradient>
              </BouncingButton>
            </Animated.View>

            {/* Memorization status badge — bottom-left of image, tap to cycle */}
            {(() => {
              const cfg = {
                not_started: { icon: '○', label: 'Not Started', from: 'rgba(0,0,0,0.42)', to: 'rgba(0,0,0,0.60)' },
                learning:    { icon: '📖', label: 'Learning',     from: 'rgba(245,158,11,0.88)', to: 'rgba(180,110,0,0.95)' },
                memorized:   { icon: '✅', label: 'Memorized',    from: 'rgba(16,185,129,0.88)', to: 'rgba(5,120,80,0.95)' },
              }[memorizationStatus];
              return (
                <TouchableOpacity
                  style={styles.statusBadgeContainer}
                  onPress={cycleMemorizationStatus}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[cfg.from, cfg.to]}
                    style={styles.statusBadge}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.statusBadgeText}>{cfg.icon}  {cfg.label}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })()}
          </Animated.View>

          {steps && (
            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>Steps:</Text>
              <Text style={styles.stepsText}>{steps}</Text>
            </View>
          )}

          {/* ── Mode segmented control ── */}
          <View
            style={styles.modeTrack}
            onLayout={(e) => setModeSegWidth((e.nativeEvent.layout.width - 6) / 2)}
          >
            {/* Sliding white thumb */}
            {modeSegWidth > 0 && (
              <Animated.View
                style={[
                  styles.modeThumb,
                  { width: modeSegWidth },
                  {
                    transform: [{
                      translateX: modeSlideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, modeSegWidth],
                      }),
                    }],
                  },
                ]}
              />
            )}

            {/* Word by Word segment */}
            <TouchableOpacity
              style={styles.modeSegment}
              onPress={handleWordMode}
              activeOpacity={0.75}
            >
              <Animated.Text style={[styles.modeSegIcon, { transform: [{ scale: modeIconScale0 }] }]}>🎯</Animated.Text>
              <Text style={[styles.modeSegLabel, currentMode === 'word' && styles.modeSegLabelActive]}>
                Word by Word
              </Text>
            </TouchableOpacity>

            {/* Full Dua segment */}
            <TouchableOpacity
              style={styles.modeSegment}
              onPress={handleFullMode}
              activeOpacity={0.75}
            >
              <Animated.Text style={[styles.modeSegIcon, { transform: [{ scale: modeIconScale1 }] }]}>📖</Animated.Text>
              <Text style={[styles.modeSegLabel, currentMode === 'full' && styles.modeSegLabelActive]}>
                Complete Dua
              </Text>
            </TouchableOpacity>
          </View>

          {/* Audio Error Display */}
          {loadError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Audio Error: {loadError}</Text>
            </View>
          )}

          <View style={styles.duaTextContainer}>
            {currentMode === 'word' ? (
              <WordByWordDisplay
                arabicText={arabic}
                currentWordIndex={currentWordIndex}
                isPlaying={isPlaying}
                translationText={translation}
                referenceText={reference}
                wordAudioPairs={wordAudioPairs}
                arabicFontSize={arabicFontSize}
              />
            ) : (
              <CombinedDuaDisplay
                arabic={arabic}
                translation={translation}
                reference={reference}
                arabicFontSize={arabicFontSize}
              />
            )}
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </SwipeNavigation>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <BouncingButton
            onPress={navigateToPrevDua}
            style={currentDuaIndex === 0 ? styles.disabledButton : {}}
          >
            <LinearGradient
              colors={currentDuaIndex === 0 ? ['#CCCCCC', '#DDDDDD'] : ['#7E57C2', '#9C77D9']}
              style={styles.gradientBorder}
            >
              <Image
                source={BtnPrevious}
                style={[
                  styles.footerNavButton,
                  currentDuaIndex === 0 && styles.disabledButtonImage
                ]}
              />
            </LinearGradient>
          </BouncingButton>

          <View style={styles.repeatButtonContainer}>
            <Animated.View style={{ transform: [{ scale: repeatScale }] }}>
              <BouncingButton onPress={handleRepeat}>
                <LinearGradient
                  colors={['#FFD166', '#FFB347']}
                  style={styles.gradientBorder}
                >
                  <Image source={BtnRepeat} style={styles.controlButton} />
                </LinearGradient>
              </BouncingButton>
            </Animated.View>

            {repeatMode !== 'empty' && (
              <View style={[
                styles.repeatBadgeSmall,
                repeatMode === 'infinite' && styles.repeatBadgeInfinite
              ]}>
                <Text style={styles.repeatBadgeSmallText}>
                  {repeatMode === 'infinite' ? '∞' : repeatMode}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.playButtonWrapper}>
            {(isPlaying || isPlayingTitleAudio) && [ring1Anim, ring2Anim, ring3Anim].map((ring, i) => (
              <Animated.View
                key={i}
                pointerEvents="none"
                style={[
                  styles.playRing,
                  {
                    borderColor: isPlayingTitleAudio ? '#FFA726' : '#4ECDC4',
                    opacity: ring.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 0.65, 0] }),
                    transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }],
                  },
                ]}
              />
            ))}
            <Animated.View style={{
              transform: [
                { scale: playButtonScale },
                { scale: (isPlaying || isPlayingTitleAudio) ? pulseAnim : 1 }
              ]
            }}>
              <BouncingButton onPress={handlePlayPause}>
                <LinearGradient
                  colors={
                    isPlayingTitleAudio ? ['#FFA726', '#FF7043'] :
                    isPlaying ? ['#4ECDC4', '#26C6DA'] :
                    ['#7E57C2', '#9C77D9']
                  }
                  style={styles.gradientBorder}
                >
                  <Image
                    source={(isPlaying || isPlayingTitleAudio) ? BtnPause : BtnPlay}
                    style={styles.playButton}
                  />
                </LinearGradient>
              </BouncingButton>
            </Animated.View>
          </View>

          <BouncingButton
            onPress={navigateToNextDua}
            style={currentDuaIndex === allDuas.length - 1 ? styles.disabledButton : {}}
          >
            <LinearGradient
              colors={currentDuaIndex === allDuas.length - 1 ? ['#CCCCCC', '#DDDDDD'] : ['#7E57C2', '#9C77D9']}
              style={styles.gradientBorder}
            >
              <Image
                source={BtnNext}
                style={[
                  styles.footerNavButton,
                  currentDuaIndex === allDuas.length - 1 && styles.disabledButtonImage
                ]}
              />
            </LinearGradient>
          </BouncingButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.tertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.tertiary,
  },
  loadingText: {
    fontSize: 18,
    color: THEME.text.primary,
    marginTop: 16,
    fontFamily: 'title',
  },
  noDuasContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noDuasEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  noDuasText: {
    fontSize: 24,
    color: THEME.text.primary,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: 'title',
  },
  noDuasSubtext: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: 'translationtext',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: THEME.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.dark,
    fontFamily: 'title',
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.text.primary,
    marginTop: 2,
    fontFamily: 'translationtext',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  swipeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  swipeHint: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 100,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  swipeHintGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  swipeHintText: {
    color: THEME.text.light,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'reference',
  },
  illustrationContainer: {
    width: '100%',
    height: 250,
    overflow: 'hidden',
    backgroundColor: THEME.tertiary,
    position: 'relative',
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  favoriteButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  statusBadgeContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    zIndex: 10,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.30,
    shadowRadius: 6,
    elevation: 5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    letterSpacing: 0.2,
    fontFamily: 'reference',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: THEME.accent,
  },
  favoriteButtonEmoji: {
    fontSize: 18,
  },
  favoriteButtonEmojiActive: {
    fontSize: 20,
  },
  stepsContainer: {
    margin: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: `${THEME.success}20`,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: THEME.success,
  },
  stepsTitle: {
    fontSize: 16,
    color: THEME.success,
    marginBottom: 8,
    fontFamily: 'reference',
  },
  stepsText: {
    fontSize: 14,
    color: THEME.text.primary,
    lineHeight: 20,
    fontFamily: 'translationtext',
  },
  // ── Mode segmented control ──────────────────────────────────────
  modeTrack: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 2,
    height: 42,
    backgroundColor: '#4527A0',
    borderRadius: 12,
    padding: 3,
    position: 'relative',
  },
  modeThumb: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  modeSegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    zIndex: 1,
  },
  modeSegIcon: {
    fontSize: 15,
    lineHeight: 18,
  },
  modeSegLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.60)',
    letterSpacing: 0.1,
    fontFamily: 'reference',
  },
  modeSegLabelActive: {
    color: '#3D1D8A',
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FFE6E6',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  errorText: {
    fontSize: 14,
    color: '#E53E3E',
    fontFamily: 'translationtext',
  },
  duaTextContainer: {
    margin: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  wordByWordContainer: {
    minHeight: 50,
    justifyContent: 'center',
  },
  arabicTextContainer: {
    backgroundColor: THEME.neutral,
    borderRadius: 20,
    padding: 18,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 48,
    textAlign: 'right',
    color: THEME.text.primary,
    fontFamily: 'MyArabicFont',
  },
  arabicWord: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  currentWord: {
    fontWeight: 'bold',
  },
  translationInline: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${THEME.primary}20`,
  },
  translationText: {
    fontSize: 14,
    color: THEME.text.primary,
    lineHeight: 20,
    fontFamily: 'translationtext',
  },
  referenceInline: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${THEME.primary}10`,
  },
  referenceText: {
    fontSize: 13,
    color: THEME.text.secondary,
    fontStyle: 'italic',
    fontFamily: 'reference',
  },
  readingGuide: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${THEME.accent}20`,
    borderRadius: 12,
    alignItems: 'center',
  },
  readingGuideText: {
    fontSize: 14,
    color: THEME.text.primary,
    fontWeight: '600',
  },
  repeatBadge: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  repeatBadgeGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  repeatBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text.light,
  },
  repeatBadgeSmall: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: THEME.accent,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.neutral,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  repeatBadgeInfinite: {
    backgroundColor: THEME.primary,
  },
  repeatBadgeSmallText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: THEME.text.light,
  },
  repeatButtonContainer: {
    position: 'relative',
  },
  playButtonWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playRing: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2.5,
  },
  playStatusRow: {
    marginTop: 6,
    alignItems: 'center',
  },
  playStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.text.secondary,
    letterSpacing: 0.2,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 2,
  },
  footerNavButton: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
  },
  controlButton: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
  },
  playButton: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonImage: {
    opacity: 0.6,
  },
  bottomPadding: {
    height: 20,
  },
  celebrationContainer: {
    position: 'absolute',
    top: '25%',
    left: '5%',
    right: '5%',
    zIndex: 1000,
    pointerEvents: 'box-none',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  celebrationGradient: {
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  celebrationText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: THEME.text.light,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  celebrationSubtext: {
    fontSize: 20,
    color: THEME.text.light,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  celebrationHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  celebrationStars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  star: {
    fontSize: 28,
    marginHorizontal: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  closeButtonText: {
    color: THEME.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
