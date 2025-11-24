import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export const useCustomAudioPlayer = (audioSource?: string | number | any) => {
  const [sound, setSound] = useState<Audio.Sound>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [didJustFinish, setDidJustFinish] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Configure audio mode on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // Load audio when source changes
  useEffect(() => {
    console.log('🔊 Audio source changed:', { 
      source: audioSource, 
      type: typeof audioSource 
    });

    if (audioSource) {
      loadSound(audioSource);
    } else {
      unloadSound();
    }

    return () => {
      unloadSound();
    };
  }, [audioSource]);

  const loadSound = async (source: string | number | any) => {
    try {
      setLoadError(null);
      
      // Unload any existing sound first
      if (sound) {
        await sound.unloadAsync();
      }

      let soundSource;
      
      if (typeof source === 'number') {
        // Local require statement
        soundSource = source;
        console.log('🔊 Loading local audio file');
      } else if (typeof source === 'string' && source.trim() !== '') {
        // URI string
        soundSource = { uri: source };
        console.log('🔊 Loading audio from URI:', source);
      } else {
        console.log('❌ Invalid audio source:', source);
        setLoadError('Invalid audio source');
        return;
      }

      console.log('🔊 Creating sound...');
      const { sound: newSound } = await Audio.Sound.createAsync(
        soundSource,
        { 
          shouldPlay: false,
          progressUpdateIntervalMillis: 500,
        },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      console.log('✅ Audio loaded successfully');

    } catch (error) {
      console.error('❌ Error loading audio:', error);
      setLoadError(`Failed to load audio: ${error}`);
    }
  };

  const unloadSound = async () => {
    try {
      if (sound) {
        console.log('🔊 Unloading sound...');
        await sound.unloadAsync();
        setSound(undefined);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        setDidJustFinish(false);
      }
    } catch (error) {
      console.error('Error unloading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: any) => {
    if (!playbackStatus) return;

    console.log('🔊 Playback status:', {
      isLoaded: playbackStatus.isLoaded,
      isPlaying: playbackStatus.isPlaying,
      position: playbackStatus.positionMillis,
      duration: playbackStatus.durationMillis,
      didJustFinish: playbackStatus.didJustFinish,
      isBuffering: playbackStatus.isBuffering
    });

    if (playbackStatus.isLoaded) {
      setIsPlaying(playbackStatus.isPlaying || false);
      setPosition(playbackStatus.positionMillis || 0);
      setDuration(playbackStatus.durationMillis || 0);
      setIsBuffering(playbackStatus.isBuffering || false);
      
      if (playbackStatus.didJustFinish) {
        setDidJustFinish(true);
        setIsPlaying(false);
      } else {
        setDidJustFinish(false);
      }

      if (playbackStatus.isMuted !== undefined) {
        setIsMuted(playbackStatus.isMuted);
      }
      if (playbackStatus.volume !== undefined) {
        setCurrentVolume(playbackStatus.volume);
      }
    }
  };

  const play = async () => {
    try {
      if (sound) {
        console.log('🔊 Playing audio...');
        await sound.playAsync();
      } else {
        console.log('❌ No sound loaded to play');
        setLoadError('No audio loaded');
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      setLoadError(`Play failed: ${error}`);
    }
  };

  const pause = async () => {
    try {
      if (sound) {
        console.log('🔊 Pausing audio...');
        await sound.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const playPause = async () => {
    console.log('🔊 Play/Pause triggered, current state:', isPlaying);
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  const seekTo = async (positionMs: number) => {
    try {
      if (sound) {
        await sound.setPositionAsync(positionMs);
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const replay = async () => {
    try {
      if (sound) {
        console.log('🔊 Replaying audio...');
        await sound.setPositionAsync(0);
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error replaying audio:', error);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (sound) {
        await sound.setRateAsync(rate, true);
      }
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      if (sound) {
        const newVolume = Math.max(0, Math.min(1, volume));
        await sound.setVolumeAsync(newVolume);
        setCurrentVolume(newVolume);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const toggleMute = async () => {
    try {
      if (sound) {
        const newMutedState = !isMuted;
        await sound.setIsMutedAsync(newMutedState);
        setIsMuted(newMutedState);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  // Create compatible status object for your component
  const status = {
    isLoaded: !!sound,
    playing: isPlaying,
    currentTime: position / 1000,
    duration: duration / 1000,
    isBuffering,
    didJustFinish,
    loop: false,
    muted: isMuted,
    volume: currentVolume,
    playbackRate: 1,
  };

  return {
    // Main state
    isPlaying,
    position,
    duration,
    isBuffering,
    didJustFinish,
    isMuted,
    currentVolume,
    loadError,
    
    // Control methods
    play,
    pause,
    playPause,
    replay,
    seekTo,
    setPlaybackRate,
    setVolume,
    toggleMute,
    
    // Backward compatibility
    status,
    player: {
      play,
      pause,
      seekTo: (seconds: number) => seekTo(seconds * 1000),
      setPlaybackRate,
      status,
      volume: currentVolume,
      muted: isMuted,
      playbackRate: 1,
    },
  };
};