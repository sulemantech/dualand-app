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

interface DuaItem {
  id: string;
  number: number;
  title: string;
  image: any;
  isMemorized: boolean;
  isFavorite: boolean;
  category: string;
  lastPracticed?: string;
  practiceCount: number;
  progress: number;
  memorization_status: 'not_started' | 'learning' | 'memorized';
}

const DUAS_DATA: DuaItem[] = [
  {
    id: '1',
    number: 1,
    title: 'Praise and Glory',
    image: require('../../assets/images/dua_31.png'),
    isMemorized: true,
    isFavorite: true,
    category: 'Daily',
    lastPracticed: '2 hours ago',
    practiceCount: 15,
    progress: 100,
    memorization_status: 'memorized'
  },
  {
    id: '2',
    number: 2,
    title: 'Peace upon the Prophet',
    image: require('../../assets/images/dua_2.png'),
    isMemorized: false,
    isFavorite: true,
    category: 'Prophet',
    lastPracticed: '1 day ago',
    practiceCount: 8,
    progress: 65,
    memorization_status: 'learning'
  },
  {
    id: '3',
    number: 3,
    title: 'Morning Dua',
    image: require('../../assets/images/dua_3.png'),
    isMemorized: false,
    isFavorite: false,
    category: 'Morning',
    lastPracticed: 'Just now',
    practiceCount: 3,
    progress: 25,
    memorization_status: 'learning'
  },
  {
    id: '4',
    number: 4,
    title: 'Evening Dua',
    image: require('../../assets/images/dua_4.png'),
    isMemorized: true,
    isFavorite: false,
    category: 'Evening',
    lastPracticed: '3 hours ago',
    practiceCount: 12,
    progress: 100,
    memorization_status: 'memorized'
  },
  {
    id: '5',
    number: 5,
    title: 'Protection Dua',
    image: require('../../assets/images/dua_5.png'),
    isMemorized: false,
    isFavorite: true,
    category: 'Protection',
    lastPracticed: '2 days ago',
    practiceCount: 5,
    progress: 45,
    memorization_status: 'learning'
  },
  {
    id: '6',
    number: 6,
    title: 'Guidance Dua',
    image: require('../../assets/images/dua_6.png'),
    isMemorized: false,
    isFavorite: false,
    category: 'Guidance',
    lastPracticed: '1 week ago',
    practiceCount: 2,
    progress: 15,
    memorization_status: 'not_started'
  },
  {
    id: '7',
    number: 7,
    title: 'Forgiveness Dua',
    image: require('../../assets/images/dua_7.png'),
    isMemorized: true,
    isFavorite: true,
    category: 'Forgiveness',
    lastPracticed: 'Yesterday',
    practiceCount: 18,
    progress: 100,
    memorization_status: 'memorized'
  },
  {
    id: '8',
    number: 8,
    title: 'Thanksgiving Dua',
    image: require('../../assets/images/dua_8.png'),
    isMemorized: false,
    isFavorite: false,
    category: 'Gratitude',
    lastPracticed: '3 days ago',
    practiceCount: 6,
    progress: 35,
    memorization_status: 'learning'
  },
];

// View Types - REMOVED 'grid' option
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
      <View style={styles.progressBackground} />
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

// Progress Star Component
const ProgressStar = ({ filled, size = 12 }: { filled: boolean; size?: number }) => {
  return (
    <Text style={[styles.progressStar, { fontSize: size }]}>
      {filled ? '⭐' : '☆'}
    </Text>
  );
};

// List Dua Card - For List View
const ListDuaCard = React.memo(({ 
  dua, 
  onToggleMemorized,
  onPressPractice 
}: { 
  dua: DuaItem;
  onToggleMemorized: (id: string, value: boolean) => void;
  onPressPractice: (dua: DuaItem) => void;
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
        <View style={styles.listCardInner}>
          <View style={styles.listContent}>
            {/* Left: Image and Basic Info */}
            <View style={styles.listLeft}>
              <Image 
                source={dua.image} 
                style={styles.listImage}
                defaultSource={require('../../assets/images/dua_31.png')}
              />
              <View style={styles.listBasicInfo}>
                <Text style={styles.listNumber}>#{dua.number}</Text>
                {dua.isFavorite && (
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
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{dua.category}</Text>
                </View>
                <Text style={styles.lastPracticed}>{dua.lastPracticed}</Text>
              </View>
              <Text style={styles.listPracticeCount}>
                {dua.practiceCount} practices • {dua.progress}% complete
              </Text>
            </View>

            {/* Right: Progress and Actions */}
            <View style={styles.listRight}>
              <ProgressRing progress={dua.progress} size={36} />
              <View style={styles.listActions}>
                <TouchableOpacity 
                  style={[
                    styles.listPracticeButton,
                    dua.isMemorized && styles.listPracticeButtonMemorized
                  ]}
                  onPress={() => onPressPractice(dua)}
                >
                  <Text style={styles.listPracticeText}>
                    {dua.isMemorized ? 'Review' : 'Practice'}
                  </Text>
                </TouchableOpacity>
                <Switch
                  value={dua.isMemorized}
                  onValueChange={(value) => onToggleMemorized(dua.id, value)}
                  trackColor={{ false: '#F1F5F9', true: `${THEME.success}80` }}
                  thumbColor={dua.isMemorized ? THEME.success : '#FFFFFF'}
                />
              </View>
            </View>
          </View>
        </View>
      </BouncingButton>
    </Animated.View>
  );
});

// Minimal Dua Card - For Minimal View
const MinimalDuaCard = React.memo(({ 
  dua, 
  onToggleMemorized,
  onPressPractice 
}: { 
  dua: DuaItem;
  onToggleMemorized: (id: string, value: boolean) => void;
  onPressPractice: (dua: DuaItem) => void;
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
        <View style={styles.minimalContent}>
          <View style={styles.minimalLeft}>
            <Text style={styles.minimalNumber}>#{dua.number}</Text>
            <View style={styles.minimalText}>
              <Text style={styles.minimalTitle} numberOfLines={1}>
                {dua.title}
              </Text>
              <Text style={styles.minimalMeta}>
                {dua.category} • {dua.practiceCount} practices
              </Text>
            </View>
          </View>
          
          <View style={styles.minimalRight}>
            <ProgressRing progress={dua.progress} size={28} />
            <Switch
              value={dua.isMemorized}
              onValueChange={(value) => onToggleMemorized(dua.id, value)}
              trackColor={{ false: '#F1F5F9', true: `${THEME.success}80` }}
              thumbColor={dua.isMemorized ? THEME.success : '#FFFFFF'}
              style={styles.minimalSwitch}
            />
          </View>
        </View>
        
        {dua.isFavorite && (
          <View style={styles.minimalFavorite}>
            <Text style={styles.favoriteText}>❤️</Text>
          </View>
        )}
      </BouncingButton>
    </Animated.View>
  );
});

// View Toggle Component - UPDATED: Removed grid option
const ViewToggle = ({ viewMode, onViewModeChange }: { 
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}) => {
  const views = [
    { id: 'compact' as ViewMode, icon: '📋', label: 'Minimal' },
    { id: 'list' as ViewMode, icon: '📄', label: 'List' },
    // REMOVED: Grid option
  ];

  return (
    <View style={styles.viewToggleContainer}>
      <Text style={styles.viewToggleLabel}>View:</Text>
      {views.map((view) => (
        <BouncingButton
          key={view.id}
          onPress={() => onViewModeChange(view.id)}
          style={[
            styles.viewToggleButton,
            viewMode === view.id && styles.viewToggleButtonActive
          ]}
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
        </BouncingButton>
      ))}
    </View>
  );
};

// Filter Tabs Component
const FilterTabs = ({ 
  activeFilter, 
  onFilterChange 
}: { 
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) => {
  const filters = [
    { id: 'all', label: 'All', count: DUAS_DATA.length },
    { id: 'favorite', label: 'Favorite', count: DUAS_DATA.filter(d => d.isFavorite).length },
    { id: 'memorized', label: 'Memorized', count: DUAS_DATA.filter(d => d.isMemorized).length },
    { id: 'practice', label: 'In Practice', count: DUAS_DATA.filter(d => !d.isMemorized).length },
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
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.filterButtonActive
            ]}
          >
            <Text style={[
              styles.filterButtonText,
              activeFilter === filter.id && styles.filterButtonTextActive
            ]}>
              {filter.label}
            </Text>
            <View style={[
              styles.filterCount,
              activeFilter === filter.id && styles.filterCountActive
            ]}>
              <Text style={styles.filterCountText}>
                {filter.count}
              </Text>
            </View>
          </BouncingButton>
        ))}
      </ScrollView>
    </View>
  );
};

// Stats Header Component
const StatsHeader = ({ duas }: { duas: DuaItem[] }) => {
  const memorizedCount = duas.filter(d => d.isMemorized).length;
  const totalCount = duas.length;
  const progress = totalCount > 0 ? (memorizedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.statsContainer}>
      <LinearGradient
        colors={[THEME.primary, '#3a8dfd']}
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
            <Animated.View 
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
  const [duas, setDuas] = useState<DuaItem[]>(DUAS_DATA);

  const filteredDuas = useMemo(() => {
    switch (activeFilter) {
      case 'favorite':
        return duas.filter(dua => dua.isFavorite);
      case 'memorized':
        return duas.filter(dua => dua.isMemorized);
      case 'practice':
        return duas.filter(dua => !dua.isMemorized);
      default:
        return duas;
    }
  }, [duas, activeFilter]);

  const handleToggleFavorite = useCallback((id: string, value: boolean) => {
    setDuas(prev => prev.map(dua => 
      dua.id === id ? { ...dua, isFavorite: value } : dua
    ));
  }, []);

  const handleToggleMemorized = useCallback((id: string, value: boolean) => {
    setDuas(prev => prev.map(dua => 
      dua.id === id ? { 
        ...dua, 
        isMemorized: value,
        progress: value ? 100 : Math.min((dua.practiceCount / 20) * 100, 99),
        memorization_status: value ? 'memorized' : 'learning'
      } : dua
    ));
  }, []);

  const handlePracticePress = useCallback((dua: DuaItem) => {
    const newPracticeCount = dua.practiceCount + 1;
    const newProgress = dua.isMemorized ? 100 : Math.min((newPracticeCount / 20) * 100, 99);
    
    setDuas(prev => prev.map(d => 
      d.id === dua.id ? { 
        ...d, 
        practiceCount: newPracticeCount, 
        lastPracticed: 'Just now',
        progress: newProgress
      } : d
    ));
    
    console.log('Practice pressed for:', dua.title);
  }, []);

  const handleHomePress = useCallback(() => {
    router.back();
  }, [router]);

  // Render appropriate card based on view mode - UPDATED: Removed grid case
  const renderDuaCard = (dua: DuaItem, index: number) => {
    switch (viewMode) {
      case 'list':
        return (
          <ListDuaCard
            key={dua.id}
            dua={dua}
            onToggleMemorized={handleToggleMemorized}
            onPressPractice={handlePracticePress}
          />
        );
      case 'compact':
        return (
          <MinimalDuaCard
            key={dua.id}
            dua={dua}
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
        
        {/* Header - Updated to match dashboard */}
        <View style={styles.header}>
          <LinearGradient
            colors={[THEME.header, '#fef9c3']}
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
              
              <BouncingButton onPress={handleHomePress}>
                <TouchableOpacity style={styles.backButton}>
                  <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
              </BouncingButton>
            </View>
          </LinearGradient>
        </View>

        {/* Stats Header */}
        <StatsHeader duas={duas} />

        {/* View Toggle */}
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />

        {/* Filter Tabs */}
        <FilterTabs 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Dua List */}
        <View style={styles.duaListContainer}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.duaListContent,
              viewMode === 'compact' && styles.compactContent
              // REMOVED: gridContent style
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
  // Header Styles - Updated to match dashboard
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
    color: THEME.text.dark,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.text.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backIcon: {
    fontSize: 20,
    color: THEME.text.dark,
    fontWeight: 'bold',
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 0,
    marginTop: -20,
  },
  statsGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: THEME.primary,
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
    backgroundColor: THEME.text.light,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
  viewToggleButtonActive: {
    backgroundColor: THEME.primary,
  },
  viewToggleIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  viewToggleIconActive: {
    color: THEME.text.light,
  },
  viewToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.primary,
  },
  viewToggleTextActive: {
    color: THEME.text.light,
  },
  // Filters
  filtersWrapper: {
    height: 60,
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.neutral,
    marginRight: 8,
    borderWidth: 1,
    borderColor: `${THEME.primary}20`,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 36,
  },
  filterButtonActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  filterCountActive: {
    backgroundColor: 'rgba(243, 239, 239, 0.6)',
  },
  filterCountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: THEME.primary,
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
  // REMOVED: gridContent style
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
    backgroundColor: '#F1F5F9',
  },
  progressFill: {
    position: 'absolute',
  },
  progressText: {
    fontWeight: 'bold',
    color: THEME.text.primary,
  },
  // REMOVED: Grid card styles (card, cardInner, cardImageContainer, etc.)
  
  // Common Styles
  duaNumber: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  duaNumberText: {
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
    backgroundColor: `${THEME.accent}30`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: THEME.accent,
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
    backgroundColor: THEME.secondary,
    padding: 12,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: THEME.accent,
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
  listNumber: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.primary,
    marginBottom: 2,
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
    backgroundColor: THEME.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
  },
  listPracticeButtonMemorized: {
    backgroundColor: THEME.success,
  },
  listPracticeText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.text.light,
  },
  // Minimal Card
  minimalCard: {
    borderRadius: 12,
    backgroundColor: THEME.secondary,
    padding: 12,
    marginBottom: 6,
    // shadowColor: THEME.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 2,
    borderWidth: 2,
    borderColor: THEME.accent,
    borderLeftWidth: 5,
    borderLeftColor: THEME.primary,

    // backgroundColor: THEME.neutral,
    // borderRadius: 12,
    // padding: 12,
    // marginBottom: 6,
    // marginHorizontal: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
    // borderLeftWidth: 4,
    // borderLeftColor: THEME.primary,
  },
  minimalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  minimalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  minimalNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.primary,
    marginRight: 8,
    minWidth: 24,
  },
  minimalText: {
    flex: 1,
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