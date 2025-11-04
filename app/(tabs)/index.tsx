import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { SearchIcon } from '../../Icons';
import { databaseService, Category, Dua } from '../../lib/database/database';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - 40 - CARD_MARGIN) / 2;

// Import local images - moved outside component to prevent re-creation
const localImages = {
  dua_1: require('../../assets/images/dua_31.png'),
  dua_2: require('../../assets/images/dua_2.png'),
  dua_3: require('../../assets/images/dua_3.png'),
  dua_4: require('../../assets/images/dua_4.png'),
  dua_5: require('../../assets/images/dua_5.png'),
  dua_6: require('../../assets/images/dua_6.png'),
  dua_7: require('../../assets/images/dua_7.png'),
  dua_8: require('../../assets/images/dua_8.png'),
  dua_9: require('../../assets/images/dua_9.png'),
  dua_10: require('../../assets/images/dua_10.png'),
  dua_11: require('../../assets/images/dua_11.png'),
  dua_12: require('../../assets/images/dua_12.png'),
  dua_13: require('../../assets/images/dua_13.png'),
  dua_14: require('../../assets/images/dua_14.png'),
  dua_15: require('../../assets/images/dua_15.png'),
  dua_16: require('../../assets/images/dua_16.png'),
  dua_17: require('../../assets/images/dua_17.png'),
  dua_18: require('../../assets/images/dua_18.png'),
  dua_19: require('../../assets/images/dua_19.png'),
  dua_20: require('../../assets/images/dua_20.png'),
  dua_21: require('../../assets/images/dua_21.png'),
  dua_22: require('../../assets/images/dua_22.png'),
  dua_23: require('../../assets/images/dua_23.png'),
  dua_24: require('../../assets/images/dua_24.png'),
  dua_25: require('../../assets/images/dua_25.png'),
  dua_26: require('../../assets/images/dua_26.png'),
  dua_27: require('../../assets/images/dua_27.png'),
  dua_28: require('../../assets/images/dua_28.png'),
  dua_29: require('../../assets/images/dua_29.png'),
  dua_30: require('../../assets/images/dua_30.png'),
  dua_31: require('../../assets/images/dua_31.png'),
  dua_32: require('../../assets/images/dua_32.png'),
};

// Optimized Particle system - prevent constant re-creation
const FloatingParticles = React.memo(({ count = 6 }) => {
  const particles = useRef(
    Array.from({ length: count }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = particles.map((particle, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 1000),
          Animated.timing(particle, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 4000,
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

        return (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              left: Math.random() * width,
              top: height + 30,
              transform: [{ translateY }],
              opacity,
            }}
          >
            <Text style={{ fontSize: 16, color: '#8B5CF6' }}>
              {['✨', '⭐', '🌟'][index % 3]}
            </Text>
          </Animated.View>
        );
      })}
    </View>
  );
});

// Function to get local image for dua - moved outside component
const getLocalImage = (duaId: string, duaNumber?: string) => {
  // Try to get image by dua number first
  if (duaNumber) {
    const imageKey = `dua_${duaNumber}` as keyof typeof localImages;
    if (localImages[imageKey]) {
      return localImages[imageKey];
    }
  }
  
  // Fallback: use ID to cycle through available images
  const imageIndex = (parseInt(duaId) % 32) + 1;
  const fallbackImageKey = `dua_${imageIndex}` as keyof typeof localImages;
  return localImages[fallbackImageKey] || localImages.dua_1;
};

// Optimized DuaCard component
const DuaCard = React.memo(({ dua, index, onPress, categories }: { 
  dua: Dua; 
  index: number;
  onPress: (dua: Dua) => void;
  categories: Category[];
}) => {
  const cardAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animation - only run once
    const animation = Animated.sequence([
      Animated.delay(index * 60),
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [cardAnim, index]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const cardScale = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || '#8B5CF6';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  };

  const categoryColor = getCategoryColor(dua.category_id);
  const localImage = getLocalImage(dua.id, dua.duaNumber);

  return (
    <Animated.View
      style={{
        opacity: cardAnim,
        transform: [
          {
            translateY: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [40, 0],
            }),
          },
          { 
            scale: cardAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            })
          },
          { scale: cardScale },
        ],
      }}
    >
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(dua)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Animated.View style={styles.cardInner}>
          <View style={styles.cardImageContainer}>
            {/* Category color overlay */}
            <View style={[styles.cardOverlay, { backgroundColor: `${categoryColor}40` }]} />
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>
                {dua.duaNumber || dua.order_index.toString().padStart(2, '0')}
              </Text>
            </View>
            <Image 
              source={localImage} 
              style={styles.cardImage}
              resizeMode="cover"
            />
            
            {/* Favorite indicator */}
            {dua.is_favorited && (
              <View style={styles.favoriteIndicator}>
                <Text style={styles.favoriteText}>❤️</Text>
              </View>
            )}

            {/* Memorization status indicator */}
            {dua.memorization_status !== 'not_started' && (
              <View style={[
                styles.memorizationIndicator,
                { 
                  backgroundColor: dua.memorization_status === 'memorized' ? '#10B981' : 
                                 dua.memorization_status === 'learning' ? '#F59E0B' : '#6B7280'
                }
              ]}>
                <Text style={styles.memorizationText}>
                  {dua.memorization_status === 'memorized' ? '✓' : 
                   dua.memorization_status === 'learning' ? '~' : '•'}
                </Text>
              </View>
            )}

            {/* Floating Elements */}
            <View style={styles.floatingStars}>
              <Text style={styles.star}>✨</Text>
              <Text style={[styles.star, styles.star2]}>⭐</Text>
            </View>
          </View>
          
          {/* Card banner with category color */}
          <View style={[styles.cardBanner, { backgroundColor: `${categoryColor}20` }]}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {dua.title}
            </Text>
            <View style={styles.cardMeta}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {getCategoryName(dua.category_id)}
              </Text>
            </View>
            <View style={styles.cardSparkle}>
              <Text style={styles.sparkleText}>🌟</Text>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default function DashboardScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [duas, setDuas] = useState<Dua[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const searchOpacityAnim = useRef(new Animated.Value(0)).current;
  const searchScaleAnim = useRef(new Animated.Value(0)).current;

  // Cache data loading with ref to prevent re-loading
  const dataLoadedRef = useRef(false);

  // Load data from database - only once
  useEffect(() => {
    if (dataLoadedRef.current) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Starting database initialization...');
        await databaseService.init();
        
        console.log('Database initialized, loading data...');
        
        const [allDuas, allCategories] = await Promise.all([
          databaseService.getAllDuas(),
          databaseService.getAllCategories()
        ]);
        
        console.log(`Successfully loaded ${allDuas.length} duas and ${allCategories.length} categories`);
        
        setDuas(allDuas);
        setCategories(allCategories);
        dataLoadedRef.current = true;
        
      } catch (err) {
        console.error('Error in loadData:', err);
        setError('Failed to load duas. Please restart the app.');
        setDuas([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter duas based on search query - optimized with useMemo
  const filteredDuas = useMemo(() => {
    if (!searchQuery.trim()) {
      return duas;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return duas.filter(dua =>
      dua.title.toLowerCase().includes(query) ||
      dua.translation.toLowerCase().includes(query) ||
      dua.arabic_text.toLowerCase().includes(query) ||
      (dua.transliteration && dua.transliteration.toLowerCase().includes(query)) ||
      (dua.urdu && dua.urdu.toLowerCase().includes(query)) ||
      (dua.hinditranslation && dua.hinditranslation.toLowerCase().includes(query))
    );
  }, [searchQuery, duas]);

  const handleDuaPress = useCallback(async (dua: Dua) => {
    Keyboard.dismiss();
    
    try {
      // Get word audio pairs for this dua
      const wordAudioPairs = await databaseService.getWordAudioPairsByDua(dua.id);
      
      router.push({
        pathname: '/dua-detail',
        params: { 
          id: dua.id,
          title: dua.title,
          arabic: dua.arabic_text,
          translation: dua.translation,
          reference: dua.reference,
          transliteration: dua.transliteration || '',
          urdu: dua.urdu || '',
          hinditranslation: dua.hinditranslation || '',
          textheading: dua.textheading || '',
          steps: dua.steps || '',
          duaNumber: dua.duaNumber || '',
          audio_full: dua.audio_full || '',
          titleAudioResId: dua.titleAudioResId || '',
          wordAudioPairs: JSON.stringify(wordAudioPairs),
          useLocalImage: 'true',
          localImageIndex: (parseInt(dua.id) % 32) + 1
        }
      });
    } catch (error) {
      console.error('Error navigating to dua detail:', error);
      // Fallback navigation without word audio pairs
      router.push({
        pathname: '/dua-detail',
        params: { 
          id: dua.id,
          title: dua.title,
          arabic: dua.arabic_text,
          translation: dua.translation,
          reference: dua.reference,
          useLocalImage: 'true',
          localImageIndex: (parseInt(dua.id) % 32) + 1
        }
      });
    }
  }, [router]);

  const toggleSearch = useCallback(() => {
    if (isSearchExpanded) {
      // Collapse search
      Animated.parallel([
        Animated.timing(searchOpacityAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(searchScaleAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsSearchExpanded(false);
        setSearchQuery('');
        Keyboard.dismiss();
      });
    } else {
      // Expand search
      setIsSearchExpanded(true);
      Animated.parallel([
        Animated.timing(searchOpacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(searchScaleAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isSearchExpanded, searchOpacityAnim, searchScaleAnim]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Search animations
  const searchTransform = searchScaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text style={styles.loadingText}>Loading Beautiful Duas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            dataLoadedRef.current = false;
            setLoading(true);
            setError(null);
            loadData();
          }}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (isSearchExpanded) {
        toggleSearch();
      } else {
        Keyboard.dismiss();
      }
    }} accessible={false}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
        
        {/* Background Elements - removed useFocusEffect */}
        <FloatingParticles />
        
        {/* Header with simplified gradient */}
        <View style={styles.header}>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: 'https://i.ibb.co/L5wK60b/dualand-logo.png' }}
                  style={styles.logo}
                />
                <View>
                  <Text style={styles.title}>DUALAND</Text>
                  <Text style={styles.subtitle}>{filteredDuas.length} Beautiful Duas</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.searchToggleButton}
                onPress={toggleSearch}
              >
                <View style={styles.searchToggleInner}>
                  <SearchIcon size={22} color="#ffffff" />
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Search Bar */}
        {isSearchExpanded && (
          <Animated.View 
            style={[
              styles.searchContainer,
              {
                opacity: searchOpacityAnim,
                transform: [{ scale: searchTransform }],
              }
            ]}
          >
            <View style={styles.searchInputContainer}>
              <SearchIcon size={20} color="#8B5CF6" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search for beautiful Duas..."
                placeholderTextColor="#A78BFA"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                autoFocus={true}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        )}

        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            isSearchExpanded && { paddingTop: 12 }
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Minimal Welcome Section */}
          {!searchQuery && (
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>
                Discover {duas.length} Beautiful Duas 🌟
              </Text>
              <Text style={styles.welcomeSubtext}>
                From {categories.length} categories • Tap to explore
              </Text>
            </View>
          )}

          {/* No Results State */}
          {filteredDuas.length === 0 && searchQuery && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsEmoji}>🔍</Text>
              <Text style={styles.noResultsText}>No Duas found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>
                Try different words or explore all Duas! 🌈
              </Text>
            </View>
          )}

          {/* Duas Grid */}
          {filteredDuas.length > 0 && (
            <View style={styles.gridContainer}>
              {filteredDuas.map((dua, index) => (
                <DuaCard 
                  key={dua.id} 
                  dua={dua} 
                  index={index} 
                  onPress={handleDuaPress}
                  categories={categories}
                />
              ))}
            </View>
          )}

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

// Keep your existing styles...
const styles = StyleSheet.create({
  // ... your existing styles remain the same
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 20,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
    paddingBottom: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 2,
  },
  searchToggleButton: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchToggleInner: {
    padding: 12,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#7C3AED',
    fontWeight: '600',
    paddingVertical: 2,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noResultsEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noResultsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  cardInner: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  cardImageContainer: {
    position: 'relative',
    height: 100,
    overflow: 'hidden',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  cardNumber: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  cardNumberText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  favoriteText: {
    fontSize: 10,
  },
  memorizationIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  memorizationText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  floatingStars: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  star: {
    fontSize: 14,
    position: 'absolute',
  },
  star2: {
    top: 10,
    right: 4,
    fontSize: 12,
  },
  cardBanner: {
    padding: 12,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 4,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardSparkle: {
    position: 'absolute',
    top: -10,
    right: 8,
  },
  sparkleText: {
    fontSize: 14,
  },
  bottomPadding: {
    height: 20,
  },
});