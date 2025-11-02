import { AppConfig } from '../lib/types/global';

export const appConfig: AppConfig = {
  databaseName: 'dualand.db',
  audioQuality: 'medium',
  autoPlay: true,
  hapticFeedback: true,
};

export const audioConfig = {
  playbackRates: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0],
  defaultPlaybackRate: 1.0,
  wordByWordDelay: 1000, // ms between words
};