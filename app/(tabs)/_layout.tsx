import { Tabs } from 'expo-router';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';

// Supercharged Tab Icon with Advanced Animations
const SuperTabIcon = ({ 
  emoji, 
  label, 
  focused,
  gradientColors,
  pulseColor 
}: { 
  emoji: string; 
  label: string; 
  focused: boolean;
  gradientColors: string[];
  pulseColor: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Focused animation sequence
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          tension: 150,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 0.7,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Reset animations when not focused
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <View style={styles.tabIconContainer}>
      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glowEffect,
          {
            backgroundColor: pulseColor,
            opacity: glowOpacity,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      />
      
      {/* Main Icon Container */}
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        {focused ? (
          <LinearGradient
            colors={gradientColors}
            style={styles.focusedIcon}
          >
            <Text style={styles.focusedEmoji}>
              {emoji}
            </Text>
          </LinearGradient>
        ) : (
          <View style={styles.unfocusedIcon}>
            <Text style={styles.unfocusedEmoji}>
              {emoji}
            </Text>
          </View>
        )}
      </Animated.View>

      {/* Label */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Text style={[
          styles.tabLabel,
          { color: focused ? gradientColors[1] : '#6B7280' }
        ]}>
          {label}
        </Text>
      </Animated.View>

      {/* Active Indicator Dot */}
      {focused && (
        <Animated.View
          style={[
            styles.activeDot,
            {
              backgroundColor: gradientColors[1],
              transform: [{ scale: scaleAnim }],
            }
          ]}
        />
      )}
    </View>
  );
};

// Professional Floating Tab Icon that aligns with others
const FloatingTabIcon = ({ 
  emoji, 
  label, 
  focused 
}: { 
  emoji: string; 
  label: string; 
  focused: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const elevateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Professional focused animation - elevated with glow
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.4,
          tension: 180,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(elevateAnim, {
          toValue: 1,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Subtle continuous breathing animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.35,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Smooth reset to normal state
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 180,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.spring(elevateAnim, {
          toValue: 0,
          tension: 120,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const translateY = elevateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const shadowRadius = elevateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 24],
  });

  const shadowOpacity = elevateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.8],
  });

  return (
    <View style={styles.floatingContainer}>
      {/* Enhanced Glow Effect */}
      <Animated.View
        style={[
          styles.floatingGlow,
          {
            opacity: glowOpacity,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      />
      
      {/* Main Floating Button */}
      <Animated.View
        style={{
          transform: [{ translateY }, { scale: scaleAnim }],
        }}
      >
        <Animated.View
          style={[
            styles.floatingButton,
            {
              shadowRadius: shadowRadius,
              shadowOpacity: shadowOpacity,
            }
          ]}
        >
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
            style={styles.floatingButtonGradient}
          >
            <Text style={styles.floatingEmoji}>
              {emoji}
            </Text>
          </LinearGradient>
        </Animated.View>
      </Animated.View>

      {/* Professional Label */}
      <Animated.View
        style={{
          opacity: elevateAnim,
          transform: [{ translateY }],
        }}
      >
        <Text style={styles.floatingLabel}>
          {label}
        </Text>
      </Animated.View>

      {/* Subtle Active Indicator */}
      {focused && (
        <Animated.View
          style={[
            styles.floatingActiveDot,
            {
              opacity: elevateAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        />
      )}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="info"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => (
            <SuperTabIcon 
              emoji="📚" 
              label="Learn" 
              focused={focused}
              gradientColors={['#EC4899', '#DB2777']}
              pulseColor="#EC4899"
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <FloatingTabIcon 
              emoji="🏠" 
              label="Home" 
              focused={focused} 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="share"
        options={{
          title: 'Share',
          tabBarIcon: ({ focused }) => (
            <SuperTabIcon 
              emoji="🌟" 
              label="Share" 
              focused={focused}
              gradientColors={['#F59E0B', '#D97706']}
              pulseColor="#F59E0B"
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Power',
          tabBarIcon: ({ focused }) => (
            <SuperTabIcon 
              emoji="⚡" 
              label="Power" 
              focused={focused}
              gradientColors={['#10B981', '#059669']}
              pulseColor="#10B981"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    borderTopWidth: 0,
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
    width: 70,
  },
  glowEffect: {
    position: 'absolute',
    top: -5,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  focusedIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  unfocusedIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  focusedEmoji: {
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  unfocusedEmoji: {
    fontSize: 18,
    opacity: 0.8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  floatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -15,
    width: 70,
  },
  floatingGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B5CF6',
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    overflow: 'hidden',
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingEmoji: {
    fontSize: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  floatingLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginTop: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  floatingActiveDot: {
    position: 'absolute',
    bottom: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});