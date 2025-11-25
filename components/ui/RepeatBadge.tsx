import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text } from 'react-native';

const THEME = {
  primary: '#FF9A3D',
  accent: '#FFD166',
  text: {
    light: '#FFFFFF',
  },
};

interface RepeatBadgeProps {
  mode: string;
  isVisible: boolean;
}

export const RepeatBadge: React.FC<RepeatBadgeProps> = ({ mode, isVisible }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 0,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          })
        ]).start();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, mode]);

  if (!isVisible) return null;

  const getBadgeColors = () => {
    switch (mode) {
      case '1': return ['#4ECDC4', '#26C6DA'];
      case '2': return ['#FFD166', '#FFB347'];
      case '3': return ['#FF6B6B', '#FF8E8E'];
      case 'infinite': return ['#7E57C2', '#9C77D9'];
      default: return [THEME.primary, THEME.accent];
    }
  };

  const getBadgeText = () => {
    switch (mode) {
      case '1': return 'Repeat 1x';
      case '2': return 'Repeat 2x';
      case '3': return 'Repeat 3x';
      case 'infinite': return 'Repeat ∞';
      default: return 'Repeat';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={getBadgeColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.text}>{getBadgeText()}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  gradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text.light,
  },
});