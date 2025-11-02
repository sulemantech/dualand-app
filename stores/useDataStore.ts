// // src/stores/useDataStore.ts
// import { create } from 'zustand';
// import { initDatabase } from '../../database/db';

// interface DataState {
//   isInitialized: boolean;
//   isLoading: boolean;
//   error: string | null;
//   init: () => Promise<void>;
//   reset: () => void;
//   checkDatabaseStatus: () => Promise<boolean>;
// }

// export const useDataStore = create<DataState>((set, get) => ({
//   isInitialized: false,
//   isLoading: false,
//   error: null,

//   init: async () => {
//     const { isInitialized, isLoading } = get();
    
//     // Prevent multiple initializations
//     if (isInitialized) {
//       console.log('Database already initialized');
//       return;
//     }

//     if (isLoading) {
//       console.log('Initialization already in progress');
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       console.log('Starting database initialization...');
      
//       // Initialize database
//       await initDatabase();
      
//       console.log('Database initialized successfully');
      
//       set({ 
//         isInitialized: true, 
//         isLoading: false,
//         error: null 
//       });
      
//     } catch (error) {
//       console.error('Error in data store initialization:', error);
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error during initialization';
      
//       set({ 
//         isLoading: false, 
//         error: errorMessage 
//       });
      
//       throw error;
//     }
//   },

//   reset: () => {
//     set({
//       isInitialized: false,
//       isLoading: false,
//       error: null,
//     });
//   },

//   checkDatabaseStatus: async (): Promise<boolean> => {
//     try {
//       // Simple query to check if database is working
//       return true;
//     } catch (error) {
//       console.error('Error checking database status:', error);
//       return false;
//     }
//   },
// }));