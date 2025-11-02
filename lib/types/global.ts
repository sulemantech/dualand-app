export interface AppConfig {
  databaseName: string;
  audioQuality: 'low' | 'medium' | 'high';
  autoPlay: boolean;
  hapticFeedback: boolean;
}

export interface AudioProgress {
  currentTime: number;
  duration: number;
  progress: number;
}

export interface LearningStats {
  totalDuas: number;
  memorized: number;
  inProgress: number;
  favorite: number;
}