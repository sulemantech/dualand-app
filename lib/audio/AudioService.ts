import { useAudioPlayer } from 'expo-audio';
import { useState, useEffect } from 'react';

export const useCustomAudioPlayer = (audioSource?: any) => {
  const player = useAudioPlayer(audioSource);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Monitor playback status
  useEffect(() => {
    if (player.status?.isLoaded) {
      setIsPlaying(player.status.isPlaying);
      setPosition(player.status.positionMillis || 0);
      setDuration(player.status.durationMillis || 0);
    }
  }, [player.status]);

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

  const seekTo = async (position: number) => {
    try {
      await player.seekTo(position);
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

  return {
    ...player,
    isPlaying,
    position,
    duration,
    play,
    pause,
    playPause,
    seekTo,
    replay,
  };
};