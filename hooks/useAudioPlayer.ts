import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useState, useEffect } from 'react';

export const useCustomAudioPlayer = (audioSource?: any) => {
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (status.isLoaded) {
      setIsPlaying(status.playing);
      setPosition(status.currentTime * 1000); // Convert to milliseconds
      setDuration(status.duration * 1000); // Convert to milliseconds
    }
  }, [status]);

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
      await player.seekTo(positionMs / 1000); // Convert to seconds
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
      await player.setPlaybackRate(rate);
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  };

  return {
    player,
    status,
    isPlaying,
    position,
    duration,
    play,
    pause,
    playPause,
    seekTo,
    replay,
    setPlaybackRate,
  };
};