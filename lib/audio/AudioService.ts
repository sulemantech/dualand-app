// hooks/useCustomAudioPlayer.ts
import { AudioModule, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useEffect, useState } from 'react';

// Define proper TypeScript interfaces
interface PlaybackStatus {
  isLoaded: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  didJustFinish: boolean;
}

export const useCustomAudioPlayer = (audioSource?: string) => {
  const player = useAudioPlayer(audioSource ? { uri: audioSource } : null, {
    updateInterval: 100,
    downloadFirst: true,
  });
  
  const audioStatus = useAudioPlayerStatus(player);
  const [status, setStatus] = useState<PlaybackStatus>({
    isLoaded: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 0,
    didJustFinish: false
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Configure audio mode on mount
  useEffect(() => {
    const configureAudio = async () => {
      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: 'duckOthers',
        shouldPlayInBackground: false,
      });
    };

    configureAudio();
  }, []);

  // Update status when audioStatus changes
  useEffect(() => {
    if (audioStatus) {
      const newStatus: PlaybackStatus = {
        isLoaded: audioStatus.isLoaded || false,
        isPlaying: audioStatus.playing || false,
        positionMillis: (audioStatus.currentTime || 0) * 1000, // Convert to ms
        durationMillis: (audioStatus.duration || 0) * 1000,   // Convert to ms
        didJustFinish: audioStatus.didJustFinish || false
      };
      
      setStatus(newStatus);
      setIsPlaying(newStatus.isPlaying);
      setPosition(newStatus.positionMillis);
      setDuration(newStatus.durationMillis);
    }
  }, [audioStatus]);

  const play = async () => {
    try {
      await player.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pause = async () => {
    try {
      await player.pause();
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
      await player.seekTo(positionMs / 1000); // expo-audio uses seconds
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  };

  const replay = async () => {
    try {
      await player.seekTo(0);
      await player.play();
    } catch (error) {
      console.error('Error replaying audio:', error);
    }
  };

  const setPlaybackRate = async (rate: number) => {
    try {
      await player.setPlaybackRate(rate, 'medium');
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  const setVolume = async (volume: number) => {
    try {
      player.volume = Math.max(0, Math.min(1, volume));
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const toggleMute = async () => {
    try {
      player.muted = !player.muted;
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  // Create compatible status object
  const compatibleStatus = {
    isLoaded: status.isLoaded,
    playing: status.isPlaying,
    currentTime: status.positionMillis / 1000, // Convert to seconds
    duration: status.durationMillis / 1000,    // Convert to seconds
  };

  // Create player object with similar API
  const playerObject = {
    play,
    pause,
    seekTo: (seconds: number) => seekTo(seconds * 1000),
    setPlaybackRate,
    status: compatibleStatus,
    volume: player.volume,
    muted: player.muted,
    playbackRate: audioStatus?.playbackRate || 1,
  };

  return {
    player: playerObject,
    status: compatibleStatus,
    isPlaying,
    position,
    duration,
    play,
    pause,
    playPause,
    seekTo,
    replay,
    setPlaybackRate,
    setVolume,
    toggleMute,
    isMuted: player.muted,
    currentVolume: player.volume,
    isBuffering: audioStatus?.isBuffering || false,
    didJustFinish: audioStatus?.didJustFinish || false,
  };
};