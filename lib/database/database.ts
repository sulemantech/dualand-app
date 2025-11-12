// database.ts - DEBUG-OPTIMIZED VERSION
import * as SQLite from 'expo-sqlite';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  order_index: number;
}

export interface Dua {
  id: string;
  category_id: string;
  title: string;
  arabic_text: string;
  translation: string;
  transliteration?: string;
  reference: string;
  is_favorited: boolean;
  memorization_status: 'not_started' | 'learning' | 'memorized';
  image_path?: string;
  audio_full?: string;
  audio_word_by_word?: string;
  order_index: number;
  urdu?: string;
  hinditranslation?: string;
  textheading?: string;
  backgroundResId?: string;
  statusBarColorResId?: string;
  duaNumber?: string;
  titleAudioResId?: string;
  steps?: string;
}

export interface WordAudioPair {
  id: string;
  dua_id: string;
  word_text: string;
  audio_res_id: string;
  sequence_order: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;

  // Debug configuration
  private readonly DEBUG_MODE = __DEV__;
  private readonly ALWAYS_FRESH_DB = true; // Set to false when not debugging

  async init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeDatabase();
    return this.initPromise;
  }

  private async initializeDatabase(): Promise<void> {
    try {
      if (this.isInitialized) {
        console.log('Database already initialized');
        return;
      }

      // Use timestamp-based database name in debug mode for fresh DB every time
      const dbName = this.DEBUG_MODE && this.ALWAYS_FRESH_DB 
        ? `dualand-debug-${Date.now()}.db`
        : 'dualand-2.db';

      console.log(`📀 Opening database: ${dbName}`);
      this.db = SQLite.openDatabase(dbName);
      console.log('✅ Database opened successfully');

      // In debug mode with fresh DB, always reset and seed
      if (this.DEBUG_MODE && this.ALWAYS_FRESH_DB) {
        console.log('🐛 DEBUG: Creating fresh database...');
        await this.resetDatabaseForDebugging();
        await this.createTables();
        await this.seedInitialData();
      } else {
        // Production behavior
        await this.createTables();
        const shouldSeed = await this.shouldSeedData();
        if (shouldSeed) {
          await this.seedInitialData();
        }
      }

      this.isInitialized = true;
      console.log('✅ Database initialized successfully');

      // Log database info in debug mode
      if (this.DEBUG_MODE) {
        const status = await this.getDatabaseStatus();
        console.log('📊 Database Status:', status);
        
        const rowCounts = await this.debugGetTableRowCounts();
        console.log('📈 Table Row Counts:', rowCounts);
      }
    } catch (error) {
      console.error('❌ Database initialization error:', error);
      throw error;
    }
  }

  private async resetDatabaseForDebugging(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.transaction(
        (tx) => {
          // Drop all tables in correct order (respecting foreign keys)
          tx.executeSql('DROP TABLE IF EXISTS word_audio_pairs');
          tx.executeSql('DROP TABLE IF EXISTS duas');
          tx.executeSql('DROP TABLE IF EXISTS categories');
          console.log('🗑️ DEBUG: All tables dropped for fresh start');
        },
        (error) => {
          console.error('❌ Error resetting database:', error);
          reject(error);
        },
        () => {
          console.log('✅ Database reset successfully for debugging');
          resolve();
        }
      );
    });
  }

  private async shouldSeedData(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT COUNT(*) as count FROM categories',
            [],
            (_, { rows }) => {
              const count = rows.item(0).count;
              resolve(count === 0);
            },
            (_, error) => {
              if (error.message.includes('no such table')) {
                resolve(true);
              } else {
                reject(error);
              }
              return false;
            }
          );
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  private async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      this.db.transaction(
        (tx) => {
          // Create categories table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS categories (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              icon TEXT NOT NULL,
              color TEXT NOT NULL,
              order_index INTEGER NOT NULL
            );
          `);

          // Create duas table with all fields
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS duas (
              id TEXT PRIMARY KEY,
              category_id TEXT NOT NULL,
              title TEXT NOT NULL,
              arabic_text TEXT NOT NULL,
              translation TEXT NOT NULL,
              transliteration TEXT,
              reference TEXT NOT NULL,
              is_favorited BOOLEAN DEFAULT 0,
              memorization_status TEXT DEFAULT 'not_started',
              image_path TEXT,
              audio_full TEXT,
              audio_word_by_word TEXT,
              order_index INTEGER NOT NULL,
              urdu TEXT,
              hinditranslation TEXT,
              textheading TEXT,
              backgroundResId TEXT,
              statusBarColorResId TEXT,
              duaNumber TEXT,
              titleAudioResId TEXT,
              steps TEXT,
              FOREIGN KEY (category_id) REFERENCES categories (id)
            );
          `);

          // Create word_audio_pairs table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS word_audio_pairs (
              id TEXT PRIMARY KEY,
              dua_id TEXT NOT NULL,
              word_text TEXT NOT NULL,
              audio_res_id TEXT NOT NULL,
              sequence_order INTEGER NOT NULL,
              FOREIGN KEY (dua_id) REFERENCES duas (id) ON DELETE CASCADE
            );
          `);
        },
        (error) => {
          console.error('❌ Error creating tables:', error);
          reject(error);
        },
        () => {
          console.log('✅ Tables created/verified successfully');
          resolve();
        }
      );
    });
  }

  private async seedInitialData(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      try {
        console.log('🌱 Seeding initial data...');

        this.db.transaction(
          (tx) => {
            // Insert categories
            const initialCategories = [
              { id: '1', name: 'Praise and Glory', icon: 'star', color: '#2D7D46', order_index: 1 },
              { id: '2', name: 'Peace and Blessings', icon: 'peace', color: '#3182CE', order_index: 2 },
              { id: '3', name: 'Morning Duas', icon: 'sunny', color: '#a0825cff', order_index: 3 },
              { id: '4', name: 'Evening Duas', icon: 'moon', color: '#805AD5', order_index: 4 },
              { id: '5', name: 'Protection', icon: 'shield', color: '#E53E3E', order_index: 5 },
              { id: '6', name: 'Toilet Etiquette', icon: 'restroom', color: '#DD6B20', order_index: 6 },
              { id: '7', name: 'Dressing', icon: 'tshirt', color: '#38A169', order_index: 7 },
              { id: '8', name: 'Travel', icon: 'airplane', color: '#4C51BF', order_index: 8 },
              { id: '9', name: 'Home', icon: 'home', color: '#6a234dff', order_index: 9 },
              { id: '10', name: 'Good Character', icon: 'heart', color: '#E53E3E', order_index: 10 },
              { id: '11', name: 'Greetings', icon: 'handshake', color: '#2B6CB0', order_index: 11 },
              { id: '12', name: 'Gatherings', icon: 'users', color: '#744210', order_index: 12 },
              { id: '13', name: 'Market', icon: 'shopping-cart', color: '#234E52', order_index: 13 },
              { id: '14', name: 'Masjid', icon: 'mosque', color: '#1A365D', order_index: 14 },
              { id: '15', name: 'Eating & Drinking', icon: 'utensils', color: '#521B41', order_index: 15 },
              { id: '16', name: 'Visiting Sick', icon: 'stethoscope', color: '#742A2A', order_index: 16 },
              { id: '17', name: 'Calamity', icon: 'sad-tear', color: '#2D3748', order_index: 17 },
              { id: '18', name: 'Anger', icon: 'angry', color: '#C53030', order_index: 18 },
              { id: '19', name: 'Sneezing', icon: 'wind', color: '#2F855A', order_index: 19 },
              { id: '20', name: 'Nature', icon: 'cloud-sun', color: '#2C5AA0', order_index: 20 },
              { id: '21', name: 'Love of Allah', icon: 'praying-hands', color: '#9C4221', order_index: 21 },
              { id: '22', name: 'Seeking Refuge', icon: 'shield-alt', color: '#553C9A', order_index: 22 },
            ];

            initialCategories.forEach((category) => {
              tx.executeSql(
                'INSERT OR IGNORE INTO categories (id, name, icon, color, order_index) VALUES (?, ?, ?, ?, ?)',
                [category.id, category.name, category.icon, category.color, category.order_index]
              );
            });

            // Insert duas with all fields
            const initialDuas = [
              {
                id: '1', category_id: '1', title: 'Glory and Praise',
                arabic_text: 'سُبْحَانَ اللّٰہِ وَبِحَمْدِہِ سُبْحَانَ اللّٰہِ الْعَظِیْمِ',
                translation: 'Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.',
                reference: '[Ṣaḥīḥ Muslim]',
                textheading: 'Praise and Glory',
                duaNumber: '1.',
                order_index: 1,
                is_favorited: false,
                memorization_status: 'not_started',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                titleAudioResId: 'title_praise_and_glory',
                audio_full: 'dua01_part01_audio01_complete'
              },
              {
                id: '2', category_id: '1', title: 'Allah is the Greatest',
                arabic_text: 'اَللّٰہُ اَکْبَرُکَبِیْرًاوَّالْحَمْدُ لِلّٰہِ کَثِیْرًاوَّسُبْحَانَ اللّٰہِ بُکْرَةً وَّاَصِیْلًا',
                translation: 'Allah is truly Great, praise be to Allah in abundance and glory be to Allah in the morning and the evening.',
                reference: '[Sahih Muslim]',
                duaNumber: '1.',
                order_index: 2,
                is_favorited: true,
                memorization_status: 'learning',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                audio_full: 'dua01_part02_audio01_complete'
              },
              {
                id: '3', category_id: '2', title: 'Peace upon Muhammad',
                arabic_text: 'اَللّٰھُمَّ صَلِّ عَلٰی مُحَمَّدٍ وَّعَلٰی آلِ مُحَمَّدٍ',
                translation: 'O Allah! bestow Your mercy upon Mohammad ﷺ and upon the family of Mohammad ﷺ.',
                reference: '[Sunan al-Nasā\'ī]',
                textheading: 'Peace and Blessing upon the Prophet Muhammad ﷺ',
                duaNumber: '2.',
                order_index: 1,
                is_favorited: false,
                memorization_status: 'memorized',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                titleAudioResId: 'title_peace',
                audio_full: 'dua02_part01_audio01_complete'
              },
              {
                id: '4', category_id: '2', title: 'Mercy upon Muhammad',
                arabic_text: 'اَللّٰھُمَّ صَلِّ عَلٰی مُحَمَّدٍ عَبْدِکَ وَ رَسُوْلِکَ کَمَا صَلَّیْتَ عَلٰی اِبْرَاھِیْمَ وَ بَارِکْ عَلٰی مُحَمَّدٍ وَّعَلٰی آلِ مُحَمَّدٍ کَمَا بَارَکْتَ عَلٰی اِبْرَاھِیْمَ وَآلِ اِبْرَاھِیْمَ۔',
                translation: 'O Allah! Bestow mercy upon your servant and messenger, Mohammad ﷺ, as You bestowed Your mercy upon Ibrahim AS and bless Mohammad ﷺ and the family of Mohammad ﷺ, as You blessed Ibrahim (AS) and the family Ibrahim (AS).',
                reference: '[Ṣaḥīḥ al-Bukhārī]',
                duaNumber: '2.',
                order_index: 2,
                is_favorited: false,
                memorization_status: 'not_started',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                audio_full: 'dua02_part02_audio01_complete'
              },
              {
                id: '5', category_id: '3', title: 'Morning Du\'a',
                arabic_text: 'اَللّٰھُمَّ بِکَ اَصْبَحْنَا وَ بِکَ اَمْسَیْنَا وَ بِکَ نَحْیَا وَ بِکَ نَمُوْتُ  وَ اِلَيْكَ الْمَصِیْرُ',
                translation: 'O Allah! By Your leave we reach the morning and by Your leave we reach the evening and by Your leave we live and by Your leave we die and to You is our return.',
                reference: '[Sunan al-Tirmidhī]',
                textheading: 'Du\'a of Morning (Before Sunrise)',
                duaNumber: '3.',
                order_index: 1,
                is_favorited: true,
                memorization_status: 'memorized',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                titleAudioResId: 'title_morning',
                audio_full: 'dua03_part01_audio01_complete'
              },
              {
                id: '6', category_id: '3', title: 'Evening Du\'a',
                arabic_text: 'اَللّٰھُمَّ بِکَ اَمْسَیْنَا وَبِکَ اَصْبَحْنَا وَبِکَ نَحْیَا وَبِکَ نَمُوْتُ وَاِلَیْکَ النُّشُوْرُ۔ِ',
                translation: 'O Allah! By Your leave we reach the evening and by Your leave we reach the morning and by Your leave we live and by Your leave we will die and to You is our resurrection.',
                reference: '[Sunan al-Tirmidhī]',
                textheading: 'Du\'a of Evening (Before Sunset)',
                duaNumber: '4.',
                order_index: 2,
                is_favorited: false,
                memorization_status: 'learning',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                titleAudioResId: 'title_evening',
                audio_full: 'dua04_part01_audio01_complete'
              },
              {
                id: '7', category_id: '4', title: 'Seeking Refuge',
                arabic_text: 'اَعُوْذُ بِکَلِمَاتِ اللّٰہِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ۔',
                translation: 'I seek refuge in the totality of the words of Allah from the evil of what He has created.',
                reference: '[Ṣaḥīḥ Muslim]',
                textheading: 'Du\'a for Protection',
                duaNumber: '5.',
                order_index: 1,
                is_favorited: false,
                memorization_status: 'not_started',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                titleAudioResId: 'title_protection',
                audio_full: 'dua05_part01_audio01_complete'
              },
              {
                id: '8', category_id: '4', title: 'Protection in Allah\'s Name',
                arabic_text: 'بِسْمِ اللّٰہِ الَّذِیْ لَايَضُرُّ مَعَ اسْمِهِ شَىْءٌ فِى الْاَرْضِ وَلَا فِى السَّمَآءِ وَهُوَ السَّمِيعُ الْعَلِیْمُ',
                translation: 'In the name of Allah, by Whose name nothing on the earth or in the heavens can cause harm, and He is the All Knowing, the All-Hearing. (3 times)',
                reference: '[Sunan Abu Dawud]',
                duaNumber: '5.',
                order_index: 2,
                is_favorited: true,
                memorization_status: 'memorized',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                audio_full: 'dua05_part02_audio01_complete'
              },
              {
                id: '9', category_id: '5', title: 'Before Sleeping',
                arabic_text: 'اَللّٰھُمَّ بِاسْمِكَ اَمُوْتُ وَاَحْیَا',
                translation: 'O Allah! In your name I die and I live.',
                reference: '[Ṣaḥīḥ al-Bukhārī]',
                textheading: 'Du\'a before Sleeping',
                duaNumber: '6.',
                order_index: 1,
                is_favorited: false,
                memorization_status: 'learning',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                titleAudioResId: 'title_sleeping',
                audio_full: 'dua06_part01_audio01_complete',
                steps: '1. Dust the bed before sleeping\n2. Sleep on the right side\n3. Put your hand under your right cheek and say'
              },
              {
                id: '10', category_id: '5', title: 'After Waking Up',
                arabic_text: 'اَلْـحَمْدُ لِلّٰهِ الَّذِیْ اَحْيَانَا بَعْدَ مَا اَمَاتَنَا وَاِلَيْهِ النُّشُوْرُ',
                translation: 'All praise is for Allah ho gave us life after death (sleep) and to Him is the resurrection.',
                reference: '[Ṣaḥīḥ al-Bukhārī]',
                textheading: 'Du\'a after Waking Up',
                duaNumber: '7.',
                order_index: 2,
                is_favorited: true,
                memorization_status: 'memorized',
                image_path: 'https://images.unsplash.com/photo-1544914379-806667cdb683?w=400&h=300&fit=crop',
                backgroundResId: 'header_bg',
                statusBarColorResId: 'top_nav_new',
                titleAudioResId: 'title_waking_up',
                audio_full: 'dua07_part01_audio01_complete',
                steps: 'Rub your face and your eyes with your hands to remove any remaining effects of sleep and say:'
              },
            ];

            initialDuas.forEach((dua) => {
              tx.executeSql(
                `INSERT OR IGNORE INTO duas 
                (id, category_id, title, arabic_text, translation, reference, order_index, 
                 is_favorited, memorization_status, textheading, duaNumber, image_path,
                 backgroundResId, statusBarColorResId, titleAudioResId, audio_full, steps) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  dua.id, dua.category_id, dua.title, dua.arabic_text, dua.translation,
                  dua.reference, dua.order_index, dua.is_favorited ? 1 : 0,
                  dua.memorization_status, dua.textheading, dua.duaNumber, dua.image_path,
                  dua.backgroundResId, dua.statusBarColorResId, dua.titleAudioResId, dua.audio_full, dua.steps
                ]
              );
            });

            // Insert word audio pairs with proper audio file names
            const initialWordAudioPairs = [
              // Dua 1
              { id: '1', dua_id: '1', word_text: 'سُبْحَانَ اللّٰہِ', audio_res_id: 'dua01_part01_audio01', sequence_order: 0 },
              { id: '2', dua_id: '1', word_text: 'وَبِحَمْدِہِ', audio_res_id: 'dua01_part01_audio02', sequence_order: 1 },
              { id: '3', dua_id: '1', word_text: 'سُبْحَانَ اللّٰہِ الْعَظِیْمِ', audio_res_id: 'dua01_part01_audio03', sequence_order: 2 },

              // Dua 2
              { id: '4', dua_id: '2', word_text: 'اَللّٰہُ اَکْبَرُکَبِیْرًا', audio_res_id: 'dua01_part02_audio01', sequence_order: 0 },
              { id: '5', dua_id: '2', word_text: 'وَّالْحَمْدُ لِلّٰہِ کَثِیْرًا', audio_res_id: 'dua01_part02_audio02', sequence_order: 1 },
              { id: '6', dua_id: '2', word_text: 'وَّسُبْحَانَ اللّٰہِ', audio_res_id: 'dua01_part02_audio03', sequence_order: 2 },
              { id: '7', dua_id: '2', word_text: 'بُکْرَةً وَّاَصِیْلًا۔', audio_res_id: 'dua01_part02_audio04', sequence_order: 3 },

              // Dua 3
              { id: '8', dua_id: '3', word_text: 'اَللّٰھُمَّ صَلِّ عَلٰی', audio_res_id: 'dua02_part01_audio01', sequence_order: 0 },
              { id: '9', dua_id: '3', word_text: 'مُحَمَّدٍ وَّعَلٰی', audio_res_id: 'dua02_part01_audio02', sequence_order: 1 },
              { id: '10', dua_id: '3', word_text: 'آلِ مُحَمَّدٍ', audio_res_id: 'dua02_part01_audio03', sequence_order: 2 },

              // Dua 4
              { id: '11', dua_id: '4', word_text: 'اَللّٰھُمَّ صَلِّ عَلٰی', audio_res_id: 'dua02_part02_audio01', sequence_order: 0 },
              { id: '12', dua_id: '4', word_text: 'مُحَمَّدٍ عَبْدِکَ', audio_res_id: 'dua02_part02_audio02', sequence_order: 1 },
              { id: '13', dua_id: '4', word_text: 'وَ رَسُوْلِکَ', audio_res_id: 'dua02_part02_audio03', sequence_order: 2 },
              { id: '14', dua_id: '4', word_text: 'کَمَا صَلَّیْتَ', audio_res_id: 'dua02_part02_audio04', sequence_order: 3 },
              { id: '15', dua_id: '4', word_text: 'عَلٰی اِبْرَاھِیْمَ', audio_res_id: 'dua02_part02_audio05', sequence_order: 4 },
              { id: '16', dua_id: '4', word_text: 'وَ بَارِکْ عَلٰی', audio_res_id: 'dua02_part02_audio06', sequence_order: 5 },
              { id: '17', dua_id: '4', word_text: 'مُحَمَّدٍ وَّعَلٰی', audio_res_id: 'dua02_part02_audio07', sequence_order: 6 },
              { id: '18', dua_id: '4', word_text: 'آلِ مُحَمَّدٍ', audio_res_id: 'dua02_part02_audio08', sequence_order: 7 },
              { id: '19', dua_id: '4', word_text: 'کَمَا بَارَکْتَ', audio_res_id: 'dua02_part02_audio09', sequence_order: 8 },
              { id: '20', dua_id: '4', word_text: 'عَلٰی اِبْرَاھِیْمَ', audio_res_id: 'dua02_part02_audio10', sequence_order: 9 },
              { id: '21', dua_id: '4', word_text: 'وَآلِ اِبْرَاھِیْمَ۔', audio_res_id: 'dua02_part02_audio11', sequence_order: 10 },

              // Dua 5
              { id: '22', dua_id: '5', word_text: 'اَللّٰھُمَّ بِکَ اَصْبَحْنَا', audio_res_id: 'dua03_part01_audio01', sequence_order: 0 },
              { id: '23', dua_id: '5', word_text: 'وَ بِکَ اَمْسَیْنَا', audio_res_id: 'dua03_part01_audio02', sequence_order: 1 },
              { id: '24', dua_id: '5', word_text: 'وَ بِکَ نَحْیَا', audio_res_id: 'dua03_part01_audio03', sequence_order: 2 },
              { id: '25', dua_id: '5', word_text: 'وَ بِکَ نَمُوْتُ', audio_res_id: 'dua03_part01_audio04', sequence_order: 3 },
              { id: '26', dua_id: '5', word_text: 'وَ اِلَيْكَ الْمَصِیْرُ', audio_res_id: 'dua03_part01_audio05', sequence_order: 4 },
            ];

            initialWordAudioPairs.forEach((pair) => {
              tx.executeSql(
                'INSERT OR IGNORE INTO word_audio_pairs (id, dua_id, word_text, audio_res_id, sequence_order) VALUES (?, ?, ?, ?, ?)',
                [pair.id, pair.dua_id, pair.word_text, pair.audio_res_id, pair.sequence_order]
              );
            });
          },
          (error) => {
            console.error('❌ Error seeding initial data:', error);
            reject(error);
          },
          () => {
            console.log('✅ Initial data seeded successfully');
            resolve();
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // ================= DEBUG METHODS =================

  async debugGetTableRowCounts(): Promise<{ [key: string]: number }> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve({});
        return;
      }

      const tables = ['categories', 'duas', 'word_audio_pairs'];
      const counts: { [key: string]: number } = {};
      let completedQueries = 0;

      this.db.transaction(
        (tx) => {
          tables.forEach((table) => {
            tx.executeSql(
              `SELECT COUNT(*) as count FROM ${table}`,
              [],
              (_, { rows }) => {
                counts[table] = rows.item(0).count;
                completedQueries++;
                
                if (completedQueries === tables.length) {
                  resolve(counts);
                }
              },
              (_, error) => {
                console.error(`❌ Error counting ${table}:`, error);
                counts[table] = -1;
                completedQueries++;
                
                if (completedQueries === tables.length) {
                  resolve(counts);
                }
                return false;
              }
            );
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async debugExportData(): Promise<any> {
    const [categories, duas, status] = await Promise.all([
      this.getAllCategories(),
      this.getAllDuas(),
      this.getDatabaseStatus()
    ]);

    return {
      categories,
      duas: duas.map(dua => ({
        id: dua.id,
        title: dua.title,
        category_id: dua.category_id,
        is_favorited: dua.is_favorited,
        memorization_status: dua.memorization_status
      })),
      exportTimestamp: new Date().toISOString(),
      debugInfo: status,
      tableCounts: await this.debugGetTableRowCounts()
    };
  }

  async debugResetDatabase(): Promise<void> {
    console.log('🔄 DEBUG: Manual database reset triggered');
    this.isInitialized = false;
    this.initPromise = null;
    await this.close();
    await this.init();
  }

  async debugPrintDatabaseInfo(): Promise<void> {
    const status = await this.getDatabaseStatus();
    const rowCounts = await this.debugGetTableRowCounts();
    
    console.log('=== DATABASE DEBUG INFO ===');
    console.log('Initialized:', status.isInitialized);
    console.log('Tables:', status.tables);
    console.log('Row Counts:', rowCounts);
    console.log('===========================');
  }

  // ================= PUBLIC METHODS =================

  // Database status check method
  async getDatabaseStatus(): Promise<{ isInitialized: boolean; tables: string[] }> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve({ isInitialized: this.isInitialized, tables: [] });
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table'",
            [],
            (_, { rows }) => {
              const tables = rows._array.map((row: any) => row.name);
              resolve({
                isInitialized: this.isInitialized,
                tables
              });
            },
            (_, error) => {
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  // Ensure database is initialized before operations
  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.init();
    }
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM categories ORDER BY order_index',
            [],
            (_, { rows }) => {
              const categories = rows._array as Category[];
              resolve(categories);
            },
            (_, error) => {
              console.error('❌ Error getting categories:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting categories:', error);
          resolve([]);
        }
      );
    });
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM categories WHERE id = ?',
            [id],
            (_, { rows }) => {
              const category = rows._array[0] as Category;
              resolve(category || null);
            },
            (_, error) => {
              console.error('❌ Error getting category by id:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting category by id:', error);
          resolve(null);
        }
      );
    });
  }

  // Dua methods
  async getAllDuas(): Promise<Dua[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM duas ORDER BY order_index',
            [],
            (_, { rows }) => {
              const duas = this.convertDuasToBoolean(rows._array as Dua[]);
              resolve(duas);
            },
            (_, error) => {
              console.error('❌ Error getting duas:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting duas:', error);
          resolve([]);
        }
      );
    });
  }

  async getDuasByCategory(categoryId: string): Promise<Dua[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM duas WHERE category_id = ? ORDER BY order_index',
            [categoryId],
            (_, { rows }) => {
              const duas = this.convertDuasToBoolean(rows._array as Dua[]);
              resolve(duas);
            },
            (_, error) => {
              console.error('❌ Error getting duas by category:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting duas by category:', error);
          resolve([]);
        }
      );
    });
  }

  async getDuaById(id: string): Promise<Dua | null> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve(null);
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM duas WHERE id = ?',
            [id],
            (_, { rows }) => {
              const dua = rows._array[0] as Dua;
              resolve(dua ? { ...dua, is_favorited: !!dua.is_favorited } : null);
            },
            (_, error) => {
              console.error('❌ Error getting dua by id:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting dua by id:', error);
          resolve(null);
        }
      );
    });
  }

  async getFavoriteDuas(): Promise<Dua[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM duas WHERE is_favorited = 1 ORDER BY order_index',
            [],
            (_, { rows }) => {
              const duas = this.convertDuasToBoolean(rows._array as Dua[]);
              resolve(duas);
            },
            (_, error) => {
              console.error('❌ Error getting favorite duas:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting favorite duas:', error);
          resolve([]);
        }
      );
    });
  }

  async searchDuas(query: string): Promise<Dua[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      const searchTerm = `%${query}%`;
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM duas 
             WHERE title LIKE ? OR arabic_text LIKE ? OR translation LIKE ? 
             OR urdu LIKE ? OR hinditranslation LIKE ? OR textheading LIKE ?
             ORDER BY order_index`,
            [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm],
            (_, { rows }) => {
              const duas = this.convertDuasToBoolean(rows._array as Dua[]);
              resolve(duas);
            },
            (_, error) => {
              console.error('❌ Error searching duas:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error searching duas:', error);
          resolve([]);
        }
      );
    });
  }

  // Word Audio Pairs methods
  async getWordAudioPairsByDua(duaId: string): Promise<WordAudioPair[]> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve([]);
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM word_audio_pairs WHERE dua_id = ? ORDER BY sequence_order',
            [duaId],
            (_, { rows }) => {
              const pairs = rows._array as WordAudioPair[];
              resolve(pairs);
            },
            (_, error) => {
              console.error('❌ Error getting word audio pairs:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting word audio pairs:', error);
          resolve([]);
        }
      );
    });
  }

  // Update methods
  async updateDuaFavorite(id: string, isFavorited: boolean): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE duas SET is_favorited = ? WHERE id = ?',
            [isFavorited ? 1 : 0, id],
            () => resolve(),
            (_, error) => {
              console.error('❌ Error updating favorite:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error updating favorite:', error);
          resolve();
        }
      );
    });
  }

  async updateDuaMemorizationStatus(id: string, status: Dua['memorization_status']): Promise<void> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE duas SET memorization_status = ? WHERE id = ?',
            [status, id],
            () => resolve(),
            (_, error) => {
              console.error('❌ Error updating memorization status:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error updating memorization status:', error);
          resolve();
        }
      );
    });
  }

  // Statistics methods
  async getDuasCount(): Promise<{ total: number; memorized: number; learning: number; notStarted: number }> {
    await this.ensureInitialized();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve({ total: 0, memorized: 0, learning: 0, notStarted: 0 });
        return;
      }

      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT memorization_status, COUNT(*) as count FROM duas GROUP BY memorization_status',
            [],
            (_, { rows }) => {
              const counts = {
                total: 0,
                memorized: 0,
                learning: 0,
                notStarted: 0
              };

              rows._array.forEach((row: any) => {
                counts.total += row.count;
                if (row.memorization_status === 'memorized') {
                  counts.memorized = row.count;
                } else if (row.memorization_status === 'learning') {
                  counts.learning = row.count;
                } else if (row.memorization_status === 'not_started') {
                  counts.notStarted = row.count;
                }
              });

              resolve(counts);
            },
            (_, error) => {
              console.error('❌ Error getting duas count:', error);
              reject(error);
              return false;
            }
          );
        },
        (error) => {
          console.error('❌ Transaction error getting duas count:', error);
          resolve({ total: 0, memorized: 0, learning: 0, notStarted: 0 });
        }
      );
    });
  }

  // Utility methods
  private convertDuasToBoolean(duas: Dua[]): Dua[] {
    return duas?.map(dua => ({
      ...dua,
      is_favorited: !!dua.is_favorited
    })) || [];
  }

  // Close database connection
  async close(): Promise<void> {
    if (this.db) {
      // Note: expo-sqlite doesn't have a close method in the legacy API
      // The connection is managed automatically
      this.db = null;
      this.isInitialized = false;
      this.initPromise = null;
      console.log('🔒 Database connection closed');
    }
  }
}

export const databaseService = new DatabaseService();