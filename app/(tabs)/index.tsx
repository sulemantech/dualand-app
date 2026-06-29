import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchIcon } from '../../Icons';
import { AppHeader } from '../../components/ui/AppHeader';
import { BouncingButton } from '../../components/ui/BouncingButton';


// Import the new in-memory data structure
import {
  Category,
  getAllCategories,
  getDuasByCategory,
  getWordAudioPairsByDua
} from '../../lib/data/duas'; // Update this path as needed

const CARD_MARGIN = 12;

// Enhanced Kid-Friendly Theme with Better Contrast
const THEME = {
   primary: '#8B6BC9',    // Softer Purple
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

// Enhanced Floating Particles
const FloatingParticles = React.memo(({ count = 8 }) => {
  const { width, height } = useWindowDimensions();
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

// Fixed Image Source Function
const getImageSource = (imagePath: any, categoryId?: number, categoryName?: string) => {
  // Debug information
  if (categoryId) {
    console.log(`🖼️ Loading image for Category ${categoryId}: ${categoryName}`, {
      imagePath,
      imagePathType: typeof imagePath
    });
  }

  // Case 1: Direct require statement (number)
  if (typeof imagePath === 'number') {
    return imagePath;
  }

  // Case 2: String path that needs mapping
  if (typeof imagePath === 'string') {
    const imageMap = {
      'dua_1': require('../../assets/images/dua_1.png'),
      'dua_2': require('../../assets/images/dua_2.png'),
      'dua_3': require('../../assets/images/dua_3.png'),
      'dua_4': require('../../assets/images/dua_4.png'),
      'dua_5': require('../../assets/images/dua_5.png'),
      'dua_6': require('../../assets/images/dua_6.png'),
      'dua_7': require('../../assets/images/dua_7.png'),
      'dua_8': require('../../assets/images/dua_8.png'),
      'dua_9': require('../../assets/images/dua_9.png'),
      'dua_10': require('../../assets/images/dua_10.png'),
      'dua_11': require('../../assets/images/dua_11.png'),
      'dua_12': require('../../assets/images/dua_12.png'),
      'dua_13': require('../../assets/images/dua_13.png'),
      'dua_14': require('../../assets/images/dua_14.png'),
      'dua_15': require('../../assets/images/dua_15.png'),
      'dua_16': require('../../assets/images/dua_16.png'),
      'dua_17': require('../../assets/images/dua_17.png'),
      'dua_18': require('../../assets/images/dua_18.png'),
      'dua_19': require('../../assets/images/dua_19.png'),
      'dua_20': require('../../assets/images/dua_20.png'),
      'dua_21': require('../../assets/images/dua_21.png'),
      'dua_22': require('../../assets/images/dua_22.png'),
      'dua_23': require('../../assets/images/dua_23.png'),
      'dua_24': require('../../assets/images/dua_24.png'),
      'dua_25': require('../../assets/images/dua_25.png'),
      'dua_26': require('../../assets/images/dua_26.png'),
      'dua_27': require('../../assets/images/dua_27.png'),
      'dua_28': require('../../assets/images/dua_28.png'),
      'dua_29': require('../../assets/images/dua_29.png'),
      'dua_30': require('../../assets/images/dua_30.png'),
      'dua_31': require('../../assets/images/dua_31.png'),
      'dua_32': require('../../assets/images/dua_32.png'),
    };

    const imageName = imagePath.split('/').pop()?.replace('.png', '') || 'dua_1';
    const resolvedImage = imageMap[imageName as keyof typeof imageMap] || require('../../assets/images/dua_1.png');
    
    console.log(`📸 Mapped "${imageName}" to image:`, resolvedImage);
    return resolvedImage;
  }

  // Case 3: Fallback to category-based image
  if (categoryId) {
    const categoryBasedImages = {
      1: require('../../assets/images/dua_1.png'),
      2: require('../../assets/images/dua_2.png'),
      3: require('../../assets/images/dua_3.png'),
      4: require('../../assets/images/dua_4.png'),
      5: require('../../assets/images/dua_5.png'),
      6: require('../../assets/images/dua_6.png'),
      7: require('../../assets/images/dua_7.png'),
      8: require('../../assets/images/dua_8.png'),
      9: require('../../assets/images/dua_9.png'),
      10: require('../../assets/images/dua_10.png'),
      11: require('../../assets/images/dua_11.png'),
      12: require('../../assets/images/dua_14.png'),
      13: require('../../assets/images/dua_12.png'),
      14: require('../../assets/images/dua_13.png'),
      15: require('../../assets/images/dua_15.png'),
      16: require('../../assets/images/dua_16.png'),
      17: require('../../assets/images/dua_17.png'),
      18: require('../../assets/images/dua_18.png'),
      19: require('../../assets/images/dua_19.png'),
      20: require('../../assets/images/dua_20.png'),
      21: require('../../assets/images/dua_21.png'),
      22: require('../../assets/images/dua_22.png'),
      23: require('../../assets/images/dua_23.png'),
      24: require('../../assets/images/dua_24.png'),
      25: require('../../assets/images/dua_25.png'),
      26: require('../../assets/images/dua_26.png'),
      27: require('../../assets/images/dua_27.png'),
      28: require('../../assets/images/dua_28.png'),
      29: require('../../assets/images/dua_29.png'),
      30: require('../../assets/images/dua_30.png'),
      31: require('../../assets/images/dua_31.png'),
      32: require('../../assets/images/dua_32.png'),
    };

    const fallbackImage = categoryBasedImages[categoryId as keyof typeof categoryBasedImages] || require('../../assets/images/dua_1.png');
    console.log(`🎯 Using category-based fallback for ID ${categoryId}:`, fallbackImage);
    return fallbackImage;
  }

  console.log('🚨 Ultimate fallback to default image');
  return require('../../assets/images/dua_1.png');
};

// Bouncing Button Component
// const BouncingButton = ({ children, onPress, style = {} }) => {
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const handlePressIn = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 0.95,
//       tension: 100,
//       friction: 3,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scaleAnim, {
//       toValue: 1,
//       tension: 100,
//       friction: 3,
//       useNativeDriver: true,
//     }).start();
//   };

//   return (
//     <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//       <TouchableOpacity
//         onPressIn={handlePressIn}
//         onPressOut={handlePressOut}
//         onPress={onPress}
//         style={style}
//         activeOpacity={0.8}
//       >
//         {children}
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// Progress Star Component
const ProgressStar = ({ filled, size = 16 }) => (
  <Text style={{ fontSize: size, marginHorizontal: 1 }}>
    {filled ? '⭐' : '☆'}
  </Text>
);

// CategoryCard component - One card per category
const CategoryCard = React.memo(({ category, index, onPress, cardWidth, imageHeight }: {
  category: Category;
  index: number;
  onPress: (category: Category) => void;
  cardWidth: number;
  imageHeight: number;
}) => {
  const cardAnim = useRef(new Animated.Value(0)).current;
  const pressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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

  const categoryImageSource = getImageSource(category.image_path, category.id, category.name);

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
      <BouncingButton onPress={() => onPress(category)} style={[styles.card, { width: cardWidth }]}>
        <Animated.View style={styles.cardInner}>
          <View style={[styles.cardImageContainer, { height: imageHeight }]}>
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>
                {category.id.toString().padStart(2, '0')}
              </Text>
            </View>

            {/* Clean image without overlays */}
            <Image
              source={categoryImageSource}
              style={styles.cardImage}
              resizeMode="cover"
            />

            {/* Floating Elements */}
            <View style={styles.floatingStars}>
              <Text style={styles.star}>✨</Text>
              <Text style={[styles.star, styles.star2]}>⭐</Text>
            </View>
          </View>

          {/* Card banner with better text contrast */}
          <View style={[styles.cardBanner, { backgroundColor: '#ede77bff' }]}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {category.name}
            </Text>
            <View style={styles.cardSparkle}>
              <Text style={styles.sparkleText}>🌟</Text>
            </View>
          </View>
        </Animated.View>
      </BouncingButton>
    </Animated.View>
  );
});


export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const numColumns = width >= 600 ? 3 : 2;
  const cardWidth = (width - 32 - CARD_MARGIN * (numColumns - 1)) / numColumns;
  const cardImageHeight = width >= 600 ? 140 : 100;

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false); // No loading needed for in-memory data
  const [error, setError] = useState<string | null>(null);
  const searchOpacityAnim = useRef(new Animated.Value(0)).current;
  const searchScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load data from in-memory structure
    try {
      console.log('Loading categories from in-memory data...');
      const allCategories = getAllCategories();
      setCategories(allCategories);
      console.log(`Successfully loaded ${allCategories.length} categories`);
      
      // Debug: Log all categories with their image paths
      allCategories.forEach(category => {
        console.log(`📋 Category ${category.id}: ${category.name}`, {
          imagePath: category.image_path,
          type: typeof category.image_path
        });
      });
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load categories. Please restart the app.');
    }
  }, []);

  const filteredCategories = useMemo(() => {
    let result = categories;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = categories.filter(category =>
        category.name.toLowerCase().includes(query)
      );
    }

    // Sort by category ID in ascending order (1 to 32)
    return result.sort((a, b) => a.id - b.id);
  }, [searchQuery, categories]);

  const handleCategoryPress = useCallback((category: Category) => {
    Keyboard.dismiss();

    console.log('📋 Category pressed:', {
      id: category.id,
      name: category.name,
      image_path: category.image_path
    });

    try {
      // Get the first dua from this category using in-memory data
      const categoryDuas = getDuasByCategory(category.id);
      
      if (categoryDuas.length === 0) {
        console.error('❌ No duas found in category:', category.id);
        alert(`No duas found in ${category.name} category.`);
        return;
      }

      // Get the first dua in the category (lowest order_index)
      const firstDua = categoryDuas.sort((a, b) => a.order_index - b.order_index)[0];

      console.log('🎯 First dua in category:', {
        id: firstDua.id,
        title: firstDua.title,
        order_index: firstDua.order_index,
        image_path: firstDua.image_path
      });

      // Get word audio pairs for the dua using in-memory data
      const wordAudioPairs = getWordAudioPairsByDua(firstDua.id);

      // Get the dua image using image_path
      const duaImageSource = getImageSource(firstDua.image_path, category.id, category.name);

      // Prepare the params for dua-detail screen
      const navigationParams = {
        id: firstDua.id,
        title: firstDua.title || 'Dua',
        arabic: firstDua.arabic_text || 'Arabic text not available',
        translation: firstDua.translation || 'Translation not available',
        reference: firstDua.reference || 'Reference not available',
        textheading: firstDua.textheading || '',
        duaNumber: firstDua.duaNumber || firstDua.order_index?.toString() || '1',
        categoryName: category.name,
        useLocalImage: 'true',
        localImageIndex: ((parseInt(firstDua.id) || 1) % 32) + 1,
        imagePath: firstDua.image_path || category.image_path // Pass image path for reference
      };

      console.log('🚀 Navigating to dua-detail with params:', navigationParams);

      // Navigate to dua-detail screen
      router.push({
        pathname: '/dua-detail',
        params: navigationParams
      });

    } catch (error) {
      console.error('❌ Error navigating to dua detail:', error);
      alert('Error loading dua. Please try again.');
    }
  }, [router]);

  const toggleSearch = useCallback(() => {
    if (isSearchExpanded) {
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

  const searchTransform = searchScaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>😔</Text>
          <Text style={styles.errorText}>{error}</Text>
          <BouncingButton>
            <TouchableOpacity style={styles.retryButton} onPress={() => {
              setError(null);
              // Reload data
              try {
                const allCategories = getAllCategories();
                setCategories(allCategories);
              } catch (err) {
                setError('Failed to load data. Please restart the app.');
              }
            }}>
              <Text style={styles.retryButtonText}>Try Again 🔄</Text>
            </TouchableOpacity>
          </BouncingButton>
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
      <ScreenWrapper>
        <SafeAreaView style={styles.container} edges={['top']}>
          <FloatingParticles />

          <AppHeader
            icon="🕌"
            title="DuaLand"
            subtitle={`${filteredCategories.length} categories to explore`}
            rightElement={
              <BouncingButton onPress={toggleSearch}>
                <View style={styles.searchToggleInner}>
                  <SearchIcon size={20} color="#7E57C2" />
                </View>
              </BouncingButton>
            }
          />

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
                <SearchIcon size={20} color={THEME.primary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for categories... 🔍"
                  placeholderTextColor={THEME.text.secondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  autoFocus={true}
                />
                {searchQuery.length > 0 && (
                  <BouncingButton>
                    <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                      <Text style={styles.clearButtonText}>✕</Text>
                    </TouchableOpacity>
                  </BouncingButton>
                )}
              </View>
            </Animated.View>
          )}

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              isSearchExpanded && { paddingTop: 12 }
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {filteredCategories.length === 0 && searchQuery ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsEmoji}>🔍</Text>
                <Text style={styles.noResultsText}>No categories found for "{searchQuery}"</Text>
                <Text style={styles.noResultsSubtext}>
                  Try different words or explore all categories! 🌈
                </Text>
              </View>
            ) : (
              <View style={styles.gridContainer}>
                {filteredCategories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                    onPress={handleCategoryPress}
                    cardWidth={cardWidth}
                    imageHeight={cardImageHeight}
                  />
                ))}
              </View>
            )}

            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </ScreenWrapper>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.tertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.tertiary,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.tertiary,
    paddingHorizontal: 20,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: THEME.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
  searchToggleInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: THEME.neutral,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${THEME.primary}10`,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: THEME.primary,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: THEME.text.primary,
    fontWeight: '600',
    paddingVertical: 2,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
    backgroundColor: `${THEME.primary}20`,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: THEME.primary,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
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
    color: THEME.text.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: THEME.text.primary,
    textAlign: 'center',
    fontWeight: '500',
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
    color: THEME.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 16,
    color: THEME.text.primary,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  // Category Card Styles
  card: {
    marginBottom: 16,
  },
  cardInner: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: THEME.secondary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: THEME.accent,
  },
  cardImageContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  cardNumber: {
    position: 'absolute',
    top: 1,
    left: 1,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  cardNumber: {
    position: 'absolute',
    top: 1,
    left: 1,
    backgroundColor: '#8B6BC9',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
    // Rounded square with slight angle
    borderRadius: 6,
    transform: [{ rotate: '-5deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  cardNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    transform: [{ rotate: '5deg' }],
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.primary,
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