import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Switch,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Use the same theme from your home screen
const THEME = {
  primary: '#FF6B9D',      // Softer Pink
  secondary: '#FFF7D0',    // Bright Lemon Yellow
  tertiary: '#E8F4FF',     // Softer Sky Blue
  neutral: '#FFFFFF',      // White
  accent: '#FFD166',       // Sunny Yellow
  success: '#4ECDC4',      // Mint Green
  text: {
    primary: '#2D3748',    // Soft Dark
    secondary: '#718096',  // Soft Gray
    light: '#FFFFFF',      // White
  }
};

const { width } = Dimensions.get('window');

// Types
interface DuaItem {
  id: string;
  number: number;
  title: string;
  image: any;
  isMemorized: boolean;
  isFavorite: boolean;
  category: string;
}

// Sample data - in production, this would come from your database
const DUAS_DATA: DuaItem[] = [
  {
    id: '1',
    number: 1,
    title: 'Praise and Glory',
    image: require('../assets/images/dua_31.png'),
    isMemorized: true,
    isFavorite: true,
    category: 'Daily'
  },
  {
    id: '2',
    number: 2,
    title: 'Peace and Blessing upon the Prophet Muhammad',
    image: require('../assets/images/dua_2.png'),
    isMemorized: false,
    isFavorite: true,
    category: 'Prophet'
  },
  {
    id: '3',
    number: 3,
    title: 'Du\'a of Morning (Before Sunrise)',
    image: require('../assets/images/dua_3.png'),
    isMemorized: false,
    isFavorite: false,
    category: 'Morning'
  },
  {
    id: '4',
    number: 4,
    title: 'Du\'a of Evening (Before Sunset)',
    image: require('../assets/images/dua_4.png'),
    isMemorized: true,
    isFavorite: false,
    category: 'Evening'
  },
  {
    id: '5',
    number: 5,
    title: 'Du\'a for Protection',
    image: require('../assets/images/dua_5.png'),
    isMemorized: false,
    isFavorite: true,
    category: 'Protection'
  },
];

// Custom Switch Component with better UX
const MemoizationSwitch = ({ 
  value, 
  onValueChange 
}: { 
  value: boolean; 
  onValueChange: (value: boolean) => void;
}) => {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#f0f0f0', true: `${THEME.success}80` }}
      thumbColor={value ? THEME.success : '#f8f8f8'}
      ios_backgroundColor="#f0f0f0"
      style={styles.switch}
    />
  );
};

// Dua List Item Component
const DuaListItem = React.memo(({ 
  dua, 
  onToggleMemorized,
  onPressPractice 
}: { 
  dua: DuaItem;
  onToggleMemorized: (id: string, value: boolean) => void;
  onPressPractice: (dua: DuaItem) => void;
}) => {
  const handleToggle = useCallback((value: boolean) => {
    onToggleMemorized(dua.id, value);
  }, [dua.id, onToggleMemorized]);

  const handlePracticePress = useCallback(() => {
    onPressPractice(dua);
  }, [dua, onPressPractice]);

  return (
    <View style={styles.duaItem}>
      {/* Left Content: Image and Text */}
      <View style={styles.duaContent}>
        <Image 
          source={dua.image} 
          style={styles.duaImage}
          defaultSource={require('../assets/images/dua_31.png')}
        />
        <View style={styles.duaTextContainer}>
          <Text style={styles.duaTitle} numberOfLines={2}>
            {dua.number}. {dua.title}
          </Text>
          <TouchableOpacity 
            style={styles.practiceButton}
            onPress={handlePracticePress}
            activeOpacity={0.7}
          >
            <Text style={styles.practiceButtonText}>
              Practice Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Right Content: Toggle Switch */}
      <View style={styles.switchContainer}>
        <MemoizationSwitch 
          value={dua.isMemorized} 
          onValueChange={handleToggle}
        />
        {dua.isMemorized && (
          <Text style={styles.memorizedBadge}>🎉 Memorized!</Text>
        )}
      </View>
    </View>
  );
});

// Filter Tabs Component
const FilterTabs = ({ 
  activeFilter, 
  onFilterChange 
}: { 
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'favorite', label: 'Favorite' },
    { id: 'memorized', label: 'Memorized' },
    { id: 'practice', label: 'In Practice' },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.filterButtonActive
          ]}
          onPress={() => onFilterChange(filter.id)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.filterButtonText,
            activeFilter === filter.id && styles.filterButtonTextActive
          ]}>
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Bottom Navigation Component
const BottomNavigation = ({ activeTab, onTabChange }: { 
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const tabs = [
    { id: 'info', icon: '📚', label: 'Learn' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'share', icon: '🌟', label: 'Share' },
    { id: 'settings', icon: '⚡', label: 'Power' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={styles.navButton}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={activeTab === tab.id ? 
              [THEME.primary, '#FF8BB5'] : 
              ['transparent', 'transparent']
            }
            style={styles.navIconContainer}
          >
            <Text style={[
              styles.navIcon,
              activeTab === tab.id && styles.navIconActive
            ]}>
              {tab.icon}
            </Text>
          </LinearGradient>
          <Text style={[
            styles.navLabel,
            activeTab === tab.id && styles.navLabelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function DuaTrackerScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('info');
  const [duas, setDuas] = useState<DuaItem[]>(DUAS_DATA);

  // Filter duas based on active filter
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

  // Handle memorization toggle
  const handleToggleMemorized = useCallback((id: string, value: boolean) => {
    setDuas(prev => prev.map(dua => 
      dua.id === id ? { ...dua, isMemorized: value } : dua
    ));
  }, []);

  // Handle practice button press
  const handlePracticePress = useCallback((dua: DuaItem) => {
    // Navigate to practice screen or show practice modal
    console.log('Practice pressed for:', dua.title);
    // router.push({ pathname: '/practice', params: { id: dua.id } });
  }, []);

  // Handle home button press
  const handleHomePress = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.neutral} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={handleHomePress}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[THEME.accent, '#FFC145']}
            style={styles.homeButtonGradient}
          >
            <Text style={styles.homeIcon}>🏠</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Dua Tracker</Text>
          <Text style={styles.subtitle}>
            {filteredDuas.length} Duas • Track your progress
          </Text>
        </View>
        
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Filter Tabs */}
        <FilterTabs 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Dua List */}
        <ScrollView 
          style={styles.duaList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.duaListContent}
        >
          {filteredDuas.map((dua) => (
            <DuaListItem
              key={dua.id}
              dua={dua}
              onToggleMemorized={handleToggleMemorized}
              onPressPractice={handlePracticePress}
            />
          ))}
          
          {/* Empty State */}
          {filteredDuas.length === 0 && (
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
          )}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.tertiary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.neutral,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  homeButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  homeButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIcon: {
    fontSize: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: THEME.text.secondary,
    marginTop: 2,
  },
  headerPlaceholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: THEME.neutral,
    marginRight: 8,
    borderWidth: 1,
    borderColor: `${THEME.primary}30`,
    minWidth: 70,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  filterButtonTextActive: {
    color: THEME.text.light,
    fontWeight: 'bold',
  },
  duaList: {
    flex: 1,
  },
  duaListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  duaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.neutral,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: `${THEME.primary}15`,
  },
  duaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  duaImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: THEME.secondary,
  },
  duaTextContainer: {
    flex: 1,
  },
  duaTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.text.primary,
    lineHeight: 20,
    marginBottom: 6,
  },
  practiceButton: {
    alignSelf: 'flex-start',
    backgroundColor: `${THEME.success}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${THEME.success}40`,
  },
  practiceButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.success,
  },
  switchContainer: {
    alignItems: 'center',
  },
  switch: {
    transform: [{ scale: 1.1 }],
  },
  memorizedBadge: {
    fontSize: 10,
    color: THEME.success,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.text.secondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: THEME.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: THEME.secondary,
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: `${THEME.primary}20`,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navIcon: {
    fontSize: 20,
  },
  navIconActive: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  navLabel: {
    fontSize: 11,
    color: THEME.text.secondary,
    fontWeight: '600',
  },
  navLabelActive: {
    color: THEME.primary,
    fontWeight: 'bold',
  },
});