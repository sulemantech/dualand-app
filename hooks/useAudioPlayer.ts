import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export const useCustomAudioPlayer = (audioSource?: string) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [status, setStatus] = useState<Audio.AVPlaybackStatus>({
    isLoaded: false,
  } as Audio.AVPlaybackStatus);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        console.log('Unloading Audio Sound');
        sound.unloadAsync();
      }
    };
  }, [sound]);

  // Load audio when source changes
  useEffect(() => {
    if (audioSource) {
      loadSound(audioSource);
    } else {
      // Clean up if source is removed
      if (sound) {
        sound.unloadAsync();
        setSound(null);
      }
    }
  }, [audioSource]);

  const loadSound = async (source: string) => {
    try {
      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create audio sound with the source
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: source },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );

      setSound(newSound);
      
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  const onPlaybackStatusUpdate = (playbackStatus: Audio.AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) return;

    setStatus(playbackStatus);
    setIsPlaying(playbackStatus.isPlaying || false);
    setPosition(playbackStatus.positionMillis || 0);
    setDuration(playbackStatus.durationMillis || 0);
  };

  // Update local state when status changes
  useEffect(() => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying || false);
      setPosition(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
    }
  }, [status]);

  const play = async () => {
    try {
      if (sound) {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pause = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
      }
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const playPause = async () => {
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
        await sound.setRateAsync(rate, true); // true for pitch correction
      }
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      if (sound) {
        await sound.setVolumeAsync(Math.max(0, Math.min(1, volume))); // Clamp between 0-1
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const toggleMute = async () => {
    try {
      if (sound) {
        await sound.setIsMutedAsync(!(status as any).isMuted);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  // Create compatible status object for backward compatibility
  const compatibleStatus = {
    isLoaded: status.isLoaded || false,
    playing: (status.isLoaded && status.isPlaying) || false,
    currentTime: (status.isLoaded ? status.positionMillis || 0 : 0) / 1000, // Convert to seconds
    duration: (status.isLoaded ? status.durationMillis || 0 : 0) / 1000,   // Convert to seconds
    isBuffering: (status.isLoaded && status.isBuffering) || false,
    didJustFinish: (status.isLoaded && status.didJustFinish) || false,
    loop: false, // expo-av handles looping differently
    muted: (status.isLoaded && (status as any).isMuted) || false,
    volume: (status.isLoaded && (status as any).volume) || 1,
    playbackRate: (status.isLoaded && status.rate) || 1,
  };

  // Return a similar API structure for backward compatibility
  return {
    player: sound,
    status: compatibleStatus,
    isPlaying,
    position: status.isLoaded ? status.positionMillis || 0 : 0,
    duration: status.isLoaded ? status.durationMillis || 0 : 0,
    play,
    pause,
    playPause,
    seekTo,
    replay,
    setPlaybackRate,
    setVolume,
    toggleMute,
    // Additional expo-av specific methods
    replaceSource: (newSource: string) => {
      if (sound && newSource) {
        sound.unloadAsync().then(() => {
          loadSound(newSource);
        });
      } else if (newSource) {
        loadSound(newSource);
      }
    },
    isMuted: (status.isLoaded && (status as any).isMuted) || false,
    currentVolume: (status.isLoaded && (status as any).volume) || 1,
  };
};