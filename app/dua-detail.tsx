import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');
const MAX_WIDTH = 450;
const CONTAINER_WIDTH = Math.min(width, MAX_WIDTH);

// Enhanced Kid-Friendly Theme with Better Colors for Kids
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
  },
  
  // Enhanced Gradient Colors aligned with theme
  gradients: {
    progress: ['#FF9E7D', '#FF6B9D', '#FF4D7A'], // Pink to coral gradient
    success: ['#4ECDC4', '#3BB4A8', '#2AA197'], // Mint green gradient
    header: ['#fcf8b1', '#fef9c3'], // Yellow header gradient
    card: ['#FFF7D0', '#FFEBB7'], // Card gradient
    stats: ['#FF9E7D', '#FF6B9D'], // Stats header gradient
  }
};

// Local images from your assets
const localImages = {
 dua_1: require('../assets/images/dua_31.png'),
  dua_2: require('../assets/images/dua_2.png'),
  dua_3: require('../assets/images/dua_3.png'),
  dua_4: require('../assets/images/dua_4.png'),
  dua_5: require('../assets/images/dua_5.png'),
  dua_6: require('../assets/images/dua_6.png'),
  dua_7: require('../assets/images/dua_7.png'),
  dua_8: require('../assets/images/dua_8.png'),
  dua_9: require('../assets/images/dua_9.png'),
  dua_10: require('../assets/images/dua_10.png'),
  dua_11: require('../assets/images/dua_11.png'),
  dua_12: require('../assets/images/dua_12.png'),
  dua_13: require('../assets/images/dua_13.png'),
  dua_14: require('../assets/images/dua_14.png'),
  dua_15: require('../assets/images/dua_15.png'),
  dua_16: require('../assets/images/dua_16.png'),
  dua_17: require('../assets/images/dua_17.png'),
  dua_18: require('../assets/images/dua_18.png'),
  dua_19: require('../assets/images/dua_19.png'),
  dua_20: require('../assets/images/dua_20.png'),
  dua_21: require('../assets/images/dua_21.png'),
  dua_22: require('../assets/images/dua_22.png'),
  dua_23: require('../assets/images/dua_23.png'),
  dua_24: require('../assets/images/dua_24.png'),
  dua_25: require('../assets/images/dua_25.png'),
  dua_26: require('../assets/images/dua_26.png'),
  dua_27: require('../assets/images/dua_27.png'),
  dua_28: require('../assets/images/dua_28.png'),
  dua_29: require('../assets/images/dua_29.png'),
  dua_30: require('../assets/images/dua_30.png'),
  dua_31: require('../assets/images/dua_31.png'),
  dua_32: require('../assets/images/dua_32.png'),
};

// Helper function to get local image
const getLocalImage = (duaId: string, duaNumber?: string) => {
  if (duaNumber) {
    const imageKey = `dua_${duaNumber}` as keyof typeof localImages;
    if (localImages[imageKey]) {
      return localImages[imageKey];
    }
  }
  
  const imageIndex = (parseInt(duaId) % 32) + 1;
  const fallbackImageKey = `dua_${imageIndex}` as keyof typeof localImages;
  return localImages[fallbackImageKey] || localImages.dua_1;
};

// Enhanced Dua data with kid-friendly content
const enhancedDuaData = {
  '1': {
    id: '1',
    title: 'Praise and Glory 🌟',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    translation: 'Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.',
    reference: 'Sahih Muslim',
    category: 'Tasbeeh',
    difficulty: '🟢 Easy',
    sections: [
      {
        arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
        translation: 'Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.',
        reference: '[Sahih Muslim]',
        meaning: 'This beautiful prayer helps us remember how amazing Allah is!'
      }
    ],
    relatedCategory: 'tasbeeh',
    funFact: '🌟 This dua is like giving Allah a big hug with your words!'
  }
};

// --- ENHANCED CUSTOM COMPONENTS ---

const BouncingButton = ({ children, onPress, style = {} }: { 
  children: any; 
  onPress: () => void; 
  style?: any; 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={style}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const ProgressStar = ({ filled, size = 20 }: { filled: boolean; size?: number }) => (
  <Text style={{ fontSize: size, marginHorizontal: 2 }}>
    {filled ? '⭐' : '☆'}
  </Text>
);

// Sleek Mode Toggle Component
const SleekModeToggle = ({ viewMode, onModeChange }: { 
  viewMode: 'Word by Word' | 'Complete Dua'; 
  onModeChange: (mode: 'Word by Word' | 'Complete Dua') => void; 
}) => {
  const slideAnim = useRef(new Animated.Value(viewMode === 'Word by Word' ? 0 : 1)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: viewMode === 'Word by Word' ? 0 : 1,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [viewMode]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, width * 0.5 - 40],
  });

  return (
    <View style={styles.sleekToggleContainer}>
      <Animated.View 
        style={[
          styles.sleekToggleSlider,
          { transform: [{ translateX }] }
        ]}
      />
      
      <TouchableOpacity 
        style={styles.sleekToggleOption}
        onPress={() => onModeChange('Word by Word')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.sleekToggleText,
          viewMode === 'Word by Word' && styles.sleekToggleTextActive
        ]}>
          Word by Word
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.sleekToggleOption}
        onPress={() => onModeChange('Complete Dua')}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.sleekToggleText,
          viewMode === 'Complete Dua' && styles.sleekToggleTextActive
        ]}>
          Complete Dua
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Enhanced Floating Particles
const FloatingParticles = React.memo(({ count = 8 }: { count?: number }) => {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      anim: new Animated.Value(0),
      startX: Math.random() * width,
      duration: 4000 + Math.random() * 3000,
      size: 12 + Math.random() * 16,
    }))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 500),
          Animated.timing(particle.anim, {
            toValue: 1,
            duration: particle.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animations.forEach(animation => animation.start());

    return () => {
      animations.forEach(animation => animation.stop());
    };
  }, [particles]);

  const emojis = ['✨', '⭐', '🌟', '💫', '🦄', '🌈', '🎀', '🌸'];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((particle, index) => {
        const translateY = particle.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -height],
        });

        const opacity = particle.anim.interpolate({
          inputRange: [0, 0.3, 0.7, 1],
          outputRange: [0, 0.8, 0.8, 0],
        });

        const scale = particle.anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1, 0.5],
        });

        return (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              left: particle.startX,
              top: height + 50,
              transform: [{ translateY }, { scale }],
              opacity,
            }}
          >
            <Text style={{ 
              fontSize: particle.size, 
              color: [THEME.primary, THEME.accent, THEME.success][index % 3]
            }}>
              {emojis[index % emojis.length]}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
});

// Word Highlight Component for Kids
const WordByWordDisplay = ({ arabicText, currentWordIndex }: { 
  arabicText: string; 
  currentWordIndex: number; 
}) => {
  const words = arabicText.split(' ');
  
  return (
    <View style={[styles.arabicTextContainer, { direction: 'rtl' }]}>
      <Text style={styles.arabicText}>
        {words.map((word, index) => (
          <Text 
            key={index} 
            style={[
              styles.arabicWord,
              index === currentWordIndex && styles.highlightedWord
            ]}
          >
            {word}{' '}
          </Text>
        ))}
      </Text>
      <View style={styles.readingGuide}>
        <Text style={styles.readingGuideText}>👆 Read along with the highlighted word!</Text>
      </View>
    </View>
  );
};

// Simple Icon Components
const ArrowLeftIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>←</Text>
);

const PlayIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>▶️</Text>
);

const PauseIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>⏸️</Text>
);

const RewindIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>⏪</Text>
);

const RepeatIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>🔁</Text>
);

const ShareIcon = ({ size = 24, color = '#000' }: { size?: number; color?: string }) => (
  <Text style={{ fontSize: size, color }}>📤</Text>
);

// Audio Control Button Component
const AudioControlButton = ({ 
  IconComponent, 
  iconName, 
  onClick, 
  isPlayButton = false, 
  isPlaying = false, 
  repeatMode = 'off', 
  isAudioLoading = false 
}: { 
  IconComponent?: any; 
  iconName?: string; 
  onClick: () => void; 
  isPlayButton?: boolean; 
  isPlaying?: boolean; 
  repeatMode?: 'off' | 'one' | 'all'; 
  isAudioLoading?: boolean; 
}) => {
  const secondaryActive = repeatMode !== 'off';
  
  const iconColor = (isPlayButton || secondaryActive) ? THEME.text.light : THEME.primary; 

  const secondaryStyle = [
    styles.controlButton,
    { backgroundColor: secondaryActive ? THEME.primary : 'rgba(255, 107, 157, 0.1)' }
  ];

  const primaryStyle = [
    styles.playButtonContainer,
    {
      backgroundColor: isPlaying ? THEME.success : THEME.primary,
      ...styles.playButtonShadow,
    }
  ];

  const getRepeatIcon = () => {
    if (repeatMode === 'off') return '🔁';
    if (repeatMode === 'one') return '🔂'; 
    if (repeatMode === 'all') return '🔄';
    return '🔁';
  };

  if (!isPlayButton) {
    if (iconName === 'repeat') {
      return (
        <BouncingButton onPress={onClick}>
          <View style={[styles.controlButton, secondaryActive && styles.controlButtonActive]}>
            <Text style={styles.emojiButtonText}>{getRepeatIcon()}</Text>
          </View>
        </BouncingButton>
      );
    }
    
    return (
      <BouncingButton onPress={onClick}>
        <View style={secondaryStyle}>
          {IconComponent && <IconComponent name={iconName} size={24} color={iconColor} />}
        </View>
      </BouncingButton>
    );
  }

  if (isAudioLoading) {
    return (
      <View style={styles.loadingButton}>
        <Text style={styles.loadingText}>✨</Text>
      </View>
    );
  }

  return (
    <BouncingButton onPress={onClick}>
      <View style={primaryStyle}>
        {isPlaying ? (
          <PauseIcon size={38} color={THEME.text.light} />
        ) : (
          <PlayIcon size={38} color={THEME.text.light} />
        )}
      </View>
    </BouncingButton>
  );
};

// --- MAIN SCREEN COMPONENT ---
export default function DuaDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const [viewMode, setViewMode] = useState<'Word by Word' | 'Complete Dua'>('Complete Dua');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Audio State
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const heartScaleAnim = useRef(new Animated.Value(1)).current;
  const playButtonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const celebrationAnim = useRef(new Animated.Value(0)).current;

  const duaId = params.id as string;
  const dua = enhancedDuaData[duaId] || {
    id: params.id,
    title: params.title || 'Praise and Glory 🌟',
    arabic: params.arabic || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    translation: params.translation || 'Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.',
    reference: params.reference || 'Sahih Muslim',
    category: 'Tasbeeh',
    difficulty: '🟢 Easy',
    sections: [{
      arabic: params.arabic || 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
      translation: params.translation || 'Glory be to Allah and all praise be to Him; Glory be to Allah, the Most Great.',
      reference: '[Sahih Muslim]',
      meaning: 'This beautiful prayer helps us remember how amazing Allah is!'
    }],
    relatedCategory: 'tasbeeh',
    funFact: '🌟 This dua is like giving Allah a big hug with your words!'
  };

  // Get local image for the dua
  const localImage = getLocalImage(dua.id, params.duaNumber as string);

  // Play button animation
  const animatePlayButton = () => {
    Animated.sequence([
      Animated.spring(playButtonScale, {
        toValue: 0.85,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(playButtonScale, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Celebration animation when completing a dua
  const triggerCelebration = () => {
    setShowCelebration(true);
    Animated.sequence([
      Animated.spring(celebrationAnim, {
        toValue: 1,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.spring(celebrationAnim, {
        toValue: 0,
        tension: 100,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start(() => setShowCelebration(false));
  };

  // Word-by-word progression (simulated)
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (viewMode === 'Word by Word' && isPlaying) {
      const words = dua.sections[0].arabic.split(' ');
      interval = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            clearInterval(interval);
            triggerCelebration();
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [viewMode, isPlaying, dua.sections[0].arabic]);

  // Pulsing animation for play button when playing
  useEffect(() => {
    if (isPlaying) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isPlaying]);

  useEffect(() => {
    // Entry animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // --- HANDLERS ---
  const handlePlayPause = async () => {
    if (isAudioLoading) return;
    
    Vibration.vibrate(30);
    animatePlayButton();
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsPlaying(!isPlaying);
  };

  const handleRepeatToggle = () => {
    const modes = ['off', 'one', 'all'] as const;
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
    Vibration.vibrate(20);
  };

  const handleFavorite = () => {
    Vibration.vibrate(30);
    setIsFavorite(!isFavorite);
    
    Animated.sequence([
      Animated.spring(heartScaleAnim, {
        toValue: 1.4,
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

  const handleModeChange = (mode: 'Word by Word' | 'Complete Dua') => {
    Vibration.vibrate(20);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewMode(mode);
    setCurrentWordIndex(0);
  };

  const handleShare = async () => {
    console.log('Share dua:', dua.title);
  };

  const currentDuaSection = dua.sections[0];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      
      {/* Background Particles */}
      <FloatingParticles />
      
      {/* Celebration Animation */}
      {showCelebration && (
        <Animated.View 
          style={[
            styles.celebrationContainer,
            {
              opacity: celebrationAnim,
              transform: [{ scale: celebrationAnim }]
            }
          ]}
        >
          <Text style={styles.celebrationText}>🎉 Masha'Allah! 🎉</Text>
          <Text style={styles.celebrationSubtext}>You completed the Dua!</Text>
        </Animated.View>
      )}

      {/* HEADER */}
      <Animated.View 
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}
      >
        <LinearGradient 
          colors={[THEME.header, '#fef9c3']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <BouncingButton onPress={() => router.back()}>
              <View style={styles.headerButton}>
                <ArrowLeftIcon size={28} color={THEME.text.dark} />
              </View>
            </BouncingButton>
            
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>{dua.title}</Text>
              <View style={styles.headerSubtitleContainer}>
                <Text style={styles.headerSubtitle}>{dua.category} • </Text>
                <Text style={styles.difficultyBadge}>{dua.difficulty}</Text>
              </View>
            </View>
            
            <BouncingButton onPress={handleFavorite}>
              <View style={styles.headerButton}>
                <Animated.View style={{ transform: [{ scale: heartScaleAnim }] }}>
                  <Text style={styles.favoriteEmoji}>{isFavorite ? '❤️' : '🤍'}</Text>
                </Animated.View>
              </View>
            </BouncingButton>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Content */}
      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroImageContainer}>
          <Image 
            source={localImage} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.heroOverlay}
          />
          
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{dua.title}</Text>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Learning Progress:</Text>
              <View style={styles.starsContainer}>
                <ProgressStar filled={true} />
                <ProgressStar filled={true} />
                <ProgressStar filled={false} />
                <ProgressStar filled={false} />
                <ProgressStar filled={false} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.contentPadding}>
          
          {/* Sleek Mode Toggle */}
          <View style={styles.sleekToggleWrapper}>
            <SleekModeToggle 
              viewMode={viewMode}
              onModeChange={handleModeChange}
            />
          </View>

          {/* Dua Content Card */}
          <View style={styles.duaCard}>
            {/* Arabic Text Display */}
            {viewMode === 'Word by Word' ? (
              <WordByWordDisplay 
                arabicText={currentDuaSection.arabic}
                currentWordIndex={currentWordIndex}
              />
            ) : (
              <View style={[styles.arabicTextContainer, { direction: 'rtl' }]}>
                <Text style={styles.arabicText}>
                  {currentDuaSection.arabic}
                </Text>
              </View>
            )}
            
            {/* Audio Controls */}
            <View style={styles.audioControls}>
              <AudioControlButton 
                IconComponent={RewindIcon} 
                iconName="replay-5" 
                onClick={() => console.log('Rewind')} 
              />
              <AudioControlButton 
                IconComponent={RepeatIcon}
                iconName="repeat" 
                onClick={handleRepeatToggle} 
                repeatMode={repeatMode}
              />
              <Animated.View style={{ 
                transform: [
                  { scale: playButtonScale },
                  { scale: isPlaying ? pulseAnim : 1 }
                ] 
              }}>
                <AudioControlButton 
                  onClick={handlePlayPause} 
                  isPlayButton={true} 
                  isPlaying={isPlaying}
                  isAudioLoading={isAudioLoading}
                />
              </Animated.View>
              <AudioControlButton 
                IconComponent={RewindIcon} 
                iconName="forward-5" 
                onClick={() => console.log('Forward')} 
              />
              <AudioControlButton 
                IconComponent={ShareIcon} 
                iconName="share-2" 
                onClick={handleShare} 
              />
            </View>

            {/* Kid-Friendly Info Sections */}
            <View style={styles.kidInfoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>📚 Translation</Text>
                <Text style={styles.infoText}>{currentDuaSection.translation}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>💡 What it Means</Text>
                <Text style={styles.infoText}>{currentDuaSection.meaning}</Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>🎯 Reference</Text>
                <Text style={styles.infoText}>{currentDuaSection.reference}</Text>
              </View>

              {dua.funFact && (
                <View style={[styles.infoBox, styles.funFactBox]}>
                  <Text style={styles.funFactTitle}>🌟 Fun Fact!</Text>
                  <Text style={styles.funFactText}>{dua.funFact}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Encouragement Section */}
          <View style={styles.encouragementSection}>
            <Text style={styles.encouragementTitle}>You're doing amazing! 🎨</Text>
            <Text style={styles.encouragementText}>
              Keep practicing and you'll be a Dua master in no time! 
              Remember, every time you say a Dua, angels smile 😇
            </Text>
          </View>
          
        </View>
      </ScrollView>

      {/* Kid-Friendly Footer */}
      <View style={styles.footer}>
        <BouncingButton onPress={() => router.back()}>
          <View style={styles.footerButton}>
            <Text style={styles.footerEmoji}>👈</Text>
            <Text style={styles.footerText}>Back</Text>
          </View>
        </BouncingButton>
        
        <BouncingButton onPress={() => console.log('Stars')}>
          <View style={styles.footerButton}>
            <Text style={styles.footerEmoji}>⭐</Text>
            <Text style={styles.footerText}>Stars</Text>
          </View>
        </BouncingButton>
        
        <BouncingButton onPress={() => router.push('/')}>
          <View style={styles.footerButton}>
            <Text style={styles.footerEmoji}>🏠</Text>
            <Text style={styles.footerText}>Home</Text>
          </View>
        </BouncingButton>
        
        <BouncingButton onPress={() => console.log('Games')}>
          <View style={styles.footerButton}>
            <Text style={styles.footerEmoji}>🎮</Text>
            <Text style={styles.footerText}>Games</Text>
          </View>
        </BouncingButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.tertiary,
  },
  header: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitleContainer: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.text.dark,
    textAlign: 'center',
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.text.dark,
    fontWeight: '500',
  },
  difficultyBadge: {
    fontSize: 12,
    color: THEME.text.dark,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: '600',
  },
  favoriteEmoji: {
    fontSize: 20,
  },
  mainContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  heroImageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: THEME.secondary,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    height: '60%',
    top: '40%',
  },
  heroContent: {
    padding: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.text.light,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 8,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 16,
  },
  progressText: {
    fontSize: 14,
    color: THEME.text.light,
    fontWeight: '600',
    marginRight: 12,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  contentPadding: {
    paddingHorizontal: 20,
  },
  // Sleek Toggle Styles
  sleekToggleWrapper: {
    marginTop: -20,
    zIndex: 10,
    paddingHorizontal: 8,
  },
  sleekToggleContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.neutral,
    borderRadius: 25,
    padding: 4,
    height: 48,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
    borderWidth: 2,
    borderColor: THEME.accent,
  },
  sleekToggleSlider: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    width: '50%',
    backgroundColor: THEME.primary,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  sleekToggleOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  sleekToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.text.secondary,
  },
  sleekToggleTextActive: {
    color: THEME.text.light,
  },
  duaCard: {
    backgroundColor: THEME.secondary,
    borderRadius: 24,
    padding: 24,
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 3,
    borderColor: THEME.accent,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  controlButton: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  controlButtonActive: {
    backgroundColor: THEME.primary,
  },
  emojiButtonText: {
    fontSize: 20,
  },
  playButtonContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  loadingButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 32,
  },
  arabicTextContainer: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 107, 157, 0.2)',
    paddingBottom: 20,
  },
  arabicText: {
    fontSize: 26,
    lineHeight: 48,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif', 
    color: THEME.text.primary,
    fontWeight: '600',
  },
  arabicWord: {
    fontWeight: '600',
  },
  highlightedWord: {
    backgroundColor: THEME.primary + '40',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    color: THEME.primary,
  },
  readingGuide: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(255, 209, 102, 0.2)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: THEME.accent,
  },
  readingGuideText: {
    fontSize: 14,
    color: THEME.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  kidInfoContainer: {
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: THEME.neutral,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: THEME.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: THEME.text.primary,
    lineHeight: 22,
  },
  funFactBox: {
    backgroundColor: 'rgba(255, 209, 102, 0.3)',
    borderLeftColor: THEME.accent,
  },
  funFactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B45309',
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 15,
    color: THEME.text.primary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  encouragementSection: {
    backgroundColor: THEME.neutral,
    padding: 24,
    borderRadius: 20,
    marginTop: 24,
    borderWidth: 3,
    borderColor: THEME.success,
    ...Platform.select({
      ios: {
        shadowColor: THEME.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  encouragementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.success,
    marginBottom: 8,
    textAlign: 'center',
  },
  encouragementText: {
    fontSize: 15,
    color: THEME.text.primary,
    lineHeight: 22,
    textAlign: 'center',
  },
  celebrationContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    backgroundColor: THEME.neutral,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    zIndex: 1000,
    borderWidth: 4,
    borderColor: THEME.accent,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  celebrationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  celebrationSubtext: {
    fontSize: 18,
    color: THEME.text.secondary,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: THEME.secondary,
    borderTopWidth: 3,
    borderTopColor: THEME.accent,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  footerButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  footerEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: THEME.text.primary,
    fontWeight: '600',
  },
});