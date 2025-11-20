import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Switch, 
  ScrollView, 
  StyleSheet, 
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { databaseService } from '../../lib/database/database';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const THEME = {
  primary: '#FF6B9D',      // Softer Pink
  secondary: '#FFF7D0',    // Bright Lemon Yellow
  tertiary: '#E8F4FF',     // Softer Sky Blue
  neutral: '#FFFFFF',      // White
  accent: '#FFD166',       // Sunny Yellow
  success: '#4ECDC4',      // Mint Green
  header: '#fcf8b1',       // Yellow Header Color
  
  // Kid-Friendly Text Colors - Softer and Warmer
  text: {
    primary: '#2D4A63',    // Soft Blue-Gray - Easy on eyes
    secondary: '#6B7B8C',  // Warm Gray - Gentle contrast
    light: '#FFFFFF',      // White
    dark: '#4A5C6B',       // Soft Charcoal - Not too dark
    accent: '#E53E3E',     // Red accent for important text
  }
};

// Enhanced Get database file path - FIXED VERSION
const getDatabasePath = async (): Promise<string | null> => {
  try {
    console.log('🔍 Searching for database file...');

    // Method 1: Try Expo SQLite's actual database location
    try {
      // In Expo, SQLite databases are stored in a specific location
      // Let's try to access the database through SQLite first
      const db = SQLite.openDatabase('dualand-2.db');
      
      // Test if database is accessible by making a simple query
      await new Promise((resolve, reject) => {
        db.transaction(
          tx => {
            tx.executeSql(
              'SELECT name FROM sqlite_master WHERE type="table"',
              [],
              (_, result) => {
                console.log('✅ Database is accessible via SQLite');
                console.log('📊 Found tables:', result.rows._array.map((row: any) => row.name));
                resolve(result);
              },
              (_, error) => {
                console.log('❌ Database not accessible via SQLite:', error);
                reject(error);
                return false;
              }
            );
          },
          error => {
            console.log('❌ Transaction failed:', error);
            reject(error);
          }
        );
      });

      // If we reach here, the database exists but we need to find its file path
      console.log('💡 Database exists in SQLite but file path is internal');
      
    } catch (sqliteError) {
      console.log('❌ SQLite access failed:', sqliteError);
    }

    // Method 2: Enhanced file system search
    try {
      const documentDirectory = FileSystem.documentDirectory;
      console.log('📁 Document directory:', documentDirectory);
      
      // List all files in document directory recursively
      const files = await FileSystem.readDirectoryAsync(documentDirectory);
      console.log('📄 Files in document directory:', files);

      // Look for SQLite directory specifically
      if (files.includes('SQLite')) {
        const sqliteDir = documentDirectory + 'SQLite';
        const sqliteFiles = await FileSystem.readDirectoryAsync(sqliteDir);
        console.log('💾 Files in SQLite directory:', sqliteFiles);
        
        const dbFiles = sqliteFiles.filter(file => file.endsWith('.db'));
        if (dbFiles.length > 0) {
          const dbPath = sqliteDir + '/' + dbFiles[0];
          console.log('✅ Found database in SQLite directory:', dbPath);
          
          const fileInfo = await FileSystem.getInfoAsync(dbPath);
          if (fileInfo.exists && fileInfo.size > 0) {
            console.log('📊 Database file size:', fileInfo.size, 'bytes');
            return dbPath;
          }
        }
      }

      // Look for any .db files in document directory
      const dbFiles = files.filter(file => file.endsWith('.db'));
      console.log('💾 Database files found:', dbFiles);
      
      if (dbFiles.length > 0) {
        for (const dbFile of dbFiles) {
          const dbPath = documentDirectory + dbFile;
          try {
            const fileInfo = await FileSystem.getInfoAsync(dbPath);
            if (fileInfo.exists && fileInfo.size > 0) {
              console.log('✅ Found valid database at:', dbPath);
              console.log('📊 Database file size:', fileInfo.size, 'bytes');
              return dbPath;
            }
          } catch (error) {
            console.log(`❌ Database file ${dbPath} is not accessible:`, error);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error searching file system:', error);
    }

    // Method 3: Try to get database info through the service
    try {
      const [duas, categories] = await Promise.all([
        databaseService.getAllDuas(),
        databaseService.getAllCategories()
      ]);
      
      console.log('📊 Database service is working. Data stats:', {
        duas: duas.length,
        categories: categories.length
      });
      
      if (duas.length > 0) {
        console.log('💡 Database exists but file path is not directly accessible');
        // Return a special indicator that database exists but path isn't accessible
        return 'DATABASE_EXISTS_BUT_PATH_NOT_ACCESSIBLE';
      }
    } catch (dbError) {
      console.log('❌ Database service also failed:', dbError);
    }

    console.log('❌ No database file found in any accessible location');
    return null;
  } catch (error) {
    console.error('❌ Error getting database path:', error);
    return null;
  }
};

// JSON Export Fallback Function
const exportAsJson = async (duas: any[], categories: any[]) => {
  try {
    const exportData = {
      exportedAt: new Date().toISOString(),
      app: 'DuaLand',
      version: '1.0.0',
      data: {
        duas,
        categories
      },
      statistics: {
        totalDuas: duas.length,
        totalCategories: categories.length,
        favorites: duas.filter(dua => dua.is_favorited).length,
        memorized: duas.filter(dua => dua.memorization_status === 'memorized').length
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `DuaLand_Data_${timestamp}.json`;
    const fileUri = FileSystem.documentDirectory + filename;

    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8
    });

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    Alert.alert(
      'JSON Export Complete! ✅',
      `Your DuaLand data has been exported as JSON.\n\n` +
      `📁 File: ${filename}\n` +
      `💾 Size: ${Math.round(fileInfo.size / 1024)} KB\n` +
      `📖 Total Duas: ${duas.length}\n` +
      `📂 Total Categories: ${categories.length}`,
      [{ text: 'OK' }]
    );
  } catch (error) {
    console.error('JSON export error:', error);
    throw error;
  }
};

// Enhanced Database Export Function - UPDATED
const exportDatabase = async () => {
  try {
    Alert.alert(
      'Export Database',
      'This will export your DuaLand data. If SQLite file is not accessible, it will export as JSON. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Export',
          onPress: async () => {
            try {
              console.log('🔄 Starting database export process...');
              
              // Get the database file path
              const sourceDbPath = await getDatabasePath();
              
              if (!sourceDbPath || sourceDbPath === 'DATABASE_EXISTS_BUT_PATH_NOT_ACCESSIBLE') {
                // Database exists but file path isn't accessible - use JSON export
                try {
                  const [duas, categories] = await Promise.all([
                    databaseService.getAllDuas(),
                    databaseService.getAllCategories()
                  ]);
                  
                  console.log('📊 Database is working but file not accessible. Data stats:', {
                    duas: duas.length,
                    categories: categories.length
                  });
                  
                  Alert.alert(
                    'Export as JSON',
                    `Your database contains ${duas.length} duas and ${categories.length} categories, but the SQLite file isn't directly accessible.\n\nWould you like to export your data as JSON instead?`,
                    [
                      {
                        text: 'Export as JSON',
                        onPress: () => exportAsJson(duas, categories)
                      },
                      { text: 'Cancel' }
                    ]
                  );
                } catch (dbError) {
                  Alert.alert(
                    'Database Not Found ❌',
                    'Could not access the database. Please make sure the app is working correctly.',
                    [{ text: 'OK' }]
                  );
                }
                return;
              }

              // If we have a valid file path, try to export the SQLite file
              console.log('📤 Attempting SQLite file export from:', sourceDbPath);

              // Create filename with timestamp
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              const filename = `DuaLand_Database_${timestamp}.db`;
              const exportPath = FileSystem.documentDirectory + filename;
              
              try {
                // Copy the database file
                await FileSystem.copyAsync({
                  from: sourceDbPath,
                  to: exportPath
                });

                // Verify the file was created
                const fileInfo = await FileSystem.getInfoAsync(exportPath);
                
                if (fileInfo.exists && fileInfo.size > 0) {
                  console.log('✅ SQLite database exported successfully!');
                  
                  // Get some stats about the database
                  const [duas, categories] = await Promise.all([
                    databaseService.getAllDuas(),
                    databaseService.getAllCategories()
                  ]);

                  Alert.alert(
                    'Export Complete! ✅',
                    `Your DuaLand SQLite database has been exported successfully!\n\n` +
                    `📁 File: ${filename}\n` +
                    `💾 Size: ${Math.round(fileInfo.size / 1024)} KB\n` +
                    `📖 Total Duas: ${duas.length}\n` +
                    `📂 Total Categories: ${categories.length}`,
                    [{ text: 'OK' }]
                  );
                } else {
                  throw new Error('Exported file is empty or does not exist');
                }

              } catch (fileError) {
                console.error('❌ SQLite file export failed, falling back to JSON:', fileError);
                
                // Fallback to JSON export
                const [duas, categories] = await Promise.all([
                  databaseService.getAllDuas(),
                  databaseService.getAllCategories()
                ]);
                
                await exportAsJson(duas, categories);
              }

            } catch (error) {
              console.error('❌ Error exporting database:', error);
              
              // Final fallback - try JSON export
              try {
                const [duas, categories] = await Promise.all([
                  databaseService.getAllDuas(),
                  databaseService.getAllCategories()
                ]);
                
                Alert.alert(
                  'SQLite Export Failed',
                  `Could not export SQLite database. Would you like to export as JSON instead?\n\nError: ${error.message}`,
                  [
                    {
                      text: 'Export as JSON',
                      onPress: () => exportAsJson(duas, categories)
                    },
                    { text: 'Cancel' }
                  ]
                );
              } catch (finalError) {
                Alert.alert(
                  'Export Failed ❌',
                  'Could not export data in any format. Please try again later.',
                  [{ text: 'OK' }]
                );
              }
            }
          },
        },
      ]
    );
  } catch (error) {
    console.error('Error in export process:', error);
    Alert.alert(
      'Error',
      'Failed to start export process. Please try again.',
      [{ text: 'OK' }]
    );
  }
};

// Enhanced Database Info Function - UPDATED
const viewDatabaseInfo = async () => {
  try {
    const [duas, categories, dbPath] = await Promise.all([
      databaseService.getAllDuas(),
      databaseService.getAllCategories(),
      getDatabasePath()
    ]);

    const favorites = duas.filter(dua => dua.is_favorited).length;
    const memorized = duas.filter(dua => dua.memorization_status === 'memorized').length;
    const learning = duas.filter(dua => dua.memorization_status === 'learning').length;

    let fileStatus = 'Not Found';
    let fileSize = 'Unknown';
    
    if (dbPath === 'DATABASE_EXISTS_BUT_PATH_NOT_ACCESSIBLE') {
      fileStatus = 'Working (Internal)';
      fileSize = 'Not Accessible';
    } else if (dbPath) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(dbPath);
        if (fileInfo.exists) {
          fileSize = `${Math.round(fileInfo.size / 1024)} KB`;
          fileStatus = 'Found';
        }
      } catch (error) {
        console.error('Error getting file size:', error);
      }
    }

    Alert.alert(
      'Database Information 📊',
      `Your DuaLand Database:\n\n` +
      `📁 Database Status: ${fileStatus}\n` +
      `💾 File Size: ${fileSize}\n` +
      `📖 Total Duas: ${duas.length}\n` +
      `📂 Total Categories: ${categories.length}\n` +
      `❤️ Favorites: ${favorites}\n` +
      `⭐ Memorized: ${memorized}\n` +
      `📚 Learning: ${learning}`,
      [
        {
          text: 'Export Database',
          onPress: exportDatabase
        },
        {
          text: 'Export as JSON',
          onPress: async () => {
            try {
              await exportAsJson(duas, categories);
            } catch (error) {
              Alert.alert('Export Failed', 'Could not export as JSON.');
            }
          }
        },
        { text: 'OK' }
      ]
    );
  } catch (error) {
    console.error('Error getting database info:', error);
    Alert.alert(
      'Error',
      'Could not retrieve database information.',
      [{ text: 'OK' }]
    );
  }
};

// Database Import Function
const importDatabase = async () => {
  Alert.alert(
    'Import Database',
    'This feature is coming soon! You can currently export your SQLite database file for backup.',
    [
      {
        text: 'Learn More',
        onPress: () => {
          Alert.alert(
            'Import Feature Coming Soon',
            'In future updates, you will be able to:\n\n• Import your SQLite database backup\n• Restore all your data and progress\n• Merge data from multiple devices\n• Import from previous versions',
            [{ text: 'OK' }]
          );
        }
      },
      { text: 'OK' }
    ]
  );
};

// Simplified Animated Setting Item Component
const AnimatedSettingItem = ({ 
  title, 
  description, 
  value, 
  onValueChange,
  emoji,
  delay = 0
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(fadeAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          })
        ])
      ]);

      animation.start();

      return () => {
        animation.stop();
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
      };
    }, [fadeAnim, slideAnim, delay])
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingEmoji}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            <Text style={styles.settingDescription}>{description}</Text>
          </View>
        </View>
        
        <View style={styles.switchContainer}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#d1d5db', true: '#8B5CF6' }}
            thumbColor={value ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Simplified Info Item Component
const AnimatedInfoItem = ({ label, value, emoji, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(fadeAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 60,
            friction: 5,
            useNativeDriver: true,
          })
        ])
      ]);

      animation.start();

      return () => {
        animation.stop();
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.9);
      };
    }, [fadeAnim, scaleAnim, delay])
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <View style={styles.infoItem}>
        <View style={styles.infoLeft}>
          <Text style={styles.infoEmoji}>{emoji}</Text>
          <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <View style={styles.infoValueContainer}>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Header Component with Animation
const AnimatedHeader = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        })
      ]);

      animation.start();

      return () => {
        animation.stop();
        fadeAnim.setValue(0);
        slideAnim.setValue(-100);
      };
    }, [fadeAnim, slideAnim])
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={[THEME.header, '#fef9c3']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.headerEmoji}>⚡</Text>
              <View>
                <Text style={styles.title}>Power Settings</Text>
                <Text style={styles.subtitle}>Customize DuaLand</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportDatabase = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    try {
      await exportDatabase();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScreenWrapper bottomMargin={30}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
        
        {/* Background */}
        <View style={styles.background} />

        {/* Header */}
        <AnimatedHeader />

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Preferences Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>⚙️</Text>
              <Text style={styles.sectionTitle}>Preferences</Text>
            </View>
            
            <AnimatedSettingItem
              title="Notifications"
              description="Receive prayer reminders and updates"
              value={notifications}
              onValueChange={setNotifications}
              emoji="🔔"
              delay={100}
            />
            
            <AnimatedSettingItem
              title="Dark Mode"
              description="Switch to dark theme"
              value={darkMode}
              onValueChange={setDarkMode}
              emoji="🌙"
              delay={200}
            />
            
            <AnimatedSettingItem
              title="Auto-play Audio"
              description="Automatically play Dua audio"
              value={autoPlay}
              onValueChange={setAutoPlay}
              emoji="🎵"
              delay={300}
            />
            
            <AnimatedSettingItem
              title="Haptic Feedback"
              description="Vibrate on interactions"
              value={hapticFeedback}
              onValueChange={setHapticFeedback}
              emoji="📱"
              delay={400}
            />
          </View>

          {/* Data Management Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>💾</Text>
              <Text style={styles.sectionTitle}>Data Management</Text>
            </View>
            
            <View style={styles.dataActionsContainer}>
              <TouchableOpacity 
                style={[
                  styles.dataActionButton,
                  isExporting && styles.dataActionButtonDisabled
                ]}
                onPress={handleExportDatabase}
                disabled={isExporting}
              >
                <View style={[styles.dataActionIcon, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.dataActionEmoji}>
                    {isExporting ? '⏳' : '💾'}
                  </Text>
                </View>
                <View style={styles.dataActionContent}>
                  <Text style={styles.dataActionTitle}>
                    {isExporting ? 'Exporting...' : 'Export Database'}
                  </Text>
                  <Text style={styles.dataActionDescription}>
                    Backup your complete data (SQLite + JSON fallback)
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dataActionButton}
                onPress={viewDatabaseInfo}
              >
                <View style={[styles.dataActionIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.dataActionEmoji}>📊</Text>
                </View>
                <View style={styles.dataActionContent}>
                  <Text style={styles.dataActionTitle}>Database Info</Text>
                  <Text style={styles.dataActionDescription}>
                    View SQLite database statistics and details
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.dataActionButton}
                onPress={importDatabase}
              >
                <View style={[styles.dataActionIcon, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.dataActionEmoji}>📥</Text>
                </View>
                <View style={styles.dataActionContent}>
                  <Text style={styles.dataActionTitle}>Import Database</Text>
                  <Text style={styles.dataActionDescription}>
                    Restore SQLite backup (Coming Soon)
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* App Information Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>📱</Text>
              <Text style={styles.sectionTitle}>App Information</Text>
            </View>
            
            <AnimatedInfoItem 
              label="Version" 
              value="1.0.0"
              emoji="🏷️"
              delay={500}
            />
            <AnimatedInfoItem 
              label="Last Updated" 
              value="January 2024"
              emoji="📅"
              delay={600}
            />
            <AnimatedInfoItem 
              label="Build Number" 
              value="2024.01.001"
              emoji="🔢"
              delay={700}
            />
          </View>

          {/* Quick Actions Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEmoji}>🚀</Text>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#EC4899' }]}>
                  <Text style={styles.actionEmoji}>❤️</Text>
                </View>
                <Text style={styles.actionText}>Rate App</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.actionEmoji}>↗️</Text>
                </View>
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                  <Text style={styles.actionEmoji}>❓</Text>
                </View>
                <Text style={styles.actionText}>Help</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F9FF',
  },
  header: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text.dark,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.text.dark,
    fontWeight: '500',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingEmoji: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emojiText: {
    fontSize: 20,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  switchContainer: {
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: 12,
    opacity: 0.7,
  },
  infoLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  infoValueContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  // Data Management Styles
  dataActionsContainer: {
    marginTop: 8,
  },
  dataActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.1)',
    marginBottom: 12,
  },
  dataActionButtonDisabled: {
    opacity: 0.6,
  },
  dataActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  dataActionEmoji: {
    fontSize: 20,
  },
  dataActionContent: {
    flex: 1,
  },
  dataActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  dataActionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  // Quick Actions Styles
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});