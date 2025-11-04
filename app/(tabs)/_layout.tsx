import { Tabs } from 'expo-router';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';

// Updated theme to match home screen
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

// Enhanced Tab Icon with Kid-Friendly Animations
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
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Bouncy focused animation sequence
      Animated.sequence([
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 200,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1.2,
            tension: 150,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Continuous playful animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Smooth reset to normal state
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
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

  const translateY = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
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
          transform: [{ translateY }, { scale: scaleAnim }],
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
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Text style={[
          styles.tabLabel,
          { 
            color: focused ? gradientColors[1] : THEME.text.secondary,
            fontWeight: focused ? 'bold' : '600'
          }
        ]}>
          {label}
        </Text>
      </Animated.View>

      {/* Active Indicator Star */}
      {focused && (
        <Animated.View
          style={[
            styles.activeStar,
            {
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <Text style={styles.starText}>⭐</Text>
        </Animated.View>
      )}
    </View>
  );
};

// Central Floating Tab Icon matching home screen theme
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
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Exciting focused animation with rotation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
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
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous playful animations
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.25,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1.3,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]),
        ])
      ).start();
    } else {
      // Smooth reset
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
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const translateY = elevateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.6],
  });

  const shadowRadius = elevateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 20],
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
          transform: [{ translateY }, { scale: scaleAnim }, { rotate }],
        }}
      >
        <Animated.View
          style={[
            styles.floatingButton,
            {
              shadowRadius: shadowRadius,
            }
          ]}
        >
          <LinearGradient
            colors={[THEME.primary, '#FF8BB5']}
            style={styles.floatingButtonGradient}
          >
            <Text style={styles.floatingEmoji}>
              {emoji}
            </Text>
          </LinearGradient>
        </Animated.View>
      </Animated.View>

      {/* Fun Label */}
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

      {/* Floating Stars */}
      {focused && (
        <>
          <Animated.View
            style={[
              styles.floatingStar1,
              {
                opacity: elevateAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <Text style={styles.starText}>✨</Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.floatingStar2,
              {
                opacity: elevateAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <Text style={styles.starText}>🌟</Text>
          </Animated.View>
        </>
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
      
      {/* NEW: Tracker Screen */}
      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ focused }) => (
            <SuperTabIcon 
              emoji="📊" 
              label="Tracker" 
              focused={focused}
              gradientColors={[THEME.success, '#3BB4A8']}
              pulseColor={THEME.success}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="info"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => (
            <SuperTabIcon 
              emoji="📚" 
              label="Learn" 
              focused={focused}
              gradientColors={['#8B5CF6', '#7C3AED']}
              pulseColor="#8B5CF6"
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
              gradientColors={[THEME.accent, '#FFC145']}
              pulseColor={THEME.accent}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 85,
    borderTopWidth: 0,
    backgroundColor: THEME.neutral,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: `${THEME.primary}20`,
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
    top: -4,
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  focusedIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  unfocusedIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 2,
    borderColor: `${THEME.primary}30`,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  focusedEmoji: {
    fontSize: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  unfocusedEmoji: {
    fontSize: 16,
    opacity: 0.8,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  activeStar: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starText: {
    fontSize: 12,
  },
  floatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: -18,
    width: 70,
  },
  floatingGlow: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: THEME.primary,
  },
  floatingButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    elevation: 15,
    overflow: 'hidden',
  },
  floatingButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingEmoji: {
    fontSize: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  floatingLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.primary,
    marginTop: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  floatingStar1: {
    position: 'absolute',
    top: -5,
    right: 45,
  },
  floatingStar2: {
    position: 'absolute',
    top: -5,
    left: 45,
  },
});