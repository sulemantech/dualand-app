import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useDuaStore } from '../stores/duaStore';
import { RootStackParamList } from '../navigation/NavigationTypes';

type DuaAudioRouteProp = RouteProp<RootStackParamList, 'DuaAudio'>;
type DuaAudioNavigationProp = StackNavigationProp<RootStackParamList, 'DuaAudio'>;

export default function DuaAudioScreen() {
  const navigation = useNavigation<DuaAudioNavigationProp>();
  const route = useRoute<DuaAudioRouteProp>();
  const { duaId } = route.params;
  
  const { 
    getDua, 
    getNextDuaId, 
    getPreviousDuaId, 
    toggleFavorite, 
    updateMemorizationStatus,
    currentCategoryDuas
  } = useDuaStore();

  const [currentDua, setCurrentDua] = useState(getDua(duaId));
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudio, setActiveAudio] = useState<'full' | 'word-by-word' | null>(null);

  useEffect(() => {
    const dua = getDua(duaId);
    setCurrentDua(dua);
  }, [duaId, currentCategoryDuas]);

  if (!currentDua) {
    return (
      <View style={styles.container}>
        <Text>Dua not found</Text>
      </View>
    );
  }

  const hasPrevious = !!getPreviousDuaId(currentDua.id);
  const hasNext = !!getNextDuaId(currentDua.id);

  const handleFavoritePress = () => {
    toggleFavorite(currentDua.id);
    setCurrentDua({ ...currentDua, is_favorited: !currentDua.is_favorited });
  };

  const handleMemorizationStatusChange = (status: 'not_started' | 'learning' | 'memorized') => {
    updateMemorizationStatus(currentDua.id, status);
    setCurrentDua({ ...currentDua, memorization_status: status });
  };

  const handleSwipeNavigation = (direction: 'previous' | 'next') => {
    if (direction === 'previous' && hasPrevious) {
      const previousId = getPreviousDuaId(currentDua.id);
      if (previousId) {
        navigation.replace('DuaAudio', { duaId: previousId });
      }
    } else if (direction === 'next' && hasNext) {
      const nextId = getNextDuaId(currentDua.id);
      if (nextId) {
        navigation.replace('DuaAudio', { duaId: nextId });
      }
    }
  };

  const handleAudioPlay = (type: 'full' | 'word-by-word') => {
    setActiveAudio(type);
    setIsPlaying(true);
    // TODO: Implement actual audio playback with expo-audio
    Alert.alert('Audio Playback', `${type === 'full' ? 'Complete Dua' : 'Word by Word'} audio would play here`);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
    // TODO: Implement actual audio pause
  };

  const getMemorizationStatusColor = (status: string) => {
    switch (status) {
      case 'memorized': return '#2D7D46';
      case 'learning': return '#3182CE';
      default: return '#A0AEC0';
    }
  };

  const getProgressWidth = (type: 'full' | 'word-by-word') => {
    // Mock progress - in real app, calculate from actual playback
    return type === 'full' ? '30%' : '50%';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentDua.title}
        </Text>
        
        <TouchableOpacity onPress={handleFavoritePress}>
          <Ionicons 
            name={currentDua.is_favorited ? 'heart' : 'heart-outline'} 
            size={24} 
            color={currentDua.is_favorited ? '#E53E3E' : '#2D3748'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Arabic Text */}
        <View style={styles.arabicSection}>
          <Text style={styles.arabicText}>
            {currentDua.arabic_text}
          </Text>
        </View>

        {/* Translation */}
        <View style={styles.translationSection}>
          <Text style={styles.sectionLabel}>Translation</Text>
          <Text style={styles.translationText}>
            {currentDua.translation}
          </Text>
        </View>

        {/* Reference */}
        <View style={styles.referenceSection}>
          <Text style={styles.referenceText}>
            {currentDua.reference}
          </Text>
        </View>

        {/* Audio Players */}
        <View style={styles.audioSection}>
          {/* Complete Dua Player */}
          <View style={styles.audioPlayer}>
            <Text style={styles.audioPlayerTitle}>Complete Dua</Text>
            
            <View style={styles.audioControls}>
              <TouchableOpacity 
                style={[
                  styles.playButton,
                  activeAudio === 'full' && styles.playButtonActive
                ]}
                onPress={() => isPlaying && activeAudio === 'full' ? 
                  handleAudioPause() : handleAudioPlay('full')}
              >
                <Ionicons 
                  name={isPlaying && activeAudio === 'full' ? 'pause' : 'play'} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill, 
                    { width: getProgressWidth('full') }
                  ]} />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>1:24</Text>
                  <Text style={styles.timeText}>4:32</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.speedButton}>
                <Text style={styles.speedButtonText}>1x</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Word by Word Player */}
          <View style={styles.audioPlayer}>
            <Text style={styles.audioPlayerTitle}>WORD BY WORD</Text>
            
            <View style={styles.audioControls}>
              <TouchableOpacity 
                style={[
                  styles.playButton,
                  { backgroundColor: '#718096' },
                  activeAudio === 'word-by-word' && { backgroundColor: '#2D7D46' }
                ]}
                onPress={() => isPlaying && activeAudio === 'word-by-word' ? 
                  handleAudioPause() : handleAudioPlay('word-by-word')}
              >
                <Ionicons 
                  name={isPlaying && activeAudio === 'word-by-word' ? 'pause' : 'play'} 
                  size={16} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[
                    styles.progressFill, 
                    { width: getProgressWidth('word-by-word'), backgroundColor: '#718096' }
                  ]} />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Memorization Status */}
        <View style={styles.memorizationSection}>
          <Text style={styles.sectionLabel}>Memorization Status</Text>
          <View style={styles.statusButtons}>
            {['not_started', 'learning', 'memorized'].map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  currentDua.memorization_status === status && [
                    styles.statusButtonActive,
                    { backgroundColor: getMemorizationStatusColor(status) }
                  ]
                ]}
                onPress={() => handleMemorizationStatusChange(status as any)}
              >
                <Text style={[
                  styles.statusButtonText,
                  currentDua.memorization_status === status && styles.statusButtonTextActive
                ]}>
                  {status.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Swipe Navigation Hints */}
      <View style={styles.swipeNavigation}>
        <Text style={[
          styles.swipeHint,
          !hasPrevious && styles.swipeHintDisabled
        ]}>
          {hasPrevious ? '← Swipe for Previous' : ''}
        </Text>
        
        <Text style={[
          styles.swipeHint,
          !hasNext && styles.swipeHintDisabled
        ]}>
          {hasNext ? 'Swipe for Next →' : ''}
        </Text>
      </View>

      {/* Swipe Gesture Areas */}
      <TouchableOpacity 
        style={[styles.swipeArea, styles.swipeAreaLeft]}
        onPress={() => handleSwipeNavigation('previous')}
        disabled={!hasPrevious}
      />
      <TouchableOpacity 
        style={[styles.swipeArea, styles.swipeAreaRight]}
        onPress={() => handleSwipeNavigation('next')}
        disabled={!hasNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  arabicSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  arabicText: {
    fontSize: 24,
    color: '#2D3748',
    textAlign: 'right',
    lineHeight: 36,
    fontFamily: 'System', // Use a proper Arabic font in production
  },
  translationSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  translationText: {
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 24,
  },
  referenceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  referenceText: {
    fontSize: 14,
    color: '#718096',
    fontStyle: 'italic',
  },
  audioSection: {
    gap: 16,
    marginBottom: 24,
  },
  audioPlayer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  audioPlayerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  audioControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    backgroundColor: '#2D7D46',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonActive: {
    backgroundColor: '#1E5E2E',
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2D7D46',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#718096',
  },
  speedButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F7FAFC',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  speedButtonText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  memorizationSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statusButtonActive: {
    borderColor: 'transparent',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#718096',
    textTransform: 'uppercase',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
  },
  swipeNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  swipeHint: {
    fontSize: 14,
    color: '#2D7D46',
    fontWeight: '500',
  },
  swipeHintDisabled: {
    color: '#E2E8F0',
  },
  swipeArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 50,
    opacity: 0.1,
  },
  swipeAreaLeft: {
    left: 0,
  },
  swipeAreaRight: {
    right: 0,
  },
});