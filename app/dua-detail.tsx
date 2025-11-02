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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeftIcon, 
  PlayIcon, 
  PauseIcon,
  RewindIcon, 
  RepeatIcon,
  StarIcon,
  ShareIcon 
} from '../Icons';

const { width } = Dimensions.get('window');

export default function DuaDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [viewMode, setViewMode] = useState<'wordByWord' | 'completeDua'>('wordByWord');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const bounceAnim = useState(new Animated.Value(0))[0];

  const dua = {
    id: params.id,
    title: params.title,
    arabic: params.arabic,
    translation: params.translation,
    reference: params.reference,
    imageUrl: params.imageUrl,
    sections: [{
      arabic: params.arabic,
      translation: params.translation,
      reference: params.reference
    }]
  };

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
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    // Pulse animation for play button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePlayPause = () => {
    Vibration.vibrate(50);
    setIsPlaying(!isPlaying);
    
    // Bounce animation
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
    
    // Heart animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSegmentPress = (mode: 'wordByWord' | 'completeDua') => {
    Vibration.vibrate(30);
    setViewMode(mode);
  };

  const sections = dua.sections || [{
    arabic: dua.arabic,
    translation: dua.translation,
    reference: dua.reference
  }];

  const currentDuaSection = sections[currentSection];

  return (
    <SafeAreaView style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.back()}
        >
          <ArrowLeftIcon size={28} color="#6366f1" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle} numberOfLines={1}>
          {dua.title}
        </Text>
        
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleFavorite}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <StarIcon 
              size={28} 
              color={isFavorite ? "#f59e0b" : "#d1d5db"} 
              fill={isFavorite ? "#f59e0b" : "none"}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Animated Hero Section */}
        <Animated.View 
          style={[
            styles.heroContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.gradientBackground} />
          <Image
            source={{ uri: dua.imageUrl as string || 'https://i.ibb.co/0J6S6fR/kaaba-detail.png' }}
            style={styles.heroImage}
          />
          <View style={styles.floatingStars}>
            <Text style={styles.star}>⭐</Text>
            <Text style={[styles.star, styles.star2]}>🌟</Text>
            <Text style={[styles.star, styles.star3]}>✨</Text>
          </View>
        </Animated.View>

        {/* Interactive Segmented Control */}
        <Animated.View 
          style={[
            styles.segmentedControl,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity
            style={[
              styles.segment,
              viewMode === 'wordByWord' && styles.segmentActive,
            ]}
            onPress={() => handleSegmentPress('wordByWord')}
          >
            <Text style={[
              styles.segmentText,
              viewMode === 'wordByWord' && styles.segmentTextActive,
            ]}>
              🎮 LEARN MODE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segment,
              viewMode === 'completeDua' && styles.segmentActive,
            ]}
            onPress={() => handleSegmentPress('completeDua')}
          >
            <Text style={[
              styles.segmentText,
              viewMode === 'completeDua' && styles.segmentTextActive,
            ]}>
              📖 FULL DUA
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Dua Content Section */}
        <Animated.View 
          style={[
            styles.duaSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Fun Audio Controls */}
          <View style={styles.audioControls}>
            <TouchableOpacity style={styles.audioButton}>
              <RewindIcon size={28} color="#6366f1" />
            </TouchableOpacity>
            
            <Animated.View style={{ transform: [{ scale: pulseAnim }, { translateY: bounceAnim }] }}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={handlePlayPause}
              >
                <View style={styles.playButtonGlow} />
                {isPlaying ? (
                  <PauseIcon size={32} color="#ffffff" />
                ) : (
                  <PlayIcon size={32} color="#ffffff" />
                )}
              </TouchableOpacity>
            </Animated.View>
            
            <TouchableOpacity style={styles.audioButton}>
              <RepeatIcon size={28} color="#6366f1" />
            </TouchableOpacity>
          </View>

          {/* Arabic Text with Beautiful Styling */}
          <View style={styles.arabicContainer}>
            <Text style={styles.arabicText}>
              {currentDuaSection.arabic}
            </Text>
            <View style={styles.arabicDecoration} />
          </View>

          {/* Translation with Fun Emoji */}
          <View style={styles.translationContainer}>
            <Text style={styles.translationLabel}>🎯 What It Means</Text>
            <Text style={styles.translationText}>
              {currentDuaSection.translation}
            </Text>
          </View>

          {/* Reference with Sparkle */}
          <View style={styles.referenceContainer}>
            <Text style={styles.referenceText}>
              📚 {currentDuaSection.reference}
            </Text>
          </View>

          {/* Progress Dots */}
          {sections.length > 1 && (
            <View style={styles.progressContainer}>
              {sections.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.progressDot,
                    index === currentSection && styles.progressDotActive
                  ]}
                  onPress={() => setCurrentSection(index)}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Fun Facts Section */}
        <Animated.View 
          style={[
            styles.funFactsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.funFactsTitle}>🌟 Did You Know?</Text>
          <Text style={styles.funFactsText}>
            This beautiful prayer brings peace and blessings! Say it with love in your heart! 💖
          </Text>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Animated Footer */}
      <Animated.View 
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerEmoji}>🔊</Text>
          <Text style={styles.footerText}>Sound</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerEmoji}>🔄</Text>
          <Text style={styles.footerText}>Repeat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton}>
          <ShareIcon size={24} color="#6366f1" />
          <Text style={styles.footerText}>Share</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headerButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    position: 'relative',
    backgroundColor: '#6366f1',
    borderRadius: 24,
    margin: 16,
    marginBottom: 24,
    overflow: 'hidden',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6366f1',
  },
  heroImage: {
    width: '80%',
    height: 120,
    borderRadius: 16,
  },
  floatingStars: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  star: {
    fontSize: 20,
    position: 'absolute',
  },
  star2: {
    top: 25,
    right: 15,
    fontSize: 16,
  },
  star3: {
    top: 45,
    right: 5,
    fontSize: 18,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 25,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#6366f1',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  duaSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 20,
  },
  audioButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 16,
    borderRadius: 20,
  },
  playButton: {
    backgroundColor: '#6366f1',
    padding: 20,
    borderRadius: 30,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  playButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#6366f1',
    borderRadius: 30,
    opacity: 0.3,
  },
  arabicContainer: {
    marginBottom: 20,
    position: 'relative',
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
    backgroundColor: '#6366f1',
    marginTop: 12,
    borderRadius: 2,
  },
  translationContainer: {
    backgroundColor: 'rgba(255, 245, 157, 0.3)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  translationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d97706',
    marginBottom: 8,
  },
  translationText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  referenceContainer: {
    backgroundColor: 'rgba(209, 250, 229, 0.3)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  referenceText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1d5db',
  },
  progressDotActive: {
    backgroundColor: '#6366f1',
    transform: [{ scale: 1.2 }],
  },
  funFactsContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  funFactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 8,
  },
  funFactsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    paddingHorizontal: 20,
  },
  footerButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    minWidth: 70,
  },
  footerEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
});