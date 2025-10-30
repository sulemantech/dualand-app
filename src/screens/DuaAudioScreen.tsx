import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { databaseService, Dua } from '../lib/database/database';

const DuaAudioScreen = () => {
  const [activeTab, setActiveTab] = useState<'wordByWord' | 'complete'>('wordByWord');
  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('1'); // Default to first category

  // Load duas from database
  useEffect(() => {
    const loadDuas = async () => {
      try {
        setIsLoading(true);
        const categoryDuas = await databaseService.getDuasByCategory(currentCategory);
        setDuas(categoryDuas);
      } catch (error) {
        console.error('Error loading duas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDuas();
  }, [currentCategory]);

  const toggleFavorite = async (id: string) => {
    try {
      const dua = duas.find(d => d.id === id);
      if (dua) {
        const newFavoriteStatus = !dua.is_favorited;
        await databaseService.updateDuaFavorite(id, newFavoriteStatus);
        
        // Update local state
        setDuas(prevDuas => 
          prevDuas.map(d => 
            d.id === id ? { ...d, is_favorited: newFavoriteStatus } : d
          )
        );
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const goToNextDua = () => {
    setCurrentDuaIndex(prev => 
      prev < duas.length - 1 ? prev + 1 : prev
    );
  };

  const goToPrevDua = () => {
    setCurrentDuaIndex(prev => 
      prev > 0 ? prev - 1 : prev
    );
  };

  // Fling gesture for swipe navigation
  const flingGesture = Gesture.Fling()
    .direction(Directions.LEFT)
    .onStart(() => {
      goToNextDua();
    });

  const flingGestureRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onStart(() => {
      goToPrevDua();
    });

  const currentDua = duas[currentDuaIndex];

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D5AFF" />
          <Text style={styles.loadingText}>Loading duas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state
  if (!currentDua) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={64} color="#CCC" />
          <Text style={styles.emptyText}>No duas found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="home-outline" size={24} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Dua Audio</Text>
          
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Dua Visual Illustration */}
        <View style={styles.visualIllustration}>
          <Text style={styles.illustrationText}>{currentDua.title}</Text>
          <Text style={styles.duaCounter}>
            {currentDuaIndex + 1} / {duas.length}
          </Text>
        </View>

        {/* Tab Switch */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'wordByWord' && styles.activeTab
            ]}
            onPress={() => setActiveTab('wordByWord')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'wordByWord' && styles.activeTabText
            ]}>
              Word By Word
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'complete' && styles.activeTab
            ]}
            onPress={() => setActiveTab('complete')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'complete' && styles.activeTabText
            ]}>
              Complete Dua
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dua Content with Swipe Gesture */}
        <GestureDetector gesture={Gesture.Exclusive(flingGesture, flingGestureRight)}>
          <Animated.View style={styles.duaContent}>
            <View style={styles.duaCard}>
              {/* Dua Title */}
              <Text style={styles.duaTitle}>{currentDua.title}</Text>
              
              {/* Audio Controls */}
              <View style={styles.audioControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => toggleFavorite(currentDua.id)}
                >
                  <Ionicons
                    name={currentDua.is_favorited ? "heart" : "heart-outline"}
                    size={24}
                    color={currentDua.is_favorited ? "#FF6B6B" : "#666"}
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.playButton}>
                  <Ionicons name="play" size={32} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="repeat" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Arabic Text */}
              <Text style={styles.arabicText}>{currentDua.arabic_text}</Text>
              
              {/* Translation */}
              <Text style={styles.translationText}>{currentDua.translation}</Text>
              
              {/* Reference */}
              <Text style={styles.referenceText}>{currentDua.reference}</Text>

              {/* Memorization Status */}
              <View style={styles.memorizationContainer}>
                <Text style={styles.memorizationText}>
                  Status: {currentDua.memorization_status}
                </Text>
              </View>
            </View>

            {/* Swipe Instructions */}
            <View style={styles.swipeInstruction}>
              <Text style={styles.swipeInstructionText}>
                Swipe left or right to navigate between duas
              </Text>
            </View>
          </Animated.View>
        </GestureDetector>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity 
            style={[styles.navButton, currentDuaIndex === 0 && styles.disabledButton]}
            onPress={goToPrevDua}
            disabled={currentDuaIndex === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={24} 
              color={currentDuaIndex === 0 ? '#CCC' : '#333'} 
            />
            <Text style={[
              styles.navButtonText,
              currentDuaIndex === 0 && styles.disabledText
            ]}>
              Prev
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="library-outline" size={24} color="#333" />
            <Text style={styles.navButtonText}>Library</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="share-social-outline" size={24} color="#333" />
            <Text style={styles.navButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.navButton, 
              currentDuaIndex === duas.length - 1 && styles.disabledButton
            ]}
            onPress={goToNextDua}
            disabled={currentDuaIndex === duas.length - 1}
          >
            <Ionicons 
              name="chevron-forward" 
              size={24} 
              color={currentDuaIndex === duas.length - 1 ? '#CCC' : '#333'} 
            />
            <Text style={[
              styles.navButtonText,
              currentDuaIndex === duas.length - 1 && styles.disabledText
            ]}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
   loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  memorizationContainer: {
    marginTop: 16,
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
  },
  memorizationText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  visualIllustration: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  illustrationText: {
    fontSize: 16,
    color: '#666',
  },
  duaCounter: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#2D5AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  duaContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  duaCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  duaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  controlButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  playButton: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: '#2D5AFF',
    shadowColor: '#2D5AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  arabicText: {
    fontSize: 22,
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
    fontFamily: 'System',
  },
  translationText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  referenceText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
  swipeInstruction: {
    alignItems: 'center',
    marginTop: 20,
  },
  swipeInstructionText: {
    fontSize: 12,
    color: '#CCC',
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#FFF',
    paddingBottom: 20, // Extra padding for safe area
  },
  navButton: {
    alignItems: 'center',
    padding: 8,
    minWidth: 60,
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    fontWeight: '500',
  },
  disabledText: {
    color: '#CCC',
  },
});

export default DuaAudioScreen;