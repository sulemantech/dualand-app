import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Image,
  LayoutAnimation,
  PanResponder,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  Vibration,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCustomAudioPlayer } from '../lib/audio/useCustomAudioPlayer';
import { Dua, getAllDuas, getWordAudioPairsByDua } from '../lib/data/duas';

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

const THEME = {
  primary: '#FF9A3D',
  secondary: '#FFF7D0',
  tertiary: '#E8F4FF',
  neutral: '#FFFFFF',
  accent: '#FFD166',
  success: '#4ECDC4',
  header: '#fcf8b1',
  text: {
    primary: '#2D4A63',
    secondary: '#6B7B8C',
    light: '#FFFFFF',
    dark: '#4A5C6B',
    accent: '#E53E3E',
  }
};

const localImages = {
  kaaba: require('../assets/images/kaaba.png'),
  dua_1: require('../assets/images/kaaba.png'),
  dua_2: require('../assets/images/dua_2.png'),
  dua_3: require('../assets/images/dua_3.png'),
  dua_4: require('../assets/images/dua_4.png'),
  dua_5: require('../assets/images/dua_5.png'),
  dua_6: require('../assets/images/dua_6.png'),
  dua_7: require('../assets/images/dua_7.png'),
  dua_8: require('../assets/images/dua_8.png'),
  dua_9: require('../assets/images/dua_9.png'),
  dua_10: require('../assets/images/dua_10.png'),
  dua_11: require('../assets/images/dua_11.png'),
  dua_12: require('../assets/images/dua_12.png'),
  dua_13: require('../assets/images/dua_13.png'),
  dua_14: require('../assets/images/dua_14.png'),
  dua_15: require('../assets/images/dua_15.png'),
  dua_16: require('../assets/images/dua_16.png'),
  dua_17: require('../assets/images/dua_17.png'),
  dua_18: require('../assets/images/dua_18.png'),
  dua_19: require('../assets/images/dua_19.png'),
  dua_20: require('../assets/images/dua_20.png'),
  dua_21: require('../assets/images/dua_21.png'),
  dua_22: require('../assets/images/dua_22.png'),
  dua_23: require('../assets/images/dua_23.png'),
  dua_24: require('../assets/images/dua_24.png'),
  dua_25: require('../assets/images/dua_25.png'),
  dua_26: require('../assets/images/dua_26.png'),
  dua_27: require('../assets/images/dua_27.png'),
  dua_28: require('../assets/images/dua_28.png'),
  dua_29: require('../assets/images/dua_29.png'),
  dua_30: require('../assets/images/dua_30.png'),
  dua_31: require('../assets/images/dua_31.png'),
  dua_32: require('../assets/images/dua_32.png'),
};

// FIXED: Updated getLocalImage function to handle undefined imagePath
const getLocalImage = (duaId: string, duaNumber?: string, localImageIndex?: string, imagePath?: string | any) => {
  console.log('🖼️ getLocalImage called with:', {
    duaId,
    duaNumber,
    localImageIndex,
    imagePath,
    imagePathType: typeof imagePath
  });

  // Case 1: If imagePath is already a require statement (number), return it directly
  if (imagePath && typeof imagePath === 'number') {
    console.log('✅ Using direct require statement from imagePath');
    return imagePath;
  }

  // Case 2: If imagePath is a string path
  if (imagePath && typeof imagePath === 'string') {
    try {
      const imageName = imagePath.split('/').pop()?.replace('.png', '') || 'kaaba';
      const imageKey = imageName as keyof typeof localImages;
      if (localImages[imageKey]) {
        console.log('✅ Found image from imagePath string:', imageName);
        return localImages[imageKey];
      }
    } catch (error) {
      console.log('❌ Error processing imagePath string:', error);
    }
  }

  // Case 3: Try localImageIndex
  if (localImageIndex && typeof localImageIndex === 'string') {
    const imageKey = `dua_${localImageIndex}` as keyof typeof localImages;
    if (localImages[imageKey]) {
      console.log('✅ Found image from localImageIndex:', localImageIndex);
      return localImages[imageKey];
    }
  }

  // Case 4: Try duaNumber
  if (duaNumber && typeof duaNumber === 'string') {
    const imageKey = `dua_${duaNumber}` as keyof typeof localImages;
    if (localImages[imageKey]) {
      console.log('✅ Found image from duaNumber:', duaNumber);
      return localImages[imageKey];
    }
  }

  // Case 5: Fallback to duaId-based image
  const imageIndex = (parseInt(duaId || '1') % 32) || 1;
  const fallbackImageKey = `dua_${imageIndex}` as keyof typeof localImages;
  const fallbackImage = localImages[fallbackImageKey] || localImages.kaaba;
  console.log('🔄 Using fallback image based on duaId:', imageIndex);
  return fallbackImage;
};

const FloatingParticles = React.memo(({ count = 8 }) => {
  const particles = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 800),
          Animated.timing(particle, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [particles]);

  
  const emojis = ['✨', '⭐', '🌟', '💫', '🦄', '🌈', '🎀', '🌸'];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle, index) => {
        const translateY = particle.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -height],
        });

        const opacity = particle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.6, 0],
        });

        const scale = particle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.8, 1, 0.8],
        });

        return (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              left: Math.random() * width,
              top: height + 30,
              transform: [{ translateY }, { scale }],
              opacity,
            }}
          >
            <Text style={{
              fontSize: 16,
              color: [THEME.primary, THEME.accent, THEME.success][index % 3]
            }}>
              {emojis[index % emojis.length]}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
});

const BouncingButton = ({ children, onPress, style = {} }: {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={style}
        activeOpacity={0.8}
        disabled={!onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const WordByWordDisplay = ({
  arabicText,
  currentWordIndex,
  isPlaying,
  translationText,
  referenceText
}: {
  arabicText: string;
  currentWordIndex: number;
  isPlaying: boolean;
  translationText: string;
  referenceText: string;
}) => {
  const words = (arabicText || "بِسْمِ اللّٰہِ").split(' ').filter(word => word.trim().length > 0);
  const [animations] = useState(() =>
    words.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    if (isPlaying && currentWordIndex < words.length && animations[currentWordIndex]) {
      if (currentWordIndex > 0 && animations[currentWordIndex - 1]) {
        Animated.timing(animations[currentWordIndex - 1], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      if (animations[currentWordIndex]) {
        Animated.sequence([
          Animated.timing(animations[currentWordIndex], {
            toValue: 1,
            duration: 500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animations[currentWordIndex], {
            toValue: 0.8,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }
    }
  }, [currentWordIndex, isPlaying, words.length]);

  const getWordAnimationStyle = (index: number) => {
    if (!animations[index]) {
      return {
        transform: [{ scale: 1 }],
        backgroundColor: 'transparent',
      };
    }

    const scale = animations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1],
    });

    const backgroundColor = animations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', THEME.primary + '40'],
    });

    return {
      transform: [{ scale }],
      backgroundColor,
    };
  };

  return (
    <View style={styles.wordByWordContainer}>
      <View style={styles.arabicTextContainer}>
        <Text style={styles.arabicText} dir="rtl">
          {words.map((word, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.arabicWord,
                getWordAnimationStyle(index),
                index === currentWordIndex && styles.currentWord,
              ]}
            >
              {word}{' '}
            </Animated.Text>
          ))}
        
        </Text>
        <Text style={styles.translationText}>
          {translationText}
        </Text>
        {referenceText && referenceText !== 'Reference not available' && (
          <>
            <Text style={styles.referenceTitle}>Reference</Text>
            <Text style={styles.referenceText}>{referenceText}</Text>
          </>
        )}
      </View>

      {/* <View style={styles.translationSection}>
        <Text style={styles.translationTitle}>Translation</Text>
        <Text style={styles.translationText}>
          {translationText}
        </Text>

        {referenceText && referenceText !== 'Reference not available' && (
          <>
            <Text style={styles.referenceTitle}>Reference</Text>
            <Text style={styles.referenceText}>{referenceText}</Text>
          </>
        )}
      </View> */}

      {isPlaying && (
        <View style={styles.readingGuide}>
          <Text style={styles.readingGuideText}>
            👆 Listening to word {currentWordIndex + 1} of {words.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const MashaAllahCelebration = ({ visible, onHide }: { visible: boolean; onHide: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [internalVisible, setInternalVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (visible && !internalVisible) {
      console.log('🎉 Starting celebration animation');
      setInternalVisible(true);
      Vibration.vibrate(300);

      // Clear any existing timeouts
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Reset animations to initial state
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);

      // Start show animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();

      // Set timeout to hide after 2 seconds
      hideTimeoutRef.current = setTimeout(() => {
        console.log('🎉 Starting hide animation');
        hideCelebration();
      }, 2000);

    } else if (!visible && internalVisible) {
      // If visibility is set to false while celebration is showing, hide it
      hideCelebration();
    }
  }, [visible, internalVisible]);

  const hideCelebration = () => {
    console.log('🎉 Hiding celebration');
    
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Start hide animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start(({ finished }) => {
      if (finished) {
        console.log('🎉 Hide animation completed');
        setInternalVisible(false);
        onHide();
      }
    });
  };

  const handleManualClose = () => {
    console.log('🎉 Manual close triggered');
    hideCelebration();
  };

  if (!internalVisible) return null;

  return (
    <Animated.View
      style={[
        styles.celebrationContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={['#FFD166', '#FFB347', '#FF9A3D']}
        style={styles.celebrationGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleManualClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.celebrationText}>ماشاءالله</Text>
        <Text style={styles.celebrationSubtext}>Masha'Allah! You completed the Dua!</Text>
        <View style={styles.celebrationStars}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>🌟</Text>
          <Text style={styles.star}>✨</Text>
          <Text style={styles.star}>🎉</Text>
          <Text style={styles.star}>🕌</Text>
        </View>
        <Text style={styles.celebrationHint}>Continue to next Dua or replay</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const RepeatBadge = ({ mode, isVisible }: { mode: string; isVisible: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 0,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        ]).start();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, mode]);

  if (!isVisible) return null;

  const getBadgeColors = () => {
    switch (mode) {
      case '1': return ['#4ECDC4', '#26C6DA'];
      case '2': return ['#FFD166', '#FFB347'];
      case '3': return ['#FF6B6B', '#FF8E8E'];
      case 'infinite': return ['#7E57C2', '#9C77D9'];
      default: return [THEME.primary, THEME.accent];
    }
  };

  const getBadgeText = () => {
    switch (mode) {
      case '1': return 'Repeat 1x';
      case '2': return 'Repeat 2x';
      case '3': return 'Repeat 3x';
      case 'infinite': return 'Repeat ∞';
      default: return 'Repeat';
    }
  };

  return (
    <Animated.View
      style={[
        styles.repeatBadge,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={getBadgeColors()}
        style={styles.repeatBadgeGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.repeatBadgeText}>{getBadgeText()}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// FIXED Swipe Navigation Component
const SwipeNavigation = ({
  onSwipeLeft,
  onSwipeRight,
  children
}: {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only capture horizontal swipes, ignore vertical movements
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 1.5);
        return isHorizontalSwipe;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 1.5);
        return isHorizontalSwipe;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        const swipeThreshold = 40;

        if (dx > swipeThreshold) {
          console.log('➡️ Swipe right - Previous dua');
          onSwipeRight();
        } else if (dx < -swipeThreshold) {
          console.log('⬅️ Swipe left - Next dua');
          onSwipeLeft();
        }
      },
      onPanResponderTerminate: () => null,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  return (
    <View style={styles.swipeContainer} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

export default function DuaDetailScreen() {
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
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'empty' | '1' | '2' | '3' | 'infinite'>('empty');
  const [showRepeatBadge, setShowRepeatBadge] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  
  // ✅ IMPROVED: Track completion state with better management
  const [hasCompletedPlayback, setHasCompletedPlayback] = useState(false);
  const [isCelebrationVisible, setIsCelebrationVisible] = useState(false);

  // Use ref to track current index to avoid stale closures
  const currentDuaIndexRef = useRef(currentDuaIndex);
  const celebrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update ref whenever currentDuaIndex changes
  useEffect(() => {
    currentDuaIndexRef.current = currentDuaIndex;
  }, [currentDuaIndex]);

  // ✅ FIXED: Helper functions for repeat logic
  const getRepeatCount = useCallback(() => {
    switch (repeatMode) {
      case '1': return 1;
      case '2': return 2;
      case '3': return 3;
      case 'infinite': return Infinity;
      default: return 0;
    }
  }, [repeatMode]);

  const checkShouldRepeat = useCallback((currentIteration: number) => {
    const totalRepeats = getRepeatCount();
    const shouldRepeat = currentIteration < totalRepeats;
    console.log(`🔄 Check Repeat: current=${currentIteration}, total=${totalRepeats}, shouldRepeat=${shouldRepeat}`);
    return shouldRepeat;
  }, [getRepeatCount]);

  // ✅ FIXED: Clean up celebration timeouts
  useEffect(() => {
    return () => {
      if (celebrationTimeoutRef.current) {
        clearTimeout(celebrationTimeoutRef.current);
      }
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

  // ✅ FIXED: Enhanced celebration handler
const triggerCelebration = useCallback(() => {
  console.log('🎉 Triggering MashaAllah celebration - current state:', {
    isCelebrationVisible,
    showCelebration,
    hasCompletedPlayback
  });
  
  if (!isCelebrationVisible && !showCelebration) {
    console.log('🎉 Setting celebration states to true');
    setShowCelebration(true);
    setIsCelebrationVisible(true);
    setHasCompletedPlayback(true);
  } else {
    console.log('🎉 Celebration already visible, skipping');
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

  // ✅ FIXED: Safe data extraction with fallbacks
  const getDuaData = () => {
    if (currentDua) {
      const data = {
        arabic: currentDua.arabic_text || "بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ",
        translation: currentDua.translation || "Translation not available",
        reference: currentDua.reference || "Reference not available",
        title: currentDua.title || "Beautiful Dua",
        duaNumber: currentDua.duaNumber || currentDua.order_index?.toString() || "1",
        id: currentDua.id || '',
        categoryName: currentDua.textheading || '',
        steps: currentDua.steps || '',
        imagePath: currentDua.image_path,
        audioFull: currentDua.audio_full || '',
        audioWordByWord: currentDua.audio_word_by_word || ''
      };

      console.log('📋 Current Dua Data:', {
        id: data.id,
        title: data.title,
        audioFull: data.audioFull,
        audioWordByWord: data.audioWordByWord
      });

      return data;
    }

    // Fallback for initial load
    const fallbackData = {
      arabic: getStringParam(params.arabic) || "بِسْمِ اللّٰہِ الرَّحْمٰنِ الرَّحِیْمِ",
      translation: getStringParam(params.translation) || "Translation not available",
      reference: getStringParam(params.reference) || "Reference not available",
      title: getStringParam(params.title) || "Beautiful Dua",
      duaNumber: getStringParam(params.duaNumber) || "1",
      id: getStringParam(params.id) || '',
      categoryName: getStringParam(params.categoryName) || '',
      steps: getStringParam(params.steps) || '',
      imagePath: getStringParam(params.imagePath) || '',
      audioFull: getStringParam(params.audio_full) || '',
      audioWordByWord: getStringParam(params.audio_word_by_word) || ''
    };

    return fallbackData;
  };

  const { arabic, translation, reference, title, duaNumber, id, categoryName, steps, imagePath, audioFull, audioWordByWord } = getDuaData();

  useEffect(() => {
    if (id) {
      try {
        const pairs = getWordAudioPairsByDua(id);
        console.log(`🔊 Loaded ${pairs?.length || 0} word audio pairs for dua ${id}`);
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

    console.log('🎵 Audio source for mode:', {
      mode: currentMode,
      source: audioSource,
      type: typeof audioSource,
      hasValue: !!audioSource,
      wordAudioPairsCount: wordAudioPairs?.length || 0
    });

    // Return undefined for word mode - we'll handle it with wordAudioPairs
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
    position: audioPosition,
    duration: audioDuration,
    seekTo: audioSeekTo,
    setVolume: audioSetVolume,
    toggleMute: audioToggleMute,
    isMuted: audioIsMuted,
    currentVolume: audioCurrentVolume,
    isBuffering: audioIsBuffering,
    didJustFinish: audioDidJustFinish,
    loadError,
  } = useCustomAudioPlayer(
    currentMode === 'full' ? getAudioUrlForCurrentMode() : undefined
  );

  const playButtonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const favoriteScale = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;
  const repeatScale = useRef(new Animated.Value(1)).current;
  const swipeHintOpacity = useRef(new Animated.Value(1)).current;

  // FIXED: Use the updated getLocalImage function with proper error handling
  const illustrationImage = getLocalImage(
    id || '1',
    duaNumber,
    ((parseInt(id || '1')) % 32) + 1,
    imagePath
  );

  // ✅ FIXED: Safe words array initialization
  const words = (arabic || "بِسْمِ اللّٰہِ").split(' ').filter(word => word.trim().length > 0);

  // ✅ ADDED: Function to play individual word audio
  const playWordAudio = async (audioSource: any): Promise<void> => {
    return new Promise(async (resolve) => {
      try {
        const { sound } = await Audio.Sound.createAsync(audioSource);

        // Set up playback status update to detect when audio finishes
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync().then(() => {
              resolve();
            });
          }
        });

        await sound.playAsync();

        // Fallback: if we can't detect completion, resolve after estimated duration
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.durationMillis) {
          setTimeout(() => {
            sound.unloadAsync().then(() => {
              resolve();
            });
          }, status.durationMillis + 100); // Add small buffer
        } else {
          // Default fallback
          setTimeout(() => {
            sound.unloadAsync().then(() => {
              resolve();
            });
          }, 1500);
        }
      } catch (error) {
        console.error('Error playing word audio:', error);
        resolve(); // Always resolve to continue playback
      }
    });
  };

  // ✅ FIXED: Reset completion state when changing modes or duas
  useEffect(() => {
    resetCompletionState();
  }, [currentMode, currentDuaIndex, resetCompletionState]);

  // ✅ FIXED: Reset completion state when starting new playback
  useEffect(() => {
    if (isPlaying) {
      // Only reset if we're actually starting fresh, not resuming
      if (currentWordIndex === 0 && currentRepeatIteration === 0) {
        setHasCompletedPlayback(false);
      }
    }
  }, [isPlaying, currentWordIndex, currentRepeatIteration]);

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

        // Restart audio for repeat
        const restartAudio = async () => {
          try {
            console.log('🔄 Restarting audio for repeat...');
            await new Promise(resolve => setTimeout(resolve, 100));
            await audioReplay();
            console.log('✅ Audio restarted successfully for repeat');
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

  // ✅ FIXED: Enhanced word-by-word completion handler
  useEffect(() => {
    let currentAudioIndex = 0;
    let currentIteration = currentRepeatIteration;
    let isCancelled = false;

    const playWordByWord = async () => {
      if (isCancelled || !isPlaying || hasCompletedPlayback) return;

      console.log(`🔊 Starting word playback: iteration=${currentIteration}, words=${wordAudioPairs.length}`);

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

        currentAudioIndex++;

        // Check if we completed all words in this iteration
        if (currentAudioIndex >= (wordAudioPairs?.length || 0)) {
          console.log(`🎉 Word-by-word playback completed iteration ${currentIteration + 1}`);

          const shouldRepeat = checkShouldRepeat(currentIteration);

          if (shouldRepeat) {
            // Repeat the playback
            console.log(`🔄 Repeating word playback (${currentIteration + 1}/${getRepeatCount()})`);
            const nextIteration = currentIteration + 1;
            
            // Update state and wait briefly
            setCurrentRepeatIteration(nextIteration);
            await new Promise(resolve => setTimeout(resolve, 500));

            if (isPlaying && !isCancelled && !hasCompletedPlayback) {
              currentAudioIndex = 0;
              currentIteration = nextIteration;
              setCurrentWordIndex(0);
              console.log(`🔄 Starting repeat iteration ${nextIteration}`);
              continue;
            }
          } else {
            // Finished all repetitions - trigger celebration
            if (!isCancelled && !hasCompletedPlayback) {
              console.log('🎉 Word-by-word playback fully completed - showing celebration');
              setIsPlaying(false);
              setCurrentWordIndex(0);
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
    };
  }, [isPlaying, currentMode, wordAudioPairs, currentRepeatIteration, checkShouldRepeat, getRepeatCount, hasCompletedPlayback, triggerCelebration]);

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

  // FIXED: Debug current state
  useEffect(() => {
    if (!isLoading) {
      console.log('🔄 STATE UPDATE:', {
        currentDuaIndex,
        totalDuas: allDuas.length,
        currentDuaTitle: currentDua?.title,
        isLoading,
        isPlaying: audioIsPlaying,
        currentMode,
        audioFull,
        audioWordByWord,
        wordAudioPairsCount: wordAudioPairs?.length || 0,
        loadError,
        repeatMode,
        currentRepeatIteration,
        hasCompletedPlayback,
        isCelebrationVisible,
        showCelebration
      });
    }
  }, [currentDuaIndex, allDuas.length, isLoading, audioIsPlaying, currentDua, currentMode, audioFull, audioWordByWord, wordAudioPairs, loadError, repeatMode, currentRepeatIteration, hasCompletedPlayback, isCelebrationVisible, showCelebration]);

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
    if (isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
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
  }, [isPlaying, pulseAnim]);

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
    setCurrentWordIndex(0);
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

  // ✅ FIXED: Enhanced play/pause handler with completion state reset
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
            await audioReplay();
          } else {
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
            setCurrentWordIndex(0);
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
  }, [isPlaying, currentMode, hasCompletedPlayback, currentWordIndex, wordAudioPairs, words.length, audioReplay, audioPlay, audioPause, playButtonScale, resetCompletionState]);

  const handleFavorite = useCallback(() => {
    Vibration.vibrate(50);
    setIsFavorite(!isFavorite);

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
  }, [isFavorite, favoriteScale]);

  // ✅ FIXED: Enhanced repeat handler
  const handleRepeat = useCallback(() => {
    Vibration.vibrate(30);

    const modes: Array<'empty' | '1' | '2' | '3' | 'infinite'> = ['empty', '1', '2', '3', 'infinite'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];

    console.log(`🔄 Repeat mode changing: ${repeatMode} -> ${nextMode}`);
    
    setRepeatMode(nextMode);
    resetCompletionState();
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
  }, [repeatMode, repeatScale, resetCompletionState]);

  const handleBack = useCallback(() => {
    // Stop audio when going back
    if (isPlaying) {
      if (currentMode === 'full') {
        audioPause();
      }
      setIsPlaying(false);
    }
    router.back();
  }, [isPlaying, audioPause, router, currentMode]);

  const handleHome = useCallback(() => {
    // Stop audio when going home
    if (isPlaying) {
      if (currentMode === 'full') {
        audioPause();
      }
      setIsPlaying(false);
    }
    router.push('/');
  }, [isPlaying, audioPause, router, currentMode]);

  // UPDATED: Mode change handlers
  const handleWordMode = useCallback(() => {
    setCurrentMode('word');
    if (isPlaying) {
      if (currentMode === 'full') {
        audioPause();
      }
      setIsPlaying(false);
    }
    resetCompletionState();
    setCurrentWordIndex(0);
  }, [isPlaying, audioPause, currentMode, resetCompletionState]);

  const handleFullMode = useCallback(() => {
    setCurrentMode('full');
    if (isPlaying) {
      setIsPlaying(false);
    }
    resetCompletionState();
    setCurrentWordIndex(0);
  }, [isPlaying, resetCompletionState]);

  // ✅ ADDED: Display current repeat status in UI
  const getRepeatStatusText = () => {
    if (repeatMode === 'empty' || currentRepeatIteration === 0) return '';

    const totalRepeats = getRepeatCount();
    if (totalRepeats === Infinity) {
      return ` (Repeat ∞ - #${currentRepeatIteration})`;
    } else {
      return ` (Repeat ${currentRepeatIteration}/${totalRepeats})`;
    }
  };

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
              {categoryName ? `${categoryName} • ` : ''}Dua {currentDuaIndex + 1} of {allDuas.length}
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

      <FloatingParticles />

      {/* ✅ FIXED: Celebration component with proper handlers */}
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
          </Animated.View>

          {steps && (
            <View style={styles.stepsContainer}>
              <Text style={styles.stepsTitle}>Steps:</Text>
              <Text style={styles.stepsText}>{steps}</Text>
            </View>
          )}

          <View style={styles.modeContainer}>
            <View style={styles.modePills}>
              <TouchableOpacity
                style={[
                  styles.modePill,
                  currentMode === 'word' && styles.modePillActive
                ]}
                onPress={handleWordMode}
              >
                <Text style={[
                  styles.modePillText,
                  currentMode === 'word' && styles.modePillTextActive
                ]}>
                  🎯 Word by Word
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modePill,
                  currentMode === 'full' && styles.modePillActive
                ]}
                onPress={handleFullMode}
              >
                <Text style={[
                  styles.modePillText,
                  currentMode === 'full' && styles.modePillTextActive
                ]}>
                  📖 Full Dua
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ✅ NEW: Audio Error Display */}
          {loadError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Audio Error: {loadError}</Text>
            </View>
          )}

          {/* ✅ NEW: Audio Debug Info */}
          {/* {__DEV__ && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>
                Audio: {audioStatus?.isLoaded ? 'Loaded✅' : 'Not Loaded❌'} |
                Playing: {isPlaying ? 'Yes▶️' : 'No⏸️'} |
                Mode: {currentMode} |
                Words: {wordAudioPairs.length} |
                Repeat: {repeatMode} {getRepeatStatusText()} |
                Completed: {hasCompletedPlayback ? 'Yes✅' : 'No❌'} |
                Celebration: {isCelebrationVisible ? 'Visible🎉' : 'Hidden'}
              </Text>
            </View>
          )} */}

          <View style={styles.duaTextContainer}>
            {currentMode === 'word' ? (
              <WordByWordDisplay
                arabicText={arabic}
                currentWordIndex={currentWordIndex}
                isPlaying={isPlaying}
                translationText={translation}
                referenceText={reference}
              />
            ) : (
              <View style={styles.fullDuaContainer}>
                <View style={styles.arabicTextContainer}>
                  <Text style={styles.arabicText} dir="rtl">
                    {arabic}
                    
                  </Text>
                  <Text style={styles.translationText}>{translation}</Text>
                  {reference && reference !== 'Reference not available' && (
                    <>
                      <Text style={styles.referenceTitle}>Reference</Text>
                      <Text style={styles.referenceText}>{reference}</Text>
                    </>
                  )}
                </View>
                {/* <View style={styles.translationSection}>
                  <Text style={styles.translationTitle}>Translation</Text>
                  <Text style={styles.translationText}>
                    {translation}
                  </Text>

                </View> */}
              </View>
            )}

            {/* {currentMode === 'full' && (
              <View style={styles.fullDuaHint}>
                <Text style={styles.hintText}>Tap play to listen to the full dua 🔊</Text>
              </View>
            )} */}
          </View>

          {isPlaying && currentMode === 'word' && (
            <View style={styles.wordProgress}>
              <Text style={styles.wordProgressText}>
                Word {currentWordIndex + 1} of {wordAudioPairs.length}
                {getRepeatStatusText()}
              </Text>
              <View style={styles.wordProgressBar}>
                <View
                  style={[
                    styles.wordProgressFill,
                    {
                      width: `${((currentWordIndex + 1) / wordAudioPairs.length) * 100}%`
                    }
                  ]}
                />
              </View>
              {/* ✅ NEW: Show current word being played */}
              {wordAudioPairs[currentWordIndex] && (
                <Text style={styles.currentWordText}>
                  🔊 {wordAudioPairs[currentWordIndex].word_text}
                </Text>
              )}
            </View>
          )}

          {/* Audio progress for full mode */}
          {isPlaying && currentMode === 'full' && audioFull && (
            <View style={styles.wordProgress}>
              <Text style={styles.wordProgressText}>
                {audioIsBuffering ? 'Buffering...' : `Playing ${Math.round(audioPosition / 1000)}s / ${Math.round(audioDuration / 1000)}s`}
                {getRepeatStatusText()}
              </Text>
              <View style={styles.wordProgressBar}>
                <View
                  style={[
                    styles.wordProgressFill,
                    {
                      width: audioDuration > 0
                        ? `${(audioPosition / audioDuration) * 100}%`
                        : '0%'
                    }
                  ]}
                />
              </View>
            </View>
          )}

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

          <Animated.View style={{
            transform: [
              { scale: playButtonScale },
              { scale: isPlaying ? pulseAnim : 1 }
            ]
          }}>
            <BouncingButton onPress={handlePlayPause}>
              <LinearGradient
                colors={['#4ECDC4', '#26C6DA']}
                style={styles.gradientBorder}
              >
                <Image
                  source={isPlaying ? BtnPause : BtnPlay}
                  style={styles.playButton}
                />
              </LinearGradient>
            </BouncingButton>
          </Animated.View>

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
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginTop: 16,
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
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  noDuasSubtext: {
    fontSize: 16,
    color: THEME.text.secondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
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
    paddingTop: 50,
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
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.text.primary,
    marginTop: 2,
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
    fontWeight: 'bold',
    textAlign: 'center',
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
    fontWeight: 'bold',
    color: THEME.success,
    marginBottom: 8,
  },
  stepsText: {
    fontSize: 14,
    color: THEME.text.primary,
    lineHeight: 20,
  },
  modeContainer: {
    marginTop: 0,
    marginHorizontal: 10,
    zIndex: 10,
  },
  modePills: {
    flexDirection: 'row',
    backgroundColor: THEME.neutral,
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modePillText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.text.secondary,
  },
  modePillTextActive: {
    color: THEME.text.light,
  },
  // ✅ NEW: Error container styles
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
    fontWeight: '500',
  },
  // ✅ NEW: Debug container styles
  debugContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  // ✅ NEW: Current word text style
  currentWordText: {
    fontSize: 16,
    color: THEME.primary,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
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
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
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
  fullDuaContainer: {
    minHeight: 50,
    justifyContent: 'center',
  },
  translationSection: {
    marginTop: 0,
    padding: 16,
    backgroundColor: `${THEME.primary}10`,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
  },
  translationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    marginBottom: 8,
  },
  translationText: {
    fontSize: 14,
    color: THEME.text.primary,
    lineHeight: 20,
    marginBottom: 12,
  },
  referenceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.text.secondary,
    marginBottom: 4,
  },
  referenceText: {
    fontSize: 13,
    color: THEME.text.secondary,
    fontStyle: 'italic',
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
  fullDuaHint: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${THEME.success}20`,
    borderRadius: 12,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: THEME.success,
    fontWeight: '600',
  },
  wordProgress: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  wordProgressText: {
    fontSize: 14,
    color: THEME.text.secondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  wordProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  wordProgressFill: {
    height: '100%',
    backgroundColor: THEME.success,
    borderRadius: 3,
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