// src/navigation/NavigationTypes.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Dashboard: undefined;
  CategoryDetail: { categoryId: string; categoryName?: string };
  DuaAudio: { duaId: string; categoryId?: string };
};

// For useNavigation hook type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}