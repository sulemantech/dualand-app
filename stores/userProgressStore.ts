import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type MemorizationStatus = 'not_started' | 'learning' | 'memorized';

interface UserProgressState {
  // Persisted data
  favorites: Record<string, boolean>;
  memorization: Record<string, MemorizationStatus>;
  practiceCount: Record<string, number>;

  // Actions
  toggleFavorite: (duaId: string) => void;
  setMemorizationStatus: (duaId: string, status: MemorizationStatus) => void;
  incrementPracticeCount: (duaId: string) => void;
  resetAllProgress: () => void;
}

const secureStoreAdapter = createJSONStorage(() => ({
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
}));

export const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set) => ({
      favorites: {},
      memorization: {},
      practiceCount: {},

      toggleFavorite: (duaId) =>
        set((state) => ({
          favorites: { ...state.favorites, [duaId]: !state.favorites[duaId] },
        })),

      setMemorizationStatus: (duaId, status) =>
        set((state) => ({
          memorization: { ...state.memorization, [duaId]: status },
        })),

      incrementPracticeCount: (duaId) =>
        set((state) => ({
          practiceCount: {
            ...state.practiceCount,
            [duaId]: (state.practiceCount[duaId] ?? 0) + 1,
          },
        })),

      resetAllProgress: () => set({ favorites: {}, memorization: {}, practiceCount: {} }),
    }),
    {
      name: 'dualand_progress',
      storage: secureStoreAdapter,
      // Only persist data fields — never serialize action functions
      partialize: (state) => ({
        favorites: state.favorites,
        memorization: state.memorization,
        practiceCount: state.practiceCount,
      }),
    }
  )
);
