import { Tabs } from 'expo-router';
import { View, Text, Animated, StyleSheet, Easing, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useEffect } from 'react';

// Updated theme to match home screen
const THEME = {
  primary: '#7E57C2',      // Vibrant Purple - Fun and energetic
  secondary: '#FFF7D0',    // Bright Lemon Yellow
  tertiary: '#E8F4FF',     // Softer Sky Blue
  neutral: '#FFFFFF',      // White
  accent: '#26C6DA',       // Bright Teal - Fresh and modern
  success: '#4ECDC4',      // Mint Green
  text: {
    primary: '#2D3748',    // Soft Dark
    secondary: '#718096',  // Soft Gray
    light: '#FFFFFF',      // White
  }
};

// Enhanced Tab Icon with Smoother Animations
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
  const bgShadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Faster, smoother focused animation
      Animated.parallel([
        Animated.spring(bounceAnim, {
          toValue: 1,
          tension: 300,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 250,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bgShadeAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(floatAnim, {
          toValue: 1,
          tension: 150,
          friction: 6,
          useNativeDriver: true,
        }),
      ]).start();

      // Smoother continuous floating animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Smoother, faster reset
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 250,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(bounceAnim, {
          toValue: 0,
          tension: 250,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(floatAnim, {
          toValue: 0,
          tension: 200,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bgShadeAnim, {
          toValue: 0,
          duration: 150,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const translateY = Animated.add(
    bounceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -6],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1, 1.05],
      outputRange: [0, -3, -4],
    })
  );

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  const bgShadeOpacity = bgShadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  const bgShadeScale = bgShadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <View style={styles.tabIconContainer}>
      {/* Background Shade Effect */}
      <Animated.View
        style={[
          styles.bgShade,
          {
            backgroundColor: pulseColor,
            opacity: bgShadeOpacity,
            transform: [
              { scale: bgShadeScale },
              { translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -1]
              })}
            ],
          }
        ]}
      />
      
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
      <Animated.View style={{ 
        transform: [{ 
          translateY: floatAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -1]
          }) 
        }] 
      }}>
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

      {/* Active Indicator Star with Gradient */}
      {focused && (
        <Animated.View
          style={[
            styles.activeStar,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: floatAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2]
                })}
              ],
            }
          ]}
        >
          <LinearGradient
            colors={gradientColors}
            style={styles.starGradient}
          >
            <Text style={styles.starText}>⭐</Text>
          </LinearGradient>
        </Animated.View>
      )}
    </View>
  );
};

// Enhanced Central Floating Tab Icon with Smoother Animations
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
  const floatAnim = useRef(new Animated.Value(0)).current;
  const bgShadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Smoother, faster focused animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          tension: 250,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.spring(elevateAnim, {
          toValue: 1,
          tension: 180,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(floatAnim, {
          toValue: 1,
          tension: 150,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(bgShadeAnim, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Smoother continuous floating
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1.08,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Smoother, faster reset
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 250,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(elevateAnim, {
          toValue: 0,
          tension: 180,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(floatAnim, {
          toValue: 0,
          tension: 200,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(bgShadeAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const translateY = Animated.add(
    elevateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -8],
    }),
    floatAnim.interpolate({
      inputRange: [0, 1, 1.08],
      outputRange: [0, -4, -5],
    })
  );

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 0.8],
  });

  const bgShadeOpacity = bgShadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.2],
  });

  const shadowRadius = elevateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 20],
  });

  return (
    <View style={styles.floatingContainer}>
      {/* Enhanced Background Shade */}
      <Animated.View
        style={[
          styles.floatingBgShade,
          {
            opacity: bgShadeOpacity,
            transform: [
              { scale: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1.2]
              })},
              { translateY: floatAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -2]
              })}
            ],
          }
        ]}
      />
      
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
            colors={[THEME.primary, '#8B6BC9']}
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
          transform: [{ 
            translateY: floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -2]
            }) 
          }],
        }}
      >
        <Text style={styles.floatingLabel}>
          {label}
        </Text>
      </Animated.View>

      {/* Floating Stars with Gradient */}
      {focused && (
        <>
          <Animated.View
            style={[
              styles.floatingStar1,
              {
                opacity: elevateAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -3]
                  })}
                ],
              }
            ]}
          >
            <LinearGradient
              colors={[THEME.primary, '#8B6BC9']}
              style={styles.starGradient}
            >
              <Text style={styles.starText}>✨</Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View
            style={[
              styles.floatingStar2,
              {
                opacity: elevateAnim,
                transform: [
                  { scale: scaleAnim },
                  { translateY: floatAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -3]
                  })}
                ],
              }
            ]}
          >
            <LinearGradient
              colors={[THEME.primary, '#8B6BC9']}
              style={styles.starGradient}
            >
              <Text style={styles.starText}>🌟</Text>
            </LinearGradient>
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
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ focused }) => (
            <SuperTabIcon 
              emoji="📊" 
              label="Tracker" 
              focused={focused}
              gradientColors={[THEME.primary, '#3a8dfd']}
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
              gradientColors={[THEME.secondary, '#9e904bff']}
              pulseColor="#8B5CF6"
            />
          ),
        }}
      />
      
      {/* CENTER: Home Screen */}
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
              gradientColors={[THEME.accent, '#1FB4C8']}
              pulseColor={THEME.accent}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <SuperTabIcon 
              emoji="⚙️" 
              label="Settings" 
              focused={focused}
              gradientColors={['#FF9E7D', '#FF6B9D']}
              pulseColor="#FF9E7D"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 95 : 85, // Increased height for iOS
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
    paddingBottom: Platform.OS === 'ios' ? 30 : 15, // ✅ ADDED PADDING - Critical fix!
    paddingTop: 8, // ✅ ADDED TOP PADDING
    borderWidth: 1,
    borderColor: `${THEME.primary}20`,
  },
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
    width: 70,
    marginBottom: Platform.OS === 'ios' ? 5 : 0, // ✅ ADDED MARGIN for iOS
  },
  // Background shade for regular tabs
  bgShade: {
    position: 'absolute',
    top: -2,
    width: 52,
    height: 52,
    borderRadius: 26,
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
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  starGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
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
    marginBottom: Platform.OS === 'ios' ? 5 : 0, // ✅ ADDED MARGIN for iOS
  },
  // Background shade for floating tab
  floatingBgShade: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: THEME.primary,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  floatingStar2: {
    position: 'absolute',
    top: -5,
    left: 45,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});