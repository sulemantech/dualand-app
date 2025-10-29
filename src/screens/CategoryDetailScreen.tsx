import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
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
        return { icon: 'checkmark-circle' as const, color: '#2D7D46' };
      case 'learning':
        return { icon: 'book' as const, color: '#3182CE' };
      default:
        return { icon: 'ellipse-outline' as const, color: '#A0AEC0' };
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
              color={item.is_favorited ? '#E53E3E' : '#A0AEC0'} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.practiceButton}>
            <Text style={styles.practiceButtonText}>Practice Now</Text>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Ionicons 
            name={currentCategory.icon as keyof typeof Ionicons.glyphMap} 
            size={24} 
            color={currentCategory.color} 
          />
          <Text style={styles.headerTitle}>{currentCategory.name}</Text>
        </View>
        
        <View style={styles.placeholder} />
      </View>

      {/* Progress Summary */}
      <View style={styles.progressSummary}>
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>
            {currentCategoryDuas.filter(d => d.memorization_status === 'memorized').length}
          </Text>
          <Text style={styles.progressLabel}>Memorized</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>
            {currentCategoryDuas.filter(d => d.memorization_status === 'learning').length}
          </Text>
          <Text style={styles.progressLabel}>Learning</Text>
        </View>
        <View style={styles.progressItem}>
          <Text style={styles.progressNumber}>
            {currentCategoryDuas.length}
          </Text>
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
            <Ionicons name="book-outline" size={48} color="#A0AEC0" />
            <Text style={styles.emptyStateText}>No Duas found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  placeholder: {
    width: 32,
  },
  progressSummary: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#718096',
    textTransform: 'uppercase',
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
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  duaContent: {
    flex: 1,
    marginRight: 12,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 4,
  },
  duaReference: {
    fontSize: 14,
    color: '#718096',
  },
  duaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIcon: {
    marginRight: 4,
  },
  favoriteButton: {
    padding: 4,
  },
  practiceButton: {
    backgroundColor: '#2D7D46',
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
    color: '#718096',
  },
});