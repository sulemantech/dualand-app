import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useDuaStore } from '../stores/duaStore';
import { RootStackParamList } from '../navigation/NavigationTypes';
import AudioSection from '../components/audio/AudioSection'; // Import the new AudioSection

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

  const getMemorizationStatusColor = (status: string) => {
    switch (status) {
      case 'memorized': return '#059669';
      case 'learning': return '#3B82F6';
      default: return '#CBD5E1';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {currentDua.title}
        </Text>
        
        <TouchableOpacity onPress={handleFavoritePress}>
          <Ionicons 
            name={currentDua.is_favorited ? 'heart' : 'heart-outline'} 
            size={24} 
            color={currentDua.is_favorited ? '#EF4444' : '#1E293B'} 
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

        {/* Audio Section - REPLACED WITH REAL IMPLEMENTATION */}
        <AudioSection duaId={currentDua.id} />

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

        {/* Dua Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionLabel}>About This Dua</Text>
          <View style={styles.infoItem}>
            <Ionicons name="book" size={16} color="#64748B" />
            <Text style={styles.infoText}>Practice this Dua daily for better memorization</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="repeat" size={16} color="#64748B" />
            <Text style={styles.infoText}>Repeat after the audio to improve pronunciation</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="heart" size={16} color="#64748B" />
            <Text style={styles.infoText}>Favorite important Duas for quick access</Text>
          </View>
        </View>
      </ScrollView>

      {/* Swipe Navigation Hints */}
      <View style={styles.swipeNavigation}>
        <TouchableOpacity 
          style={[styles.navButton, !hasPrevious && styles.navButtonDisabled]}
          onPress={() => handleSwipeNavigation('previous')}
          disabled={!hasPrevious}
        >
          <Ionicons name="chevron-back" size={20} color={hasPrevious ? '#D97706' : '#CBD5E1'} />
          <Text style={[styles.navButtonText, !hasPrevious && styles.navButtonTextDisabled]}>
            Previous
          </Text>
        </TouchableOpacity>
        
        <View style={styles.navInfo}>
          <Text style={styles.navInfoText}>
            {currentCategoryDuas.findIndex(d => d.id === currentDua.id) + 1} of {currentCategoryDuas.length}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.navButton, !hasNext && styles.navButtonDisabled]}
          onPress={() => handleSwipeNavigation('next')}
          disabled={!hasNext}
        >
          <Text style={[styles.navButtonText, !hasNext && styles.navButtonTextDisabled]}>
            Next
          </Text>
          <Ionicons name="chevron-forward" size={20} color={hasNext ? '#D97706' : '#CBD5E1'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  arabicSection: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  arabicText: {
    fontSize: 24,
    color: '#1E293B',
    textAlign: 'right',
    lineHeight: 36,
    fontFamily: 'System',
  },
  translationSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  translationText: {
    fontSize: 16,
    color: '#1E293B',
    lineHeight: 24,
  },
  referenceSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  referenceText: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  memorizationSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
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
    color: '#64748B',
    textTransform: 'uppercase',
  },
  statusButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    flex: 1,
    lineHeight: 20,
  },
  swipeNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    minWidth: 100,
    justifyContent: 'center',
  },
  navButtonDisabled: {
    backgroundColor: '#F1F5F9',
  },
  navButtonText: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '600',
    marginHorizontal: 4,
  },
  navButtonTextDisabled: {
    color: '#CBD5E1',
  },
  navInfo: {
    alignItems: 'center',
  },
  navInfoText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
});