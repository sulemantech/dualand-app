import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
  Vibration,
  StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowLeftIcon, 
  PlayIcon, 
  PauseIcon,
  RewindIcon, 
  RepeatIcon,
  StarIcon,
  ShareIcon,
  BookIcon,
  HeartIcon
} from '../Icons';

const { width } = Dimensions.get('window');

// Mock data for related Duas
const relatedDuas = [
  {
    id: '2',
    title: 'Dua for Morning',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',
    translation: 'We have reached the morning and at this very time all sovereignty belongs to Allah',
    reference: 'Sahih Muslim 2723',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'morning'
  },
  {
    id: '3',
    title: 'Dua for Evening',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ',
    translation: 'We have reached the evening and at this very time all sovereignty belongs to Allah',
    reference: 'Sahih Muslim 2723',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'evening'
  },
  {
    id: '4',
    title: 'Dua for Protection',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    translation: 'I seek refuge in the perfect words of Allah from the evil of what He has created',
    reference: 'Sahih Muslim 2708',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    category: 'protection'
  }
];

// Enhanced Dua data with sections
const enhancedDuaData = {
  '1': {
    id: '1',
    title: 'Dua for Knowledge',
    arabic: 'رَّبِّ زِدْنِي عِلْمًا',
    translation: 'My Lord, increase me in knowledge',
    reference: 'Quran 20:114',
    imageUrl: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop',
    category: 'knowledge',
    sections: [
      {
        arabic: 'رَّبِّ زِدْنِي عِلْمًا',
        translation: 'My Lord, increase me in knowledge',
        explanation: 'This beautiful prayer was taught by Allah to Prophet Musa (Moses) when he asked for more understanding.',
        benefits: ['Increases wisdom and understanding', 'Opens doors to beneficial knowledge', 'Helps in academic success']
      }
    ],
    relatedCategory: 'knowledge'
  },
  '2': {
    id: '2',
    title: 'Dua for Patience',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا',
    translation: 'Our Lord, pour upon us patience',
    reference: 'Quran 2:250',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    category: 'patience',
    sections: [
      {
        arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا',
        translation: 'Our Lord, pour upon us patience',
        explanation: 'This dua helps in difficult times and brings tranquility to the heart.',
        benefits: ['Strengthens patience during trials', 'Brings peace of mind', 'Helps overcome challenges']
      }
    ],
    relatedCategory: 'patience'
  }
};

// Animated Related Dua Card
const AnimatedRelatedDuaCard = ({ dua, onPress, delay = 0 }) => {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.sequence([
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
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <TouchableOpacity style={styles.relatedCard} onPress={onPress}>
        <Image source={{ uri: dua.imageUrl }} style={styles.relatedCardImage} />
        <View style={styles.relatedCardContent}>
          <Text style={styles.relatedCardTitle} numberOfLines={2}>
            {dua.title}
          </Text>
          <Text style={styles.relatedCardReference}>{dua.reference}</Text>
        </View>
        <View style={styles.relatedCardArrow}>
          <Text style={styles.arrowEmoji}>➡️</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function DuaDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [viewMode, setViewMode] = useState<'learn' | 'practice' | 'master'>('learn');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const heartScaleAnim = useState(new Animated.Value(1))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const bounceAnim = useState(new Animated.Value(0))[0];
  const progressAnim = useState(new Animated.Value(0))[0];

  const duaId = params.id as string;
  const dua = enhancedDuaData[duaId] || {
    id: params.id,
    title: params.title,
    arabic: params.arabic,
    translation: params.translation,
    reference: params.reference,
    imageUrl: params.imageUrl,
    category: 'general',
    sections: [{
      arabic: params.arabic,
      translation: params.translation,
      reference: params.reference,
      explanation: 'A beautiful prayer for blessings and guidance.',
      benefits: ['Brings peace', 'Increases faith', 'Provides protection']
    }],
    relatedCategory: 'general'
  };

  const relatedDuasInCategory = relatedDuas.filter(d => d.category === dua.relatedCategory && d.id !== dua.id);

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: 0.7, // 70% progress for demo
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, []);

  const handlePlayPause = () => {
    Vibration.vibrate(50);
    setIsPlaying(!isPlaying);
    
    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFavorite = () => {
    Vibration.vibrate(50);
    setIsFavorite(!isFavorite);
    
    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.3,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(heartScaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleModeChange = (mode: 'learn' | 'practice' | 'master') => {
    Vibration.vibrate(30);
    setViewMode(mode);
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 0.75];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
    Vibration.vibrate(30);
  };

  const handleRepeatToggle = () => {
    const modes = ['off', 'one', 'all'] as const;
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
    Vibration.vibrate(30);
  };

  const currentDuaSection = dua.sections[currentSection];

  const getModeDescription = () => {
    switch (viewMode) {
      case 'learn':
        return '🎯 Learn the meaning and pronunciation';
      case 'practice':
        return '🔄 Practice with audio and repetition';
      case 'master':
        return '⭐ Master with advanced exercises';
      default:
        return '';
    }
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'off': return '🔁';
      case 'one': return '🔂';
      case 'all': return '🔄';
      default: return '🔁';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      <View style={styles.background} />

      {/* Header */}
      <Animated.View 
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <LinearGradient colors={['#8B5CF6', '#7C3AED']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <ArrowLeftIcon size={28} color="#ffffff" />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>{dua.title}</Text>
              <Text style={styles.headerSubtitle}>{dua.category.toUpperCase()} • {dua.reference}</Text>
            </View>
            
            <TouchableOpacity style={styles.headerButton} onPress={handleFavorite}>
              <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                <HeartIcon 
                  size={28} 
                  color={isFavorite ? "#EC4899" : "#ffffff"} 
                  fill={isFavorite ? "#EC4899" : "none"}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Learning Mode Selector */}
        <Animated.View 
          style={[
            styles.modeSelector,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.modeHeader}>
            <Text style={styles.modeTitle}>Learning Mode</Text>
            <Text style={styles.modeDescription}>{getModeDescription()}</Text>
          </View>
          
          <View style={styles.modeButtons}>
            <TouchableOpacity
              style={[styles.modeButton, viewMode === 'learn' && styles.modeButtonActive]}
              onPress={() => handleModeChange('learn')}
            >
              <Text style={styles.modeEmoji}>📚</Text>
              <Text style={[styles.modeButtonText, viewMode === 'learn' && styles.modeButtonTextActive]}>
                Learn
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, viewMode === 'practice' && styles.modeButtonActive]}
              onPress={() => handleModeChange('practice')}
            >
              <Text style={styles.modeEmoji}>🎮</Text>
              <Text style={[styles.modeButtonText, viewMode === 'practice' && styles.modeButtonTextActive]}>
                Practice
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modeButton, viewMode === 'master' && styles.modeButtonActive]}
              onPress={() => handleModeChange('master')}
            >
              <Text style={styles.modeEmoji}>⭐</Text>
              <Text style={[styles.modeButtonText, viewMode === 'master' && styles.modeButtonTextActive]}>
                Master
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Dua Content */}
        <Animated.View 
          style={[
            styles.duaSection,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Advanced Audio Controls */}
          <View style={styles.audioSection}>
            <View style={styles.audioControls}>
              <TouchableOpacity style={styles.audioButton} onPress={handleSpeedChange}>
                <Text style={styles.audioButtonText}>{playbackSpeed}x</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.audioButton} onPress={handleRepeatToggle}>
                <Text style={styles.audioButtonText}>{getRepeatIcon()}</Text>
              </TouchableOpacity>
              
              <Animated.View style={{ transform: [{ scale: pulseAnim }, { translateY: bounceAnim }] }}>
                <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
                  <LinearGradient
                    colors={isPlaying ? ['#EC4899', '#DB2777'] : ['#8B5CF6', '#7C3AED']}
                    style={styles.playButtonGradient}
                  >
                    {isPlaying ? (
                      <PauseIcon size={32} color="#ffffff" />
                    ) : (
                      <PlayIcon size={32} color="#ffffff" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              
              <TouchableOpacity style={styles.audioButton}>
                <RewindIcon size={24} color="#8B5CF6" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.audioButton}>
                <ShareIcon size={24} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <Animated.View 
                  style={[
                    styles.progressBarFill,
                    { width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    }) }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>70% Mastered</Text>
            </View>
          </View>

          {/* Arabic Text */}
          <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>{currentDuaSection.arabic}</Text>
            <View style={styles.arabicDecoration} />
          </View>

          {/* Translation & Explanation */}
          <View style={styles.translationContainer}>
            <Text style={styles.translationLabel}>🎯 Translation</Text>
            <Text style={styles.translationText}>{currentDuaSection.translation}</Text>
          </View>

          <View style={styles.explanationContainer}>
            <Text style={styles.explanationLabel}>💡 Explanation</Text>
            <Text style={styles.explanationText}>{currentDuaSection.explanation}</Text>
          </View>

          {/* Benefits */}
          <View style={styles.benefitsContainer}>
            <Text style={styles.benefitsLabel}>✨ Benefits</Text>
            {currentDuaSection.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.benefitEmoji}>🌟</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Related Duas */}
        {relatedDuasInCategory.length > 0 && (
          <Animated.View 
            style={[
              styles.relatedSection,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.sectionHeader}>
              <BookIcon size={24} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>More {dua.category} Duas</Text>
            </View>
            {relatedDuasInCategory.map((relatedDua, index) => (
              <AnimatedRelatedDuaCard
                key={relatedDua.id}
                dua={relatedDua}
                delay={index * 100 + 500}
                onPress={() => router.push({
                  pathname: '/dua-detail',
                  params: relatedDua
                })}
              />
            ))}
          </Animated.View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modeSelector: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  modeHeader: {
    marginBottom: 16,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  modeButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  modeEmoji: {
    fontSize: 20,
    marginBottom: 8,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  duaSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  audioSection: {
    marginBottom: 24,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  audioButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 12,
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  audioButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  playButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  playButtonGradient: {
    padding: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  arabicContainer: {
    marginBottom: 20,
  },
  arabicText: {
    fontSize: 28,
    color: '#1f2937',
    textAlign: 'right',
    lineHeight: 42,
    writingDirection: 'rtl',
    fontWeight: '600',
  },
  arabicDecoration: {
    height: 3,
    backgroundColor: '#8B5CF6',
    marginTop: 12,
    borderRadius: 2,
    opacity: 0.6,
  },
  translationContainer: {
    backgroundColor: 'rgba(255, 245, 157, 0.3)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  translationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  explanationContainer: {
    backgroundColor: 'rgba(209, 250, 229, 0.3)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  explanationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  benefitsContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  benefitsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitEmoji: {
    fontSize: 16,
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  relatedSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginLeft: 12,
  },
  relatedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  relatedCardImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  relatedCardContent: {
    flex: 1,
    marginLeft: 12,
  },
  relatedCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  relatedCardReference: {
    fontSize: 12,
    color: '#6b7280',
  },
  relatedCardArrow: {
    padding: 8,
  },
  arrowEmoji: {
    fontSize: 16,
  },
  bottomPadding: {
    height: 20,
  },
});