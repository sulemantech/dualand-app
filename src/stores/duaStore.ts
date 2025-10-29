import { create } from 'zustand';
import { databaseService, Category, Dua } from '../lib/database/database';

interface DuaStore {
  categories: Category[];
  currentCategoryDuas: Dua[];
  isLoading: boolean;
  
  // Actions
  initializeData: () => Promise<void>;
  setCurrentCategory: (categoryId: string) => Promise<void>;
  toggleFavorite: (duaId: string) => Promise<void>;
  updateMemorizationStatus: (duaId: string, status: Dua['memorization_status']) => Promise<void>;
  
  // Getters
  getDua: (id: string) => Dua | undefined;
  getNextDuaId: (currentId: string) => string | null;
  getPreviousDuaId: (currentId: string) => string | null;
}

export const useDuaStore = create<DuaStore>((set, get) => ({
  categories: [],
  currentCategoryDuas: [],
  isLoading: false,

  initializeData: async () => {
    set({ isLoading: true });
    try {
      await databaseService.init();
      const categories = await databaseService.getAllCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      console.error('Error initializing data:', error);
      set({ isLoading: false });
    }
  },

  setCurrentCategory: async (categoryId: string) => {
    const duas = await databaseService.getDuasByCategory(categoryId);
    set({ currentCategoryDuas: duas });
  },

  toggleFavorite: async (duaId: string) => {
    const { currentCategoryDuas } = get();
    const dua = currentCategoryDuas.find(d => d.id === duaId);
    if (dua) {
      const newFavoriteStatus = !dua.is_favorited;
      await databaseService.updateDuaFavorite(duaId, newFavoriteStatus);
      
      const updatedDuas = currentCategoryDuas.map(d =>
        d.id === duaId ? { ...d, is_favorited: newFavoriteStatus } : d
      );
      set({ currentCategoryDuas: updatedDuas });
    }
  },

  updateMemorizationStatus: async (duaId: string, status: Dua['memorization_status']) => {
    const { currentCategoryDuas } = get();
    await databaseService.updateDuaMemorizationStatus(duaId, status);
    
    const updatedDuas = currentCategoryDuas.map(d =>
      d.id === duaId ? { ...d, memorization_status: status } : d
    );
    set({ currentCategoryDuas: updatedDuas });
  },

  getDua: (id: string) => {
    const { currentCategoryDuas } = get();
    return currentCategoryDuas.find(dua => dua.id === id);
  },

  getNextDuaId: (currentId: string) => {
    const { currentCategoryDuas } = get();
    const currentIndex = currentCategoryDuas.findIndex(dua => dua.id === currentId);
    return currentIndex < currentCategoryDuas.length - 1 
      ? currentCategoryDuas[currentIndex + 1].id 
      : null;
  },

  getPreviousDuaId: (currentId: string) => {
    const { currentCategoryDuas } = get();
    const currentIndex = currentCategoryDuas.findIndex(dua => dua.id === currentId);
    return currentIndex > 0 
      ? currentCategoryDuas[currentIndex - 1].id 
      : null;
  },
}));