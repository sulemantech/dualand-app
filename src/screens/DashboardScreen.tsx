import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useDuaStore } from '../stores/duaStore';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { ThumbnailPlaceholder } from '../components/ThumbnailPlaceholder';

type FilterType = 'all' | 'favorite' | 'memorized' | 'learning';

type DashboardNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

export default function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { categories } = useDuaStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters = [
    { id: 'all' as FilterType, label: 'All' },
    { id: 'favorite' as FilterType, label: 'Favorite' },
    { id: 'memorized' as FilterType, label: 'Memorized' },
    { id: 'learning' as FilterType, label: 'In Practice' },
  ];

  const getProgressStats = (categoryId: string) => {
    const progressMap: { [key: string]: { memorized: number; total: number } } = {
      '1': { memorized: 2, total: 5 },
      '2': { memorized: 1, total: 3 },
      '3': { memorized: 0, total: 4 },
      '4': { memorized: 1, total: 2 },
      '5': { memorized: 0, total: 3 },
      '6': { memorized: 0, total: 2 },
    };
    return progressMap[categoryId] || { memorized: 0, total: 0 };
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    navigation.navigate('CategoryDetail', { 
      categoryId, 
      categoryName 
    });
  };

  const renderCategoryCard = ({ item, index }: { item: any; index: number }) => {
    const stats = getProgressStats(item.id);
    const progress = stats.total > 0 ? (stats.memorized / stats.total) * 100 : 0;
    const cardNumber = (index + 1).toString().padStart(2, '0');

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item.id, item.name)}
      >
        {/* Card Number */}
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumber}>{cardNumber}</Text>
        </View>

        {/* Thumbnail Placeholder */}
        <View style={styles.thumbnailContainer}>
          <ThumbnailPlaceholder 
            categoryId={item.id}
            color={item.color}
            icon={item.icon}
          />
        </View>

        {/* Category Name with Yellowish Background */}
        <View style={styles.titleContainer}>
          <Text style={styles.categoryName} numberOfLines={2}>
            {item.name}
          </Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStats}>
            <Text style={styles.progressText}>
              {stats.memorized}/{stats.total}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: item.color }
                ]}
              />
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color="#94A3B8" 
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBEB" />
      
      {/* Header with Yellowish Background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>DUA LAND</Text>
          <Text style={styles.headerSubtitle}>Your Daily Dua Companion</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilter(filter.id)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.id && styles.activeFilterText
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories Grid */}
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.categoriesGrid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFBEB',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  searchButton: {
    padding: 8,
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  filterContainer: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeFilterTab: {
    backgroundColor: '#D97706',
    borderColor: '#D97706',
  },
  filterText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  categoriesGrid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 4,
    overflow: 'hidden',
  },
  cardNumberContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  thumbnailContainer: {
    width: '100%',
    height: 100,
  },
  titleContainer: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 16,
    minHeight: 60,
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    lineHeight: 18,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  progressStats: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});