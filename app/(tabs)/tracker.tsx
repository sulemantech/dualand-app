import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dua, getAllDuas, getCategoryById } from '../../lib/data/duas';

const { width, height } = Dimensions.get('window');

// Enhanced Kid-Friendly Theme with Better Colors for Kids
const THEME = {
  primary: '#7E57C2',      // Vibrant Purple - Fun and energetic
  secondary: '#FFF7D0',    // Bright Lemon Yellow
  tertiary: '#E8F4FF',     // Softer Sky Blue
  neutral: '#FFFFFF',      // White
  accent: '#26C6DA',       // Bright Teal - Fresh and modern
  success: '#4ECDC4',      // Mint Green
  header: '#fcf8b1',       // Yellow Header Color
  
  text: {
    primary: '#2D4A63',    // Soft Blue-Gray
    secondary: '#6B7B8C',  // Warm Gray
    light: '#FFFFFF',      // White
    dark: '#4A5C6B',       // Soft Charcoal
    accent: '#E53E3E',     // Red accent
  }
};

// Perfectly aligned gradient colors for each section
const GRADIENTS = {
  // Header gradients - using your tab bar colors
  header: ['#7E57C2', '#3a8dfd'], // Purple to blue (from Tracker tab)
  stats: ['#FF9A3D', '#FF6B6B'],   // Orange to red (warm and inviting)
  cards: {
    list: ['#FFF7D0', '#FFE8A5'],   // Yellow gradients for list cards
    minimal: ['#FFFFFF', '#F8FAFF'], // Clean white gradients for minimal
  },
  buttons: {
    primary: ['#7E57C2', '#8B6BC9'], // Purple gradients
    success: ['#4ECDC4', '#3DBBB4'], // Mint green gradients
    accent: ['#26C6DA', '#1FB4C8'],  // Teal gradients
  }
};

// View Types
type ViewMode = 'list' | 'compact';

// Enhanced Floating Particles
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
const BouncingButton = ({ children, onPress, style = {} }) => {
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
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Progress Ring Component
const ProgressRing = ({ progress, size = 32 }: { progress: number; size?: number }) => {
  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      <LinearGradient
        colors={progress >= 100 ? GRADIENTS.buttons.success : GRADIENTS.buttons.primary}
        style={styles.progressBackground}
      />
      <View style={[styles.progressFill, { 
        width: size - 6, 
        height: size - 6,
        borderRadius: (size - 6) / 2,
        backgroundColor: progress >= 100 ? THEME.success : THEME.primary,
        opacity: Math.max(progress / 100, 0.1)
      }]} />
      <Text style={[styles.progressText, { fontSize: size * 0.25 }]}>
        {progress}%
      </Text>
    </View>
  );
};

// List Dua Card - For List View
const ListDuaCard = React.memo(({ 
  dua, 
  category,
  onToggleFavorite,
  onToggleMemorized,
  onPressPractice 
}: { 
  dua: Dua;
  category: any;
  onToggleFavorite: (id: string, value: boolean) => void;
  onToggleMemorized: (id: string, value: boolean) => void;
  onPressPractice: (dua: Dua) => void;
}) => {
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate progress based on memorization status
  const getProgress = (dua: Dua) => {
    switch (dua.memorization_status) {
      case 'memorized': return 100;
      case 'learning': return 50;
      case 'not_started': return 0;
      default: return 0;
    }
  };

  const progress = getProgress(dua);

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
        ],
      }}
    >
      <BouncingButton onPress={() => onPressPractice(dua)} style={styles.listCard}>
        <LinearGradient
          colors={GRADIENTS.cards.list}
          style={styles.listCardInner}
        >
          <View style={styles.listContent}>
            {/* Left: Image and Basic Info */}
            <View style={styles.listLeft}>
              <Image 
                source={dua.image_path || category?.image_path} 
                style={styles.listImage}
                defaultSource={require('../../assets/images/kaaba.png')}
              />
              <View style={styles.listBasicInfo}>
                <LinearGradient
                  colors={GRADIENTS.buttons.primary}
                  style={styles.listNumber}
                >
                  <Text style={styles.listNumberText}>#{dua.duaNumber || dua.order_index}</Text>
                </LinearGradient>
                {dua.is_favorited && (
                  <View style={styles.favoriteIndicator}>
                    <Text style={styles.favoriteText}>❤️</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Middle: Content */}
            <View style={styles.listMiddle}>
              <Text style={styles.listTitle} numberOfLines={2}>
                {dua.title}
              </Text>
              <View style={styles.listMeta}>
                <LinearGradient
                  colors={GRADIENTS.buttons.accent}
                  style={styles.categoryTag}
                >
                  <Text style={styles.categoryText}>{category?.name || 'General'}</Text>
                </LinearGradient>
                <Text style={styles.lastPracticed}>
                  {dua.memorization_status === 'memorized' ? 'Memorized' : 
                   dua.memorization_status === 'learning' ? 'In Progress' : 'Not Started'}
                </Text>
              </View>
              <Text style={styles.listPracticeCount}>
                {dua.reference}
              </Text>
            </View>

            {/* Right: Progress and Actions */}
            <View style={styles.listRight}>
              <ProgressRing progress={progress} size={36} />
              <View style={styles.listActions}>
                <LinearGradient
                  colors={dua.memorization_status === 'memorized' ? GRADIENTS.buttons.success : GRADIENTS.buttons.primary}
                  style={styles.listPracticeButton}
                >
                  <TouchableOpacity onPress={() => onPressPractice(dua)}>
                    <Text style={styles.listPracticeText}>
                      {dua.memorization_status === 'memorized' ? 'Review' : 'Practice'}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <Switch
                  value={dua.is_favorited}
                  onValueChange={(value) => onToggleFavorite(dua.id, value)}
                  trackColor={{ false: '#F1F5F9', true: `${THEME.success}80` }}
                  thumbColor={dua.is_favorited ? THEME.success : '#FFFFFF'}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </BouncingButton>
    </Animated.View>
  );
});

// Minimal Dua Card - For Minimal View
const MinimalDuaCard = React.memo(({ 
  dua, 
  category,
  onToggleFavorite,
  onToggleMemorized,
  onPressPractice 
}: { 
  dua: Dua;
  category: any;
  onToggleFavorite: (id: string, value: boolean) => void;
  onToggleMemorized: (id: string, value: boolean) => void;
  onPressPractice: (dua: Dua) => void;
}) => {
  const cardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 60,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  // Calculate progress based on memorization status
  const getProgress = (dua: Dua) => {
    switch (dua.memorization_status) {
      case 'memorized': return 100;
      case 'learning': return 50;
      case 'not_started': return 0;
      default: return 0;
    }
  };

  const progress = getProgress(dua);

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
        ],
      }}
    >
      <BouncingButton onPress={() => onPressPractice(dua)} style={styles.minimalCard}>
        <LinearGradient
          colors={GRADIENTS.cards.minimal}
          style={styles.minimalContent}
        >
          <View style={styles.minimalLeft}>
            <LinearGradient
              colors={GRADIENTS.buttons.primary}
              style={styles.minimalNumber}
            >
              <Text style={styles.minimalNumberText}>#{dua.duaNumber || dua.order_index}</Text>
            </LinearGradient>
            <View style={styles.minimalText}>
              <Text style={styles.minimalTitle} numberOfLines={1}>
                {dua.title}
              </Text>
              <Text style={styles.minimalMeta}>
                {category?.name || 'General'} • {dua.memorization_status}
              </Text>
            </View>
          </View>
          
          <View style={styles.minimalRight}>
            <ProgressRing progress={progress} size={28} />
            <Switch
              value={dua.is_favorited}
              onValueChange={(value) => onToggleFavorite(dua.id, value)}
              trackColor={{ false: '#F1F5F9', true: `${THEME.success}80` }}
              thumbColor={dua.is_favorited ? THEME.success : '#FFFFFF'}
              style={styles.minimalSwitch}
            />
          </View>
        </LinearGradient>
        
        {dua.is_favorited && (
          <View style={styles.minimalFavorite}>
            <Text style={styles.favoriteText}>❤️</Text>
          </View>
        )}
      </BouncingButton>
    </Animated.View>
  );
});

// View Toggle Component
const ViewToggle = ({ viewMode, onViewModeChange }: { 
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) => {
  const views = [
    { id: 'compact' as ViewMode, icon: '📋', label: 'Minimal' },
    { id: 'list' as ViewMode, icon: '📄', label: 'List' },
  ];

  return (
    <View style={styles.viewToggleContainer}>
      <Text style={styles.viewToggleLabel}>View:</Text>
      {views.map((view) => (
        <BouncingButton
          key={view.id}
          onPress={() => onViewModeChange(view.id)}
          style={styles.viewToggleButton}
        >
          <LinearGradient
            colors={viewMode === view.id ? GRADIENTS.buttons.primary : ['#F1F5F9', '#E5E7EB']}
            style={styles.viewToggleGradient}
          >
            <Text style={[
              styles.viewToggleIcon,
              viewMode === view.id && styles.viewToggleIconActive
            ]}>
              {view.icon}
            </Text>
            <Text style={[
              styles.viewToggleText,
              viewMode === view.id && styles.viewToggleTextActive
            ]}>
              {view.label}
            </Text>
          </LinearGradient>
        </BouncingButton>
      ))}
    </View>
  );
};

// Filter Tabs Component
const FilterTabs = ({ 
  activeFilter, 
  onFilterChange,
  counts 
}: { 
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts: { all: number; favorite: number; memorized: number; practice: number };
}) => {
  const filters = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'favorite', label: 'Favorite', count: counts.favorite },
    { id: 'memorized', label: 'Memorized', count: counts.memorized },
    { id: 'practice', label: 'In Practice', count: counts.practice },
  ];

  return (
    <View style={styles.filtersWrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map((filter) => (
          <BouncingButton
            key={filter.id}
            onPress={() => onFilterChange(filter.id)}
            style={styles.filterButton}
          >
            <LinearGradient
              colors={activeFilter === filter.id ? GRADIENTS.buttons.primary : ['#FFFFFF', '#F8FAFF']}
              style={[
                styles.filterButtonGradient,
                activeFilter === filter.id && styles.filterButtonGradientActive
              ]}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
              <LinearGradient
                colors={activeFilter === filter.id ? GRADIENTS.buttons.accent : ['#F1F5F9', '#E5E7EB']}
                style={styles.filterCount}
              >
                <Text style={[
                  styles.filterCountText,
                  activeFilter === filter.id && styles.filterCountTextActive
                ]}>
                  {filter.count}
                </Text>
              </LinearGradient>
            </LinearGradient>
          </BouncingButton>
        ))}
      </ScrollView>
    </View>
  );
};

// Stats Header Component
const StatsHeader = ({ duas }: { duas: Dua[] }) => {
  const memorizedCount = duas.filter(d => d.memorization_status === 'memorized').length;
  const totalCount = duas.length;
  const progress = totalCount > 0 ? (memorizedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.statsContainer}>
      <LinearGradient
        colors={GRADIENTS.stats}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statsGradient}
      >
        <Text style={styles.statsTitle}>Your Progress 🎯</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{memorizedCount}</Text>
            <Text style={styles.statLabel}>Memorized</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total Duas</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{Math.round(progress)}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        <View style={styles.overallProgress}>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={GRADIENTS.stats}
              style={[
                styles.progressFillBar,
                { width: `${progress}%` }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default function DuaTrackerScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('compact');
  const [duas, setDuas] = useState<Dua[]>(getAllDuas());

  // Calculate counts for filter tabs
  const filterCounts = useMemo(() => ({
    all: duas.length,
    favorite: duas.filter(d => d.is_favorited).length,
    memorized: duas.filter(d => d.memorization_status === 'memorized').length,
    practice: duas.filter(d => d.memorization_status !== 'memorized').length,
  }), [duas]);

  const filteredDuas = useMemo(() => {
    switch (activeFilter) {
      case 'favorite':
        return duas.filter(dua => dua.is_favorited);
      case 'memorized':
        return duas.filter(dua => dua.memorization_status === 'memorized');
      case 'practice':
        return duas.filter(dua => dua.memorization_status !== 'memorized');
      default:
        return duas;
    }
  }, [duas, activeFilter]);

  const handleToggleFavorite = useCallback((id: string, value: boolean) => {
    setDuas(prev => prev.map(dua => 
      dua.id === id ? { ...dua, is_favorited: value } : dua
    ));
  }, []);

  const handleToggleMemorized = useCallback((id: string, value: boolean) => {
    setDuas(prev => prev.map(dua => 
      dua.id === id ? { 
        ...dua, 
        memorization_status: value ? 'memorized' : 'not_started'
      } : dua
    ));
  }, []);

  const handlePracticePress = useCallback((dua: Dua) => {
    // Navigate to dua detail screen
    router.push({
      pathname: '/dua-detail',
      params: {
        id: dua.id,
        title: dua.title,
        arabic: dua.arabic_text,
        translation: dua.translation,
        reference: dua.reference,
        textheading: dua.textheading || '',
        duaNumber: dua.duaNumber || dua.order_index?.toString() || '1',
        categoryName: getCategoryById(dua.category_id)?.name || 'General',
        useLocalImage: 'true',
        localImageIndex: ((parseInt(dua.id) || 1) % 32) + 1,
        imagePath: dua.image_path
      }
    });
  }, [router]);

  // Render appropriate card based on view mode
  const renderDuaCard = (dua: Dua, index: number) => {
    const category = getCategoryById(dua.category_id);
    
    switch (viewMode) {
      case 'list':
        return (
          <ListDuaCard
            key={dua.id}
            dua={dua}
            category={category}
            onToggleFavorite={handleToggleFavorite}
            onToggleMemorized={handleToggleMemorized}
            onPressPractice={handlePracticePress}
          />
        );
      case 'compact':
        return (
          <MinimalDuaCard
            key={dua.id}
            dua={dua}
            category={category}
            onToggleFavorite={handleToggleFavorite}
            onToggleMemorized={handleToggleMemorized}
            onPressPractice={handlePracticePress}
          />
        );
    }
  };

  return (
    <ScreenWrapper bottomMargin={70}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={THEME.header} />
        
        <FloatingParticles />
        
        {/* Header */}
        <View style={styles.header}>
          <LinearGradient
            colors={GRADIENTS.header}
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
                <View style={{ marginBottom: 15 }}>
                  <Text style={styles.title}>Dua Tracker 📊</Text>
                  <Text style={styles.subtitle}>Track your memorization progress! 🌟</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Header */}
        <StatsHeader duas={duas} />

        {/* Filter Tabs - Now appears first with proper spacing */}
        <FilterTabs 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={filterCounts}
        />

        {/* View Toggle */}
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

        {/* Dua List */}
        <View style={styles.duaListContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.duaListContent,
              viewMode === 'compact' && styles.compactContent
            ]}
          >
            {filteredDuas.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateEmoji}>📝</Text>
                <Text style={styles.emptyStateTitle}>
                  No Duas Found
                </Text>
                <Text style={styles.emptyStateText}>
                  {activeFilter === 'all' 
                    ? 'Start adding Duas to track your progress!' 
                    : `No ${activeFilter} Duas found. Try a different filter.`
                  }
                </Text>
              </View>
            ) : (
              <>
                {!activeFilter && (
                  <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>
                      Track Your {filteredDuas.length} Duas Progress 📈
                    </Text>
                    <Text style={styles.welcomeSubtext}>
                      Practice makes perfect! Keep going! 💫
                    </Text>
                  </View>
                )}
                {filteredDuas.map((dua, index) => renderDuaCard(dua, index))}
              </>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.tertiary,
  },
  // Header Styles
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 20,
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
    color: THEME.text.light,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: THEME.text.light,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 2,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: 10, // Reduced margin to prevent overlap
  },
  statsGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#FF9A3D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.light,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.text.light,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  overallProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFillBar: {
    height: '100%',
    borderRadius: 3,
  },
  // View Toggle
  viewToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: THEME.neutral,
    borderBottomWidth: 1,
    borderBottomColor: `${THEME.primary}15`,
  },
  viewToggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.secondary,
    marginRight: 12,
  },
  viewToggleButton: {
    marginRight: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  viewToggleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewToggleIcon: {
    fontSize: 14,
    marginRight: 4,
    color: THEME.text.primary,
  },
  viewToggleIconActive: {
    color: THEME.text.light,
  },
  viewToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  viewToggleTextActive: {
    color: THEME.text.light,
  },
  // Filters - UPDATED: Better spacing and visibility
  filtersWrapper: {
    height: 70,
    justifyContent: 'center',
    backgroundColor: THEME.neutral,
    borderBottomWidth: 1,
    borderBottomColor: `${THEME.primary}15`,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterButton: {
    marginRight: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    height: 36,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text.primary,
    marginRight: 6,
  },
  filterButtonTextActive: {
    color: THEME.text.light,
  },
  filterCount: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.primary,
  },
  filterCountTextActive: {
    color: THEME.text.light,
  },
  // Dua List Container
  duaListContainer: {
    flex: 1,
  },
  duaListContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 8,
  },
  compactContent: {
    paddingHorizontal: 12,
  },
  // Progress Ring
  progressRing: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  progressFill: {
    position: 'absolute',
  },
  progressText: {
    fontWeight: 'bold',
    color: THEME.text.primary,
  },
  // Common Styles
  listNumber: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.text.light,
  },
  minimalNumber: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
  },
  minimalNumberText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.text.light,
  },
  favoriteIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.text.accent,
  },
  favoriteText: {
    fontSize: 10,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.text.light,
  },
  lastPracticed: {
    fontSize: 11,
    color: THEME.text.secondary,
  },
  // List Card
  listCard: {
    marginBottom: 8,
  },
  listCardInner: {
    borderRadius: 15,
    padding: 12,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  listContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  listImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 4,
  },
  listBasicInfo: {
    alignItems: 'center',
  },
  listMiddle: {
    flex: 1,
    marginRight: 12,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
    lineHeight: 18,
    marginBottom: 4,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  listPracticeCount: {
    fontSize: 11,
    color: THEME.text.secondary,
  },
  listRight: {
    alignItems: 'center',
  },
  listActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  listPracticeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  listPracticeText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.text.light,
  },
  // Minimal Card
  minimalCard: {
    borderRadius: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  minimalContent: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  minimalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  minimalText: {
    flex: 1,
    marginLeft: 8,
  },
  minimalTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  minimalMeta: {
    fontSize: 11,
    color: THEME.text.secondary,
  },
  minimalRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minimalSwitch: {
    transform: [{ scale: 0.7 }],
    marginLeft: 8,
  },
  minimalFavorite: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  // Welcome Section
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
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
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: THEME.text.primary,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
});