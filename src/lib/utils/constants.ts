export const APP_CONSTANTS = {
  DATABASE_NAME: 'dualand.db',
  AUDIO_BASE_PATH: '../assets/audio/',
};

export const MEMORIZATION_STATUS = {
  NOT_STARTED: 'not_started',
  LEARNING: 'learning',
  MEMORIZED: 'memorized',
} as const;

export const FILTER_TYPES = {
  ALL: 'all',
  FAVORITE: 'favorite',
  MEMORIZED: 'memorized',
  LEARNING: 'learning',
} as const;