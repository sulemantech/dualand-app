export type RootStackParamList = {
  Dashboard: undefined;
  CategoryDetail: { categoryId: string; categoryName?: string };
  DuaAudio: { duaId: string; categoryId?: string };
};

// Extend the global namespace for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}