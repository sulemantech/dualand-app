import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Separate type for the data fields so updateSetting can be typed correctly
export type AppSettingsData = {
  language: string;
  arabicFontSize: number;
  darkMode: boolean;
  readDuaTitle: boolean;
  readDuaTranslation: boolean;
  autoPlayAudio: boolean;
  wordByWordPause: boolean;
  pauseDuration: number;
  selectedVoiceId: string;
  enableRewards: boolean;
  autoNextDuas: boolean;
  hapticFeedback: boolean;
  notifications: boolean;
  cloudSync: boolean;
};

const DEFAULT_SETTINGS: AppSettingsData = {
  language: 'en',
  arabicFontSize: 24,
  darkMode: false,
  readDuaTitle: true,
  readDuaTranslation: true,
  autoPlayAudio: true,
  wordByWordPause: true,
  pauseDuration: 2,
  selectedVoiceId: '1',
  enableRewards: true,
  autoNextDuas: false,
  hapticFeedback: true,
  notifications: true,
  cloudSync: false,
};

interface AppSettingsState extends AppSettingsData {
  updateSetting: <K extends keyof AppSettingsData>(key: K, value: AppSettingsData[K]) => void;
  resetSettings: () => void;
}

const secureStoreAdapter = createJSONStorage(() => ({
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
}));

export const useAppSettingsStore = create<AppSettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateSetting: (key, value) =>
        set({ [key]: value } as Pick<AppSettingsData, typeof key>),

      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: 'dualand_settings',
      storage: secureStoreAdapter,
      // Only persist the data fields — strip action functions from storage
      partialize: ({ updateSetting, resetSettings, ...data }) => data,
    }
  )
);

export { DEFAULT_SETTINGS };
