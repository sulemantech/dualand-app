import { Audio } from 'expo-av';
import { useCallback, useEffect, useState } from 'react';
import { useCustomAudioPlayer } from '../lib/audio/useCustomAudioPlayer';

export const useDuaPlayer = (currentDua: any, currentMode: 'full' | 'word') => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentRepeatIteration, setCurrentRepeatIteration] = useState(0);
  const [repeatMode, setRepeatMode] = useState<'empty' | '1' | '2' | '3' | 'infinite'>('empty');
  const [hasShownCompletion, setHasShownCompletion] = useState(false);
  const [titleAudioSound, setTitleAudioSound] = useState<Audio.Sound | null>(null);
  const [isTitleAudioPlaying, setIsTitleAudioPlaying] = useState(false);
  const [completionHandled, setCompletionHandled] = useState(false);

  const audioUrl = currentMode === 'full' ? currentDua?.audioFull : undefined;
  
  const {
    isPlaying: audioIsPlaying,
    play: audioPlay,
    pause: audioPause,
    status: audioStatus,
    position: audioPosition,
    duration: audioDuration,
    didJustFinish: audioDidJustFinish,
    loadError,
  } = useCustomAudioPlayer(audioUrl);

  // Sync playing states
  useEffect(() => {
    setIsPlaying(audioIsPlaying || isTitleAudioPlaying);
  }, [audioIsPlaying, isTitleAudioPlaying]);

  // Audio completion handler
  useEffect(() => {
    if (audioDidJustFinish && currentMode === 'full' && !isTitleAudioPlaying && !completionHandled) {
      handleAudioCompletion();
    }
  }, [audioDidJustFinish, currentMode, isTitleAudioPlaying, completionHandled]);

  const handleAudioCompletion = useCallback(() => {
    setCompletionHandled(true);
    // ... existing completion logic
  }, [currentRepeatIteration, repeatMode, hasShownCompletion]);

  const playTitleAudio = useCallback(async (): Promise<void> => {
    // ... existing title audio logic
  }, [currentDua?.titleAudioResId, titleAudioSound]);

  const playFullAudioAfterTitle = useCallback(async () => {
    try {
      await audioPlay();
    } catch (error) {
      console.error('Error playing full audio:', error);
    }
  }, [audioPlay]);

  const handlePlayPause = useCallback(async () => {
    // ... existing play/pause logic
  }, [isPlaying, isTitleAudioPlaying, currentMode, /* other dependencies */]);

  const handleRepeat = useCallback(() => {
    // ... existing repeat logic
  }, [repeatMode]);

  return {
    // State
    isPlaying,
    currentWordIndex,
    currentRepeatIteration,
    repeatMode,
    hasShownCompletion,
    isTitleAudioPlaying,
    loadError,
    audioPosition,
    audioDuration,
    
    // Actions
    handlePlayPause,
    handleRepeat,
    playTitleAudio,
    playFullAudioAfterTitle,
    setCurrentWordIndex,
    setCurrentRepeatIteration,
    setRepeatMode,
    setHasShownCompletion,
  };
};