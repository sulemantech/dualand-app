import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThumbnailPlaceholderProps {
  categoryId: string;
  color: string;
  icon: string;
}

export const ThumbnailPlaceholder: React.FC<ThumbnailPlaceholderProps> = ({ 
  categoryId, 
  color, 
  icon 
}) => {
  const getGradientColors = (categoryId: string) => {
    const gradients: { [key: string]: [string, string] } = {
      '1': ['#FFD700', '#FFA500'], // Praise - Gold to Orange
      '2': ['#4A90E2', '#357ABD'], // Prophet - Blue gradient
      '3': ['#FF6B6B', '#FF4757'], // Morning - Red gradient
      '4': ['#9B59B6', '#8E44AD'], // Evening - Purple gradient
      '5': ['#2ECC71', '#27AE60'], // Protection - Green gradient
      '6': ['#F39C12', '#E67E22'], // Sleeping - Orange gradient
    };
    return gradients[categoryId] || ['#95A5A6', '#7F8C8D'];
  };

  const getIconName = (icon: string): keyof typeof Ionicons.glyphMap => {
    const iconMap: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      star: 'star',
      sunny: 'sunny',
      moon: 'moon',
      shield: 'shield',
      bed: 'bed',
      alarm: 'alarm',
      'partly-sunny': 'partly-sunny',
    };
    return iconMap[icon] || 'star';
  };

  const [color1, color2] = getGradientColors(categoryId);

  return (
    <View style={[styles.container, { 
      backgroundColor: color1,
      borderBottomColor: color2,
    }]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={getIconName(icon)} 
          size={32} 
          color="#FFFFFF" 
        />
      </View>
      <View style={[styles.gradientOverlay, { backgroundColor: color2 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 20,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    opacity: 0.6,
  },
});