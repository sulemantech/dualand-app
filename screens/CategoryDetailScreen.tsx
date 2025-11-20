import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useDuaStore } from '../stores/duaStore';
import { RootStackParamList } from '../navigation/NavigationTypes';

type CategoryDetailRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;
type CategoryDetailNavigationProp = StackNavigationProp<RootStackParamList, 'CategoryDetail'>;

export default function CategoryDetailScreen() {
  const navigation = useNavigation<CategoryDetailNavigationProp>();
  const route = useRoute<CategoryDetailRouteProp>();
  const { categoryId, categoryName } = route.params;
  
  const { 
    currentCategoryDuas, 
    setCurrentCategory, 
    categories,
    toggleFavorite 
  } = useDuaStore();

  const currentCategory = categories.find(cat => cat.id === categoryId);

  useEffect(() => {
    if (categoryId) {
      setCurrentCategory(categoryId);
    }
  }, [categoryId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'memorized':
        return { icon: 'checkmark-circle' as const, color: '#059669' };
      case 'learning':
        return { icon: 'time' as const, color: '#3B82F6' };
      default:
        return { icon: 'ellipse-outline' as const, color: '#CBD5E1' };
    }
  };

  const handleDuaPress = (duaId: string) => {
    navigation.navigate('DuaAudio', { 
      duaId,
      categoryId 
    });
  };

  const handleFavoritePress = (duaId: string, isCurrentlyFavorited: boolean) => {
    toggleFavorite(duaId);
  };

  const renderDuaItem = ({ item }: { item: any }) => {
    const status = getStatusIcon(item.memorization_status);

    return (
      <TouchableOpacity 
        style={styles.duaItem}
        onPress={() => handleDuaPress(item.id)}
      >
        <View style={styles.duaContent}>
          <Text style={styles.duaTitle}>{item.title}</Text>
          <Text style={styles.duaReference}>{item.reference}</Text>
        </View>
        
        <View style={styles.duaActions}>
          <Ionicons 
            name={status.icon} 
            size={20} 
            color={status.color} 
            style={styles.statusIcon}
          />
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => handleFavoritePress(item.id, item.is_favorited)}
          >
            <Ionicons 
              name={item.is_favorited ? 'heart' : 'heart-outline'} 
              size={20} 
              color={item.is_favorited ? '#EF4444' : '#94A3B8'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.practiceButton}>
            <Text style={styles.practiceButtonText}>Practice</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (!currentCategory) {
    return (
      <View style={styles.container}>
        <Text>Category not found</Text>
      </View>
    );
  }

  const memorizedCount = currentCategoryDuas.filter(d => d.memorization_status === 'memorized').length;
  const learningCount = currentCategoryDuas.filter(d => d.memorization_status === 'learning').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFBEB" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {currentCategory.name}
          </Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Progress Summary */}
      <View style={styles.progressSummary}>
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>{memorizedCount}</Text>
          <Text style={styles.progressLabel}>Memorized</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>{learningCount}</Text>
          <Text style={styles.progressLabel}>Learning</Text>
        </View>
        <View style={styles.progressDivider} />
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>{currentCategoryDuas.length}</Text>
          <Text style={styles.progressLabel}>Total</Text>
        </View>
      </View>

      {/* Dua List */}
      <FlatList
        data={currentCategoryDuas}
        renderItem={renderDuaItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.duaList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="book-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyStateText}>No Duas found in this category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFBEB',
    borderBottomWidth: 1,
    borderBottomColor: '#FEF3C7',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  progressSummary: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    margin: 20,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  progressDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  duaList: {
    padding: 16,
    paddingTop: 0,
  },
  duaItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  duaContent: {
    flex: 1,
    marginRight: 12,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  duaReference: {
    fontSize: 14,
    color: '#64748B',
    fontStyle: 'italic',
  },
  duaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIcon: {
    marginRight: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  practiceButton: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
  },
});