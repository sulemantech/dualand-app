import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

const THEME = {
  primary: '#7E57C2',
  secondary: '#FFF7D0',
  tertiary: '#E8F4FF',
  neutral: '#FFFFFF',
  accent: '#FFD166',
  success: '#4ECDC4',
  header: '#fcf8b1',
  text: {
    primary: '#2D4A63',
    secondary: '#6B7B8C',
    light: '#FFFFFF',
    dark: '#4A5C6B',
    accent: '#E53E3E',
  }
};

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

export default function CategoryDuasScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Extract category data from params
  const {
    categoryId,
    categoryName = 'Morning Duas',
    duasData = '[]' // JSON string of duas array
  } = params;

  const [currentDuaIndex, setCurrentDuaIndex] = useState(0);
  const [duas, setDuas] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Animation values for swipe gestures
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const favoriteScale = useRef(new Animated.Value(1)).current;

  // Demo duas data
  const demoDuas = [
    {
      id: '1',
      arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
      reference: 'Surah Al-Fatihah 1:1',
      referenceArabic: 'سورة الفاتحة ١:١'
    },
    {
      id: '2', 
      arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
      translation: 'All praise is due to Allah, Lord of the worlds.',
      reference: 'Surah Al-Fatihah 1:2',
      referenceArabic: 'سورة الفاتحة ١:٢'
    },
    {
      id: '3',
      arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
      translation: 'The Most Gracious, the Most Merciful.',
      reference: 'Surah Al-Fatihah 1:3',
      referenceArabic: 'سورة الفاتحة ١:٣'
    }
  ];

  // Parse duas data from params or use demo data
  useEffect(() => {
    try {
      const parsedDuas = JSON.parse(duasData as string);
      setDuas(parsedDuas.length > 0 ? parsedDuas : demoDuas);
    } catch (error) {
      console.error('Error parsing duas data:', error);
      setDuas(demoDuas);
    }
  }, [duasData]);

  const currentDua = duas[currentDuaIndex] || {};
  const totalDuas = duas.length;

  // Simple swipe handler - FIXED VERSION
  const handleSwipe = (direction: 'left' | 'right') => {
    console.log(`Swipe ${direction} detected, navigating...`);
    
    if (direction === 'left') {
      navigateToDua('next');
    } else if (direction === 'right') {
      navigateToDua('prev');
    }
  };

  // Touch handler for simple swipe detection
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const onTouchStart = (e: any) => {
    touchStartX.current = e.nativeEvent.pageX;
    touchStartY.current = e.nativeEvent.pageY;
  };

  const onTouchEnd = (e: any) => {
    const touchEndX = e.nativeEvent.pageX;
    const touchEndY = e.nativeEvent.pageY;
    
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    // Only consider it a swipe if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - previous
        handleSwipe('right');
      } else {
        // Swipe left - next
        handleSwipe('left');
      }
    }
  };

  const navigateToDua = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? Math.min(currentDuaIndex + 1, totalDuas - 1)
      : Math.max(currentDuaIndex - 1, 0);

    if (newIndex !== currentDuaIndex) {
      Vibration.vibrate(30);
      
      // Animate swipe transition
      const swipeDirection = direction === 'next' ? -width : width;
      
      Animated.parallel([
        Animated.timing(swipeAnim, {
          toValue: swipeDirection,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start(() => {
        // Update index after animation
        setCurrentDuaIndex(newIndex);
        
        // Reset animations for next swipe
        resetSwipeAnimation();
      });
    } else {
      // Can't navigate further, reset animation
      resetSwipeAnimation();
    }
  };

  const resetSwipeAnimation = () => {
    Animated.parallel([
      Animated.spring(swipeAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
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

  const handleBack = () => {
    router.back();
  };

  const progressPercentage = totalDuas > 0 ? ((currentDuaIndex + 1) / totalDuas) * 100 : 0;

  // Swipe hint animation
  const swipeHintAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Show swipe hint on first load
    const timer = setTimeout(() => {
      Animated.sequence([
        Animated.timing(swipeHintAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(swipeHintAnim, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const swipeHintOpacity = swipeHintAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const swipeHintTranslateX = swipeHintAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 0]
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.header} />

      {/* Header */}
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
              <Text style={styles.headerTitle} numberOfLines={1}>
                {categoryName as string}
              </Text>
              <Text style={styles.headerSubtitle}>
                Dua {currentDuaIndex + 1} of {totalDuas}
              </Text>
            </View>

            <Animated.View style={{ transform: [{ scale: favoriteScale }] }}>
              <BouncingButton 
                style={styles.headerButton}
                onPress={handleFavorite}
              >
                <View style={styles.iconButton}>
                  <Text style={styles.headerButtonText}>
                    {isFavorite ? '❤️' : '🤍'}
                  </Text>
                </View>
              </BouncingButton>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Progress: {currentDuaIndex + 1}/{totalDuas}
          </Text>
          <Text style={styles.progressPercentage}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${progressPercentage}%` }
            ]} 
          />
        </View>
      </View>

      {/* Swipe Hint */}
      <Animated.View 
        style={[
          styles.swipeHint,
          {
            opacity: swipeHintOpacity,
            transform: [{ translateX: swipeHintTranslateX }]
          }
        ]}
      >
        <Text style={styles.swipeHintText}>
          👆 Swipe left or right to navigate
        </Text>
      </Animated.View>

      {/* SIMPLE TOUCH-BASED SWIPE CONTAINER */}
      <View 
        style={styles.swipeContainer}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Animated.View 
          style={[
            styles.animatedContent,
            {
              transform: [{ translateX: swipeAnim }],
              opacity: fadeAnim
            }
          ]}
        >
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Dua Arabic Text */}
            <View style={styles.duaSection}>
              <Text style={styles.sectionLabel}>Dua</Text>
              <View style={styles.arabicContainer}>
                <Text style={styles.arabicText} dir="rtl">
                  {currentDua.arabic || 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
                </Text>
              </View>
            </View>

            {/* Translation */}
            <View style={styles.duaSection}>
              <Text style={styles.sectionLabel}>Translation</Text>
              <View style={styles.translationContainer}>
                <Text style={styles.translationText}>
                  {currentDua.translation || "In the name of Allah, the Most Gracious, the Most Merciful."}
                </Text>
              </View>
            </View>

            {/* Reference - English */}
            {currentDua.reference && (
              <View style={styles.duaSection}>
                <Text style={styles.sectionLabel}>Reference (English)</Text>
                <View style={styles.referenceContainer}>
                  <Text style={styles.referenceText}>
                    {currentDua.reference}
                  </Text>
                </View>
              </View>
            )}

            {/* Reference - Arabic */}
            {currentDua.referenceArabic && (
              <View style={styles.duaSection}>
                <Text style={styles.sectionLabel}>Reference (Arabic)</Text>
                <View style={styles.referenceContainer}>
                  <Text style={styles.referenceArabicText} dir="rtl">
                    {currentDua.referenceArabic}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.bottomPadding} />
          </ScrollView>
        </Animated.View>
      </View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        <BouncingButton 
          style={[
            styles.navButton,
            currentDuaIndex === 0 && styles.navButtonDisabled
          ]}
          onPress={() => navigateToDua('prev')}
        >
          <View style={styles.navButtonInner}>
            <Text style={styles.navButtonEmoji}>⬅️</Text>
            <Text style={styles.navButtonText}>Previous</Text>
          </View>
        </BouncingButton>

        <BouncingButton 
          style={[
            styles.navButton,
            styles.nextButton,
            currentDuaIndex === totalDuas - 1 && styles.navButtonDisabled
          ]}
          onPress={() => navigateToDua('next')}
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
    paddingBottom: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFEAA7',
    shadowColor: '#D4B300',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#FFD93D',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  headerButtonText: {
    fontSize: 18,
    color: '#8B7500',
    fontWeight: 'bold',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.dark,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: THEME.text.primary,
    marginTop: 2,
    textAlign: 'center',
  },
  // Progress Bar
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: THEME.neutral,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.success,
    borderRadius: 3,
  },
  // Swipe Hint
  swipeHint: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  swipeHintText: {
    backgroundColor: 'rgba(126, 87, 194, 0.9)',
    color: THEME.text.light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '600',
    overflow: 'hidden',
  },
  // SWIPE CONTAINER
  swipeContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  animatedContent: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Dua Sections
  duaSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    marginBottom: 8,
    paddingLeft: 4,
  },
  arabicContainer: {
    backgroundColor: THEME.neutral,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  arabicText: {
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'right',
    color: THEME.text.primary,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
  },
  translationContainer: {
    backgroundColor: THEME.neutral,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  translationText: {
    fontSize: 16,
    lineHeight: 24,
    color: THEME.text.primary,
    textAlign: 'left',
  },
  referenceContainer: {
    backgroundColor: THEME.neutral,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  referenceText: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME.text.secondary,
    fontStyle: 'italic',
    textAlign: 'left',
  },
  referenceArabicText: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME.text.secondary,
    fontStyle: 'italic',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
  },
  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 120,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    opacity: 1,
  },
  navButtonDisabled: {
    backgroundColor: '#CBD5E1',
    shadowColor: '#CBD5E1',
    opacity: 0.6,
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
    marginHorizontal: 6,
  },
  navButtonText: {
    color: THEME.text.light,
    fontWeight: 'bold',
    fontSize: 14,
  },
  bottomPadding: {
    height: 20,
  },
});