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
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('dualand.db');
      await this.createTables();
      await this.seedInitialData();
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  private async createTables(): Promise<void> {
    await this.db?.execAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT NOT NULL,
        order_index INTEGER NOT NULL
      );

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
        FOREIGN KEY (category_id) REFERENCES categories (id)
      );
    `);
  }

  private async seedInitialData(): Promise<void> {
    // Check if data already exists
    const categories = await this.db?.getAllAsync('SELECT * FROM categories LIMIT 1');
    if (categories && categories.length > 0) return;

    // Insert categories
    const initialCategories = [
      { id: '1', name: 'Praise and Glory', icon: 'star', color: '#2D7D46', order_index: 1 },
      { id: '2', name: 'Morning', icon: 'sunny', color: '#F6AD55', order_index: 2 },
      { id: '3', name: 'Evening', icon: 'moon', color: '#3182CE', order_index: 3 },
      { id: '4', name: 'Protection', icon: 'shield', color: '#E53E3E', order_index: 4 },
      { id: '5', name: 'Sleeping', icon: 'bed', color: '#805AD5', order_index: 5 },
      { id: '6', name: 'Waking Up', icon: 'alarm', color: '#38A169', order_index: 6 }
    ];

    for (const category of initialCategories) {
      await this.db?.runAsync(
        'INSERT OR IGNORE INTO categories (id, name, icon, color, order_index) VALUES (?, ?, ?, ?, ?)',
        [category.id, category.name, category.icon, category.color, category.order_index]
      );
    }

    // Insert sample duas
    const initialDuas = [
      {
        id: '1', category_id: '1', title: 'Glory and Praise #1', 
        arabic_text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ', 
        translation: 'Glory be to Allah and all praise be to Him', 
        reference: '[Sahih Muslim]', order_index: 1,
        is_favorited: false, memorization_status: 'not_started'
      },
      {
        id: '2', category_id: '1', title: 'Allah is the Greatest', 
        arabic_text: 'اللَّهُ أَكْبَرُ كَبِيرًا', 
        translation: 'Allah is truly Great', 
        reference: '[Sahih Muslim]', order_index: 2,
        is_favorited: true, memorization_status: 'learning'
      },
      {
        id: '3', category_id: '2', title: 'Morning Dua #1', 
        arabic_text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', 
        translation: 'We have reached the morning and the whole kingdom belongs to Allah', 
        reference: '[Sahih Muslim]', order_index: 1,
        is_favorited: false, memorization_status: 'memorized'
      },
      {
        id: '4', category_id: '2', title: 'Morning Dua #2', 
        arabic_text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا', 
        translation: 'O Allah, by You we enter the morning', 
        reference: '[Sahih Muslim]', order_index: 2,
        is_favorited: true, memorization_status: 'not_started'
      }
    ];

    for (const dua of initialDuas) {
      await this.db?.runAsync(
        `INSERT OR IGNORE INTO duas 
        (id, category_id, title, arabic_text, translation, reference, order_index, is_favorited, memorization_status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [dua.id, dua.category_id, dua.title, dua.arabic_text, dua.translation, 
         dua.reference, dua.order_index, dua.is_favorited ? 1 : 0, dua.memorization_status]
      );
    }
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.db?.getAllAsync('SELECT * FROM categories ORDER BY order_index') as Category[] || [];
  }

  async getDuasByCategory(categoryId: string): Promise<Dua[]> {
    const result = await this.db?.getAllAsync(
      'SELECT * FROM duas WHERE category_id = ? ORDER BY order_index',
      [categoryId]
    ) as Dua[];
    
    // Convert SQLite boolean (0/1) to JavaScript boolean
    return result?.map(dua => ({
      ...dua,
      is_favorited: !!dua.is_favorited
    })) || [];
  }

  async getDuaById(id: string): Promise<Dua | null> {
    const result = await this.db?.getAllAsync('SELECT * FROM duas WHERE id = ?', [id]) as Dua[];
    const dua = result?.[0];
    return dua ? { ...dua, is_favorited: !!dua.is_favorited } : null;
  }

  async updateDuaFavorite(id: string, isFavorited: boolean): Promise<void> {
    await this.db?.runAsync(
      'UPDATE duas SET is_favorited = ? WHERE id = ?',
      [isFavorited ? 1 : 0, id]
    );
  }

  async updateDuaMemorizationStatus(id: string, status: Dua['memorization_status']): Promise<void> {
    await this.db?.runAsync(
      'UPDATE duas SET memorization_status = ? WHERE id = ?',
      [status, id]
    );
  }
}

export const databaseService = new DatabaseService();