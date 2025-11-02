import React, { useState, useMemo, useRef } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { SearchIcon } from '../../Icons';
import { duaData } from '../../types/types';

const { width, height } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - 40 - CARD_MARGIN) / 2;

export default function DashboardScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Animation values
  const searchSlideAnim = useRef(new Animated.Value(0)).current;
  const searchScaleAnim = useRef(new Animated.Value(0)).current;

  // Filter duas based on search query
  const filteredDuas = useMemo(() => {
    if (!searchQuery.trim()) {
      return duaData;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return duaData.filter(dua =>
      dua.title.toLowerCase().includes(query) ||
      dua.translation.toLowerCase().includes(query) ||
      dua.arabic.includes(query)
    );
  }, [searchQuery]);

  const handleDuaPress = (dua: any) => {
    Keyboard.dismiss();
    
    // Navigate to dua detail screen
    router.push({
      pathname: '/dua-detail',
      params: { 
        id: dua.id.toString(),
        title: dua.title,
        arabic: dua.arabic,
        translation: dua.translation,
        reference: dua.reference,
        imageUrl: dua.imageUrl
      }
    });
  };

  const toggleSearch = () => {
    if (isSearchExpanded) {
      // Collapse search
      Animated.parallel([
        Animated.timing(searchSlideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(searchScaleAnim, {
          toValue: 0,
          duration: 300,
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
        Animated.timing(searchSlideAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(searchScaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Animated DuaCard component
  const DuaCard = ({ dua, index }: { dua: any; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.sequence([
        Animated.delay(index * 100),
        Animated.timing(cardAnim, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
            { scale: cardAnim },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleDuaPress(dua)}
          activeOpacity={0.8}
        >
          <View style={styles.cardImageContainer}>
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>{dua.id.toString().padStart(2, '0')}</Text>
            </View>
            <Image 
              source={{ uri: dua.imageUrl }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
            {/* Floating Stars - FIXED: Emojis in Text components */}
            <View style={styles.floatingStars}>
              <Text style={styles.star}>✨</Text>
              <Text style={[styles.star, styles.star2]}>⭐</Text>
            </View>
          </View>
          
          <View style={styles.cardBanner}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {dua.title}
            </Text>
            {/* Card Sparkle - FIXED: Emoji in Text component */}
            <View style={styles.cardSparkle}>
              <Text style={styles.sparkleText}>🌟</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const searchHeight = searchSlideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });

  const searchOpacity = searchScaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (isSearchExpanded) {
        toggleSearch();
      } else {
        Keyboard.dismiss();
      }
    }} accessible={false}>
      <SafeAreaView style={styles.container}>
        {/* Header with Integrated Search */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://i.ibb.co/L5wK60b/dualand-logo.png' }}
              style={styles.logo}
            />
            <Text style={styles.title}>DUALAND</Text>
          </View>
          
          {/* Search Toggle Button */}
          <TouchableOpacity 
            style={styles.searchToggleButton}
            onPress={toggleSearch}
          >
            <SearchIcon size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Animated Search Bar */}
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              height: searchHeight,
              opacity: searchOpacity,
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
              autoFocus={isSearchExpanded}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Section with Animation - FIXED: Emojis in Text components */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeEmoji}>🎉</Text>
            <Text style={styles.welcomeText}>
              {searchQuery ? `Found ${filteredDuas.length} Duas! ` : 'Welcome to DuaLand! '}
              <Text style={styles.emojiText}>{searchQuery ? '🎯' : '🌟'}</Text>
            </Text>
            <Text style={styles.subtitle}>
              {searchQuery ? 'Your search results' : 'Learn beautiful prayers with fun! '}
              <Text style={styles.emojiText}>{searchQuery ? '' : '📚'}</Text>
            </Text>
          </View>

          {/* No Results State - FIXED: Emojis in Text components */}
          {filteredDuas.length === 0 && searchQuery && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsEmoji}>🔍</Text>
              <Text style={styles.noResultsText}>No Duas found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>
                Try different words or explore all Duas! <Text style={styles.emojiText}>🌈</Text>
              </Text>
            </View>
          )}

          {/* Duas Grid */}
          {filteredDuas.length > 0 && (
            <View style={styles.gridContainer}>
              {filteredDuas.map((dua, index) => (
                <DuaCard key={dua.id} dua={dua} index={index} />
              ))}
            </View>
          )}

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Floating Action Button for Quick Actions - FIXED: Emojis in Text components */}
        {!isSearchExpanded && (
          <View style={styles.floatingActions}>
            <TouchableOpacity style={styles.floatingButton}>
              <Text style={styles.floatingEmoji}>🎵</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingButton}>
              <Text style={styles.floatingEmoji}>⭐</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  searchToggleButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
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
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
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
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  welcomeEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(139, 92, 246, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  emojiText: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
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
    paddingHorizontal: 20,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  cardImageContainer: {
    position: 'relative',
    height: 110,
  },
  cardNumber: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#8B5CF6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cardNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  star: {
    fontSize: 16,
    position: 'absolute',
  },
  star2: {
    top: 12,
    right: 4,
    fontSize: 12,
  },
  cardBanner: {
    backgroundColor: 'rgba(255, 245, 157, 0.3)',
    padding: 12,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'rgba(245, 158, 11, 0.3)',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
    lineHeight: 16,
    textShadowColor: 'rgba(139, 92, 246, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardSparkle: {
    position: 'absolute',
    top: -12,
    right: 8,
  },
  sparkleText: {
    fontSize: 16,
  },
  bottomPadding: {
    height: 30,
  },
  floatingActions: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
    gap: 12,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  floatingEmoji: {
    fontSize: 20,
  },
});