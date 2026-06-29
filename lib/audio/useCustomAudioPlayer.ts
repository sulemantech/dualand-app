import { Audio } from 'expo-av';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useCustomAudioPlayer = (audioSource?: string | number | any) => {
  // Ref — always holds the live sound object regardless of when a closure was created.
  // Functions that act on the sound (play, pause, replay…) read soundRef.current so they
  // are never stale, even if they were captured in a useCallback before the sound loaded.
  const soundRef = useRef<Audio.Sound | null>(null);

  const [isPlaying,     setIsPlaying]     = useState(false);
  const [position,      setPosition]      = useState(0);
  const [duration,      setDuration]      = useState(0);
  const [isBuffering,   setIsBuffering]   = useState(false);
  const [didJustFinish, setDidJustFinish] = useState(false);
  const [isMuted,       setIsMuted]       = useState(false);
  const [currentVolume, setCurrentVolume] = useState(1);
  const [loadError,     setLoadError]     = useState<string | null>(null);

  // Configure audio session once on mount
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // Stable callback — uses only stable state setters, safe to pass to createAsync
  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying ?? false);
    setPosition(status.positionMillis ?? 0);
    setDuration(status.durationMillis ?? 0);
    setIsBuffering(status.isBuffering ?? false);
    setDidJustFinish(!!status.didJustFinish);
    if (status.isMuted  !== undefined) setIsMuted(status.isMuted);
    if (status.volume   !== undefined) setCurrentVolume(status.volume);
  }, []);

  // Load / reload sound whenever audioSource changes
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // Stop and unload whatever was playing before
      const prev = soundRef.current;
      soundRef.current = null;
      if (prev) {
        try { await prev.stopAsync();   } catch {}
        try { await prev.unloadAsync(); } catch {}
      }

      // Reset UI state
      setIsPlaying(false);
      setPosition(0);
      setDuration(0);
      setDidJustFinish(false);
      setLoadError(null);

      if (!audioSource) return;

      let soundSource: any;
      if (typeof audioSource === 'number') {
        soundSource = audioSource;                 // local require() resource
      } else if (typeof audioSource === 'string' && audioSource.trim() !== '') {
        soundSource = { uri: audioSource };
      } else {
        setLoadError('Invalid audio source');
        return;
      }

      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          soundSource,
          { shouldPlay: false, progressUpdateIntervalMillis: 500 },
          onPlaybackStatusUpdate,
        );

        if (cancelled) {
          try { await newSound.unloadAsync(); } catch {}
          return;
        }

        soundRef.current = newSound;
      } catch (error) {
        if (!cancelled) {
          console.error('❌ Error loading audio:', error);
          setLoadError(`Failed to load audio: ${error}`);
        }
      }
    };

    load();

    return () => {
      // Mark the in-progress load as stale so it drops its result
      cancelled = true;
      // Unload whatever sound is currently active
      const s = soundRef.current;
      soundRef.current = null;
      if (s) {
        s.stopAsync().catch(() => {});
        s.unloadAsync().catch(() => {});
      }
    };
  }, [audioSource, onPlaybackStatusUpdate]);

  // ── Actions — all read soundRef.current so they are never stale ──────────────

  const play = useCallback(async () => {
    try {
      if (soundRef.current) {
        console.log('🔊 Playing audio (soundRef set)...');
        await soundRef.current.playAsync();
      } else {
        console.log('❌ No sound loaded to play (soundRef is null)');
        setLoadError('No audio loaded');
      }
    } catch (error) {
      console.error('❌ Error playing audio:', error);
      setLoadError(`Play failed: ${error}`);
    }
  }, []);

  const pause = useCallback(async () => {
    try {
      if (soundRef.current) await soundRef.current.pauseAsync();
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }, []);

  const replay = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error replaying audio:', error);
    }
  }, []);

  const seekTo = useCallback(async (positionMs: number) => {
    try {
      if (soundRef.current) await soundRef.current.setPositionAsync(positionMs);
    } catch (error) {
      console.error('Error seeking audio:', error);
    }
  }, []);

  const setPlaybackRate = useCallback(async (rate: number) => {
    try {
      if (soundRef.current) await soundRef.current.setRateAsync(rate, true);
    } catch (error) {
      console.error('Error setting playback rate:', error);
    }
  }, []);

  const setVolume = useCallback(async (volume: number) => {
    try {
      if (soundRef.current) {
        const clamped = Math.max(0, Math.min(1, volume));
        await soundRef.current.setVolumeAsync(clamped);
        setCurrentVolume(clamped);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  }, []);

  const toggleMute = useCallback(async () => {
    try {
      if (soundRef.current) {
        const next = !isMuted;
        await soundRef.current.setIsMutedAsync(next);
        setIsMuted(next);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  }, [isMuted]);

  const playPause = useCallback(async () => {
    if (isPlaying) await pause(); else await play();
  }, [isPlaying, play, pause]);

  // Backward-compat status shape used by existing consumers
  const status = {
    isLoaded:    !!soundRef.current,
    playing:     isPlaying,
    currentTime: position  / 1000,
    duration:    duration  / 1000,
    isBuffering,
    didJustFinish,
    loop:         false,
    muted:        isMuted,
    volume:       currentVolume,
    playbackRate: 1,
  };

  return {
    isPlaying,
    position,
    duration,
    isBuffering,
    didJustFinish,
    isMuted,
    currentVolume,
    loadError,
    play,
    pause,
    playPause,
    replay,
    seekTo,
    setPlaybackRate,
    setVolume,
    toggleMute,
    status,
    player: {
      play,
      pause,
      seekTo: (seconds: number) => seekTo(seconds * 1000),
      setPlaybackRate,
      status,
      volume:       currentVolume,
      muted:        isMuted,
      playbackRate: 1,
    },
  };
};
