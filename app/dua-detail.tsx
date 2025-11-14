import React, { useState, useRef, useEffect } from 'react';
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
  StatusBar,
  Dimensions,
  Vibration,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

// Updated Theme to match your index screen
const THEME = {
  primary: '#7E57C2',      // Softer Purple
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

// Import local images from your assets - using the same ones from your index
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
const getLocalImage = (duaId: string, duaNumber?: string, localImageIndex?: string) => {
  // First try to use the specific localImageIndex from params
  if (localImageIndex) {
    const imageKey = `dua_${localImageIndex}` as keyof typeof localImages;
    if (localImages[imageKey]) {
      return localImages[imageKey];
    }
  }
  
  // Then try duaNumber
  if (duaNumber) {
    const imageKey = `dua_${duaNumber}` as keyof typeof localImages;
    if (localImages[imageKey]) {
      return localImages[imageKey];
    }
  }
  
  // Fallback to modulo of duaId
  const imageIndex = (parseInt(duaId) % 32) + 1;
  const fallbackImageKey = `dua_${imageIndex}` as keyof typeof localImages;
  return localImages[fallbackImageKey] || localImages.dua_1;
};

// Floating Particles Component
const FloatingParticles = React.memo(({ count = 8 }) => {
  const particles = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 800),
          Animated.timing(particle, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 5000,
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
        const translateY = particle.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -height],
        });

        const opacity = particle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.6, 0],
        });

        const scale = particle.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.8, 1, 0.8],
        });

        return (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              left: Math.random() * width,
              top: height + 30,
              transform: [{ translateY }, { scale }],
              opacity,
            }}
          >
            <Text style={{
              fontSize: 16,
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

// Bouncing Button Component
const BouncingButton = ({ children, onPress, style = {} }: { 
  children: any; 
  onPress?: () => void;
  style?: any; 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
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
        disabled={!onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Word Highlight Component for Word-by-Word Mode
const WordByWordDisplay = ({ 
  arabicText, 
  currentWordIndex, 
  isPlaying 
}: { 
  arabicText: string; 
  currentWordIndex: number; 
  isPlaying: boolean;
}) => {
  const words = arabicText.split(' ');
  const wordAnimations = useRef(words.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    if (isPlaying && currentWordIndex < words.length) {
      // Reset previous word
      if (currentWordIndex > 0) {
        Animated.timing(wordAnimations[currentWordIndex - 1], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      // Highlight current word with animation
      Animated.sequence([
        Animated.timing(wordAnimations[currentWordIndex], {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(wordAnimations[currentWordIndex], {
          toValue: 0.8,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentWordIndex, isPlaying]);

  return (
    <View style={styles.wordByWordContainer}>
      <View style={styles.arabicTextContainer}>
        <Text style={styles.arabicText} dir="rtl">
          {words.map((word, index) => {
            const scale = wordAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            });

            const backgroundColor = wordAnimations[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', THEME.primary + '40'],
            });

            return (
              <Animated.Text
                key={index}
                style={[
                  styles.arabicWord,
                  {
                    transform: [{ scale }],
                    backgroundColor,
                  },
                  index === currentWordIndex && styles.currentWord,
                ]}
              >
                {word}{' '}
              </Animated.Text>
            );
          })}
        </Text>
      </View>
      
      {isPlaying && (
        <View style={styles.readingGuide}>
          <Text style={styles.readingGuideText}>
            👆 Listening to word {currentWordIndex + 1} of {words.length}
          </Text>
        </View>
      )}
    </View>
  );
};

// Masha Allah Celebration Popup Component
const MashaAllahCelebration = ({ visible, onHide }: { visible: boolean; onHide: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Vibration.vibrate(300);
      
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        ])
      ]).start(() => {
        onHide();
      });

      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.celebrationContainer,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
      pointerEvents="none"
    >
      <LinearGradient
        colors={[THEME.accent, THEME.primary]}
        style={styles.celebrationGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.celebrationText}>🎉 Masha'Allah! 🎉</Text>
        <Text style={styles.celebrationSubtext}>You completed the Dua!</Text>
        <View style={styles.celebrationStars}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>🌟</Text>
          <Text style={styles.star}>✨</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

export default function DuaDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract dynamic data from route params
  const {
    id,
    title = 'Dua for Anxiety',
    arabic,
    translation,
    reference,
    transliteration,
    urdu,
    hinditranslation,
    textheading,
    steps,
    duaNumber,
    audio_full,
    titleAudioResId,
    wordAudioPairs,
    useLocalImage,
    localImageIndex
  } = params;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMode, setCurrentMode] = useState<'full' | 'word'>('word');
  const [currentDuaIndex, setCurrentDuaIndex] = useState(parseInt(duaNumber as string) || 1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const totalDuas = 15;

  const playButtonScale = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const favoriteScale = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(0.9)).current;

  // Use the dynamic Arabic text from params or fallback
  const duaArabic = arabic as string || "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ، وَقَهْرِ الرِّجَالِ";
  const words = duaArabic.split(' ');

  // Get illustration image dynamically based on incoming params
  const illustrationImage = getLocalImage(
    id as string, 
    duaNumber as string, 
    localImageIndex as string
  );

  useEffect(() => {
    // Animate image when dua changes
    Animated.sequence([
      Animated.timing(imageScale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(imageScale, {
        toValue: 1,
        duration: 300,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentDuaIndex]);

  const handlePlayPause = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
    if (!isPlaying) {
      // Start playing
      setIsPlaying(true);
      setCurrentWordIndex(0);
    } else {
      // Stop playing
      setIsPlaying(false);
    }

    // Play button animation
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

  const handleFavorite = () => {
    Vibration.vibrate(50);
    setIsFavorite(!isFavorite);
    
    Animated.sequence([
      Animated.spring(favoriteScale, {
        toValue: 1.3,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(favoriteScale, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleRestart = () => {
    Vibration.vibrate(30);
    setIsPlaying(false);
    setCurrentWordIndex(0);
  };

  // Word-by-word progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentMode === 'word') {
      interval = setInterval(() => {
        setCurrentWordIndex(prev => {
          if (prev >= words.length - 1) {
            // Reached the end
            clearInterval(interval);
            setIsPlaying(false);
            setShowCelebration(true);
            return 0;
          }
          return prev + 1;
        });
      }, 1500); // 1.5 seconds per word for kids to follow
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentMode, words.length]);

  const navigateDua = (direction: 'prev' | 'next') => {
    if (direction === 'next' && currentDuaIndex < totalDuas) {
      setCurrentDuaIndex(currentDuaIndex + 1);
      setShowCelebration(true);
    } else if (direction === 'prev' && currentDuaIndex > 1) {
      setCurrentDuaIndex(currentDuaIndex - 1);
    }
    setIsPlaying(false);
    setCurrentWordIndex(0);
  };

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

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.header} />
      
      <FloatingParticles />

      {/* Masha Allah Celebration Popup */}
      <MashaAllahCelebration 
        visible={showCelebration} 
        onHide={() => setShowCelebration(false)} 
      />

      {/* Header - With Better Matching Colors */}
      <View style={styles.header}>
        <LinearGradient
          colors={[THEME.header, '#fef9c3']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <BouncingButton 
              style={styles.headerButton}
              onPress={handleBack}
            >
              <View style={styles.iconButton}>
                <Text style={styles.headerButtonText}>←</Text>
              </View>
            </BouncingButton>

            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{title as string}</Text>
              <Text style={styles.headerSubtitle}>Dua {currentDuaIndex} of {totalDuas}</Text>
            </View>

            <BouncingButton 
              style={styles.headerButton}
              onPress={() => console.log('Share pressed')}
            >
              <View style={styles.iconButton}>
                <Text style={styles.headerButtonText}>📤</Text>
              </View>
            </BouncingButton>
          </View>
        </LinearGradient>
      </View>

      {/* Main Content */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Illustration Image */}
        <Animated.View 
          style={[
            styles.illustrationContainer,
            { 
              transform: [{ scale: imageScale }],
            }
          ]}
        >
          <Image
            source={illustrationImage}
            style={styles.illustration}
            resizeMode="cover"
          />
          
          {/* FAVORITE BUTTON - MOVED HERE from footer */}
          <Animated.View 
            style={[
              styles.favoriteButtonContainer,
              { transform: [{ scale: favoriteScale }] }
            ]}
          >
            <BouncingButton onPress={handleFavorite}>
              <LinearGradient
                colors={isFavorite ? ['#FF6B6B', '#FF8E8E'] : ['#FFFFFF', '#F8F9FA']}
                style={styles.favoriteButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={[
                  styles.favoriteButtonEmoji,
                  isFavorite && styles.favoriteButtonEmojiActive
                ]}>
                  {isFavorite ? '❤️' : '🤍'}
                </Text>
              </LinearGradient>
            </BouncingButton>
          </Animated.View>
        </Animated.View>

        {/* Mode Selection */}
        <View style={styles.modeContainer}>
          <View style={styles.modePills}>
            <TouchableOpacity
              style={[
                styles.modePill,
                currentMode === 'word' && styles.modePillActive
              ]}
              onPress={() => {
                setCurrentMode('word');
                setIsPlaying(false);
                setCurrentWordIndex(0);
              }}
            >
              <Text style={[
                styles.modePillText,
                currentMode === 'word' && styles.modePillTextActive
              ]}>
                🎯 Word by Word
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modePill,
                currentMode === 'full' && styles.modePillActive
              ]}
              onPress={() => {
                setCurrentMode('full');
                setIsPlaying(false);
              }}
            >
              <Text style={[
                styles.modePillText,
                currentMode === 'full' && styles.modePillTextActive
              ]}>
                📖 Full Dua
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dua Text */}
        <View style={styles.duaTextContainer}>
          {currentMode === 'word' ? (
            <WordByWordDisplay 
              arabicText={duaArabic}
              currentWordIndex={currentWordIndex}
              isPlaying={isPlaying}
            />
          ) : (
            <View style={styles.fullDuaContainer}>
              <Text style={styles.arabicText} dir="rtl">
                {duaArabic}
              </Text>
              <View style={styles.fullDuaHint}>
                <Text style={styles.hintText}>Tap play to listen to the full dua 🔊</Text>
              </View>
            </View>
          )}
        </View>

        {/* Progress Indicator */}
        {isPlaying && currentMode === 'word' && (
          <View style={styles.wordProgress}>
            <Text style={styles.wordProgressText}>
              Word {currentWordIndex + 1} of {words.length}
            </Text>
            <View style={styles.wordProgressBar}>
              <View 
                style={[
                  styles.wordProgressFill,
                  { width: `${((currentWordIndex + 1) / words.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}

        {/* Translation & Meaning */}
        <View style={styles.infoContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>📖 Translation</Text>
            <Text style={styles.infoText}>
              {translation as string || "Translation not available"}
            </Text>
          </View>

          {reference && (
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>📚 Reference</Text>
              <Text style={styles.infoText}>{reference as string}</Text>
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>💡 Meaning for Kids</Text>
            <Text style={styles.infoText}>
              This special prayer asks Allah to protect us from worries, sadness, and feeling too tired to do good things. It's like a superhero shield for your heart! 🛡️
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>🌟 Fun Fact</Text>
            <Text style={styles.infoText}>
              Prophet Muhammad (PBUH) taught this dua to help us feel brave and strong when we're worried or sad!
            </Text>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* CLEANED UP FOOTER - No more favorite button */}
      <View style={styles.footer}>
        {/* Previous Button */}
        <BouncingButton 
          style={styles.navButton}
          onPress={() => navigateDua('prev')}
        >
          <View style={styles.navButtonInner}>
            <Text style={styles.navButtonEmoji}>⬅️</Text>
            <Text style={styles.navButtonText}>Prev</Text>
          </View>
        </BouncingButton>

        {/* Main Controls - Only Repeat and Play/Pause */}
        <View style={styles.mainControls}>
          {/* Restart Button */}
          <BouncingButton 
            style={styles.controlButton}
            onPress={handleRestart}
          >
            <View style={styles.controlButtonInner}>
              <Text style={styles.controlButtonEmoji}>🔄</Text>
            </View>
          </BouncingButton>

          {/* Main Play/Pause Button */}
          <Animated.View style={{ 
            transform: [
              { scale: playButtonScale },
              { scale: isPlaying ? pulseAnim : 1 }
            ] 
          }}>
            <BouncingButton 
              style={styles.playButton}
              onPress={handlePlayPause}
            >
              <View style={styles.playButtonInner}>
                <Text style={styles.playButtonEmoji}>
                  {isPlaying ? '⏸️' : '▶️'}
                </Text>
              </View>
            </BouncingButton>
          </Animated.View>
        </View>

        {/* Next Button */}
        <BouncingButton 
          style={[styles.navButton, styles.nextButton]}
          onPress={() => navigateDua('next')}
        >
          <View style={styles.navButtonInner}>
            <Text style={styles.navButtonText}>Next</Text>
            <Text style={styles.navButtonEmoji}>➡️</Text>
          </View>
        </BouncingButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.tertiary,
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  // UPDATED: Header buttons with colors that match the header background
  headerButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFEAA7', // Soft yellow that matches header
    shadowColor: '#D4B300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFD93D', // Golden border
  },
  iconButton: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // UPDATED: Header button text color
  headerButtonText: {
    fontSize: 18,
    color: '#8B7500', // Dark golden text for better contrast on yellow
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.dark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.text.primary,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // UPDATED: Illustration Container with favorite button
  illustrationContainer: {
    width: '100%',
    height: 250,
    overflow: 'hidden',
    backgroundColor: THEME.tertiary,
    position: 'relative', // For absolute positioning of favorite button
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  // NEW: Favorite button positioned on top of illustration
  favoriteButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: THEME.accent,
  },
  favoriteButtonEmoji: {
    fontSize: 22,
  },
  favoriteButtonEmojiActive: {
    fontSize: 24,
  },
  // Mode Selection
  modeContainer: {
    marginTop: 0,
    marginHorizontal: 10,
    zIndex: 10,
  },
  modePills: {
    flexDirection: 'row',
    backgroundColor: THEME.neutral,
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  modePillText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.text.secondary,
  },
  modePillTextActive: {
    color: THEME.text.light,
  },
  // Dua Text
  duaTextContainer: {
    margin: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  wordByWordContainer: {
     minHeight: 50,
    justifyContent: 'center',
  },
  arabicTextContainer: {
    backgroundColor: THEME.neutral,
    borderRadius: 20,
    padding: 18,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 48,
    textAlign: 'right',
    color: THEME.text.primary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
  },
  arabicWord: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  currentWord: {
    fontWeight: 'bold',
  },
  readingGuide: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${THEME.accent}20`,
    borderRadius: 12,
    alignItems: 'center',
  },
  readingGuideText: {
    fontSize: 14,
    color: THEME.text.primary,
    fontWeight: '600',
  },
  fullDuaContainer: {
    minHeight: 50,
    justifyContent: 'center',
  },
  fullDuaHint: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${THEME.success}20`,
    borderRadius: 12,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 14,
    color: THEME.success,
    fontWeight: '600',
  },
  // Progress
  wordProgress: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  wordProgressText: {
    fontSize: 14,
    color: THEME.text.secondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  wordProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  wordProgressFill: {
    height: '100%',
    backgroundColor: THEME.success,
    borderRadius: 3,
  },
  // Info Sections
  infoContainer: {
    margin: 16,
    gap: 12,
  },
  infoSection: {
    backgroundColor: THEME.neutral,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: THEME.text.primary,
    lineHeight: 20,
  },
  // CLEANED UP FOOTER - More space between buttons
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16, // Increased padding
    backgroundColor: THEME.neutral,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 20, // Increased padding
    paddingVertical: 14, // Increased padding
    borderRadius: 20,
    minWidth: 90, // Increased minimum width
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nextButton: {
    backgroundColor: THEME.accent,
    shadowColor: THEME.accent,
  },
  navButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonEmoji: {
    fontSize: 16,
    marginHorizontal: 6, // Increased spacing
  },
  navButtonText: {
    color: THEME.text.light,
    fontWeight: 'bold',
    fontSize: 14,
  },
  // Main Controls Container - More spacing
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20, // Increased gap
  },
  controlButton: {
    backgroundColor: THEME.neutral,
    padding: 14, // Increased padding
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: THEME.primary + '20',
  },
  controlButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonEmoji: {
    fontSize: 22, // Slightly larger
  },
  playButton: {
    backgroundColor: THEME.primary,
    padding: 20, // Increased padding
    borderRadius: 30,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: THEME.accent,
  },
  playButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  playButtonEmoji: {
    fontSize: 28,
  },
  // Celebration Popup
  celebrationContainer: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    right: '10%',
    zIndex: 1000,
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
  celebrationGradient: {
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: THEME.accent,
  },
  celebrationText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: THEME.text.light,
    marginBottom: 8,
    textAlign: 'center',
  },
  celebrationSubtext: {
    fontSize: 18,
    color: THEME.text.light,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
  },
  celebrationStars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    fontSize: 24,
    marginHorizontal: 8,
  },
  bottomPadding: {
    height: 20,
  },
});