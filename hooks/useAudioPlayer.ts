import { AudioModule, AudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

export const useCustomAudioPlayer = (audioSource?: string) => {
  const [player, setPlayer] = useState<AudioPlayer | null>(null);
  const status = useAudioPlayerStatus(player!);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (player) {
        console.log('Removing Audio Player');
        player.remove();
      }
    };
  }, [player]);

  // Load audio when source changes
  useEffect(() => {
    if (audioSource) {
      loadSound(audioSource);
    } else {
      // Clean up if source is removed
      if (player) {
        player.remove();
        setPlayer(null);
      }
    }
  }, [audioSource]);

  const loadSound = async (source: string) => {
    try {
      // Configure audio mode
      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: 'duckOthers',
        shouldPlayInBackground: false,
      });

      // Create audio player with the source
      // Note: expo-audio handles both local assets and remote URLs
      const audioPlayer = AudioModule.createAudioPlayer(
        { uri: source },
        {
          updateInterval: 100, // More frequent updates for better UX
          downloadFirst: true, // Download before playback for better performance
        }
      );

      setPlayer(audioPlayer);
      
    } catch (error) {
      console.error('Error loading audio:', error);
    }
  };

  // Update local state when status changes
  useEffect(() => {
    if (status) {
      setIsPlaying(status.playing || false);
      setPosition(status.currentTime || 0);
      setDuration(status.duration || 0);
    }
  }, [status]);

  const play = async () => {
    try {
      if (player) {
        await player.play();
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pause = async () => {
    try {
      if (player) {
        await player.pause();
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
      if (player) {
        await player.seekTo(positionMs / 1000); // expo-audio uses seconds
      }
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const replay = async () => {
    try {
      if (player) {
        await player.seekTo(0);
        await player.play();
      }
    } catch (error) {
      console.error('Error replaying audio:', error);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      if (player) {
        await player.setPlaybackRate(rate, 'medium');
      }
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      if (player) {
        player.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0-1
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const toggleMute = async () => {
    try {
      if (player) {
        player.muted = !player.muted;
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  // Return a similar API structure for backward compatibility
  return {
    player,
    status: {
      isLoaded: status?.isLoaded || false,
      playing: status?.playing || false,
      currentTime: status?.currentTime || 0,
      duration: status?.duration || 0,
      isBuffering: status?.isBuffering || false,
      didJustFinish: status?.didJustFinish || false,
      loop: status?.loop || false,
      muted: player?.muted || false,
      volume: player?.volume || 1,
      playbackRate: status?.playbackRate || 1,
    },
    isPlaying,
    position: (status?.currentTime || 0) * 1000, // Convert back to ms for compatibility
    duration: (status?.duration || 0) * 1000,   // Convert back to ms for compatibility
    play,
    pause,
    playPause,
    seekTo,
    replay,
    setPlaybackRate,
    setVolume,
    toggleMute,
    // Additional expo-audio specific methods
    replaceSource: (newSource: string) => {
      if (player && newSource) {
        player.replace({ uri: newSource });
      }
    },
    isMuted: player?.muted || false,
    currentVolume: player?.volume || 1,
  };
};