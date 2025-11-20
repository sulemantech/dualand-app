// database/audioRecordRepository.ts
import db from './db';

export interface AudioRecord {
  id?: number;
  filename: string;
  filepath: string;
  duration: number;
  file_size?: number;
  created_at?: string;
}

export const audioRecordRepository = {
  // Create a new audio record
  async create(record: Omit<AudioRecord, 'id' | 'created_at'>): Promise<number> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `INSERT INTO audio_records (filename, filepath, duration, file_size) 
             VALUES (?, ?, ?, ?)`,
            [record.filename, record.filepath, record.duration, record.file_size || null],
            (_, result) => {
              resolve(result.insertId);
            },
            (_, error) => {
              reject(error);
              return true;
            }
          );
        },
        (error) => reject(error)
      );
    });
  },

  // Get all audio records
  async getAll(): Promise<AudioRecord[]> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `SELECT * FROM audio_records ORDER BY created_at DESC`,
            [],
            (_, result) => {
              const records: AudioRecord[] = [];
              for (let i = 0; i < result.rows.length; i++) {
                records.push(result.rows.item(i));
              }
              resolve(records);
            },
            (_, error) => {
              reject(error);
              return true;
            }
          );
        },
        (error) => reject(error)
      );
    });
  },

  // Delete an audio record
  async delete(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      db.transaction(
        (tx) => {
          tx.executeSql(
            `DELETE FROM audio_records WHERE id = ?`,
            [id],
            (_, result) => {
              resolve(result.rowsAffected > 0);
            },
            (_, error) => {
              reject(error);
              return true;
            }
          );
        },
        (error) => reject(error)
      );
    });
  },
};