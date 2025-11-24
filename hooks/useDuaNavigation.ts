import { useCallback, useEffect, useRef, useState } from 'react';
import { LayoutAnimation } from 'react-native';
import { Dua, getAllDuas } from '../lib/data/duas';

export const useDuaNavigation = (initialId?: string) => {
  const [allDuas, setAllDuas] = useState<Dua[]>([]);
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const currentDuaIndexRef = useRef(currentDuaIndex);

  useEffect(() => {
    currentDuaIndexRef.current = currentDuaIndex;
  }, [currentDuaIndex]);

  const loadDuas = useCallback(async () => {
    try {
      setIsLoading(true);
      const duas = getAllDuas();
      setAllDuas(duas);

      if (initialId) {
        const foundIndex = duas.findIndex(dua => dua.id === initialId);
        const index = foundIndex !== -1 ? foundIndex : 0;
        setCurrentDuaIndex(index);
        currentDuaIndexRef.current = index;
      }
    } catch (error) {
      console.error('Error loading duas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initialId]);

  const navigateToDua = useCallback((newIndex: number, onAudioStop?: () => void) => {
    if (newIndex < 0 || newIndex >= allDuas.length || isLoading) return;

    const currentIndex = currentDuaIndexRef.current;
    if (newIndex === currentIndex) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Stop audio if provided
    onAudioStop?.();
    
    setCurrentDuaIndex(newIndex);
    currentDuaIndexRef.current = newIndex;
  }, [allDuas.length, isLoading]);

  const navigateToNextDua = useCallback((onAudioStop?: () => void) => {
    const nextIndex = currentDuaIndexRef.current + 1;
    if (nextIndex < allDuas.length) {
      navigateToDua(nextIndex, onAudioStop);
    }
  }, [allDuas.length, navigateToDua]);

  const navigateToPrevDua = useCallback((onAudioStop?: () => void) => {
    const prevIndex = currentDuaIndexRef.current - 1;
    if (prevIndex >= 0) {
      navigateToDua(prevIndex, onAudioStop);
    }
  }, [navigateToDua]);

  return {
    allDuas,
    currentDuaIndex,
    isLoading,
    currentDua: allDuas[currentDuaIndex],
    loadDuas,
    navigateToDua,
    navigateToNextDua,
    navigateToPrevDua,
  };
};