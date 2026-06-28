import { Tabs } from 'expo-router';
import { Animated, Easing, Platform, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';

const PURPLE = '#7E57C2';
const WHITE  = '#FFFFFF';

// Per-tab colour palette — all in the purple/violet family for cohesion
const TAB_COLORS = {
  home:     { from: '#7E57C2', to: '#4527A0', pulse: '#7E57C2' },
  tracker:  { from: '#5C6BC0', to: '#3949AB', pulse: '#5C6BC0' },
  learn:    { from: '#8E24AA', to: '#6A1B9A', pulse: '#8E24AA' },
  settings: { from: '#5E35B1', to: '#311B92', pulse: '#5E35B1' },
};

// ─── Shared constants ─────────────────────────────────────────────────────────

const ICON_ACTIVE   = 50;
const ICON_INACTIVE = 44;

// ─── Regular tab icon ─────────────────────────────────────────────────────────

const TabIcon = ({
  emoji,
  label,
  focused,
  colors,
}: {
  emoji: string;
  label: string;
  focused: boolean;
  colors: { from: string; to: string; pulse: string };
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const lift  = useRef(new Animated.Value(0)).current;
  const glow  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1.12, tension: 300, friction: 6,  useNativeDriver: true }),
        Animated.spring(lift,  { toValue: -5,   tension: 240, friction: 7,  useNativeDriver: true }),
        Animated.timing(glow,  { toValue: 1, duration: 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
      // gentle float once settled
      Animated.loop(
        Animated.sequence([
          Animated.timing(lift, { toValue: -7, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(lift, { toValue: -5, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 260, friction: 7, useNativeDriver: true }),
        Animated.spring(lift,  { toValue: 0, tension: 240, friction: 7, useNativeDriver: true }),
        Animated.timing(glow,  { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    }
  }, [focused]);

  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0,    0.30] });
  const bgOpacity   = glow.interpolate({ inputRange: [0, 1], outputRange: [0,    0.12] });
  const labelColor  = focused ? colors.from : '#B0BEC5';
  const labelWeight = focused ? '700' : '500';

  return (
    <View style={styles.iconWrap}>
      {/* ambient glow */}
      <Animated.View style={[styles.glow,   { backgroundColor: colors.pulse, opacity: glowOpacity }]} />
      <Animated.View style={[styles.bgPill, { backgroundColor: colors.pulse, opacity: bgOpacity   }]} />

      <Animated.View style={{ transform: [{ translateY: lift }, { scale }] }}>
        {focused ? (
          <LinearGradient
            colors={[colors.from, colors.to]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.circleActive}
          >
            <Text style={styles.emojiActive}>{emoji}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.circleInactive}>
            <Text style={styles.emojiInactive}>{emoji}</Text>
          </View>
        )}
      </Animated.View>

      {/* active indicator dot */}
      <Animated.View style={[styles.dot, { backgroundColor: colors.from, opacity: glow }]} />

      <Text style={[styles.label, { color: labelColor, fontWeight: labelWeight }]}>
        {label}
      </Text>
    </View>
  );
};

// ─── Home tab icon (always has a gradient circle, more prominent) ─────────────

const HomeTabIcon = ({ focused }: { focused: boolean }) => {
  const scale  = useRef(new Animated.Value(1)).current;
  const lift   = useRef(new Animated.Value(0)).current;
  const glow   = useRef(new Animated.Value(0.2)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(scale,  { toValue: 1.18, tension: 280, friction: 5,  useNativeDriver: true }),
        Animated.spring(lift,   { toValue: -6,   tension: 220, friction: 6,  useNativeDriver: true }),
        Animated.timing(glow,   { toValue: 1, duration: 260, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 1, duration: 420, easing: Easing.out(Easing.back), useNativeDriver: true }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(lift, { toValue: -9, duration: 950, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(lift, { toValue: -6, duration: 950, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.spring(scale,  { toValue: 1,   tension: 260, friction: 7, useNativeDriver: true }),
        Animated.spring(lift,   { toValue: 0,   tension: 220, friction: 7, useNativeDriver: true }),
        Animated.timing(glow,   { toValue: 0.2, duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.timing(rotate, { toValue: 0,   duration: 200, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }
  }, [focused]);

  const deg         = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const glowOpacity = glow.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.45] });
  const labelOpacity = glow.interpolate({ inputRange: [0.2, 1], outputRange: [0.55, 1] });

  return (
    <View style={styles.homeWrap}>
      {/* ambient glow — always visible, just brighter when focused */}
      <Animated.View style={[styles.homeGlow, { opacity: glowOpacity }]} />

      <Animated.View style={{ transform: [{ translateY: lift }, { scale }, { rotate: deg }] }}>
        <LinearGradient
          colors={[TAB_COLORS.home.from, TAB_COLORS.home.to]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.homeCircle, focused && styles.homeCircleFocused]}
        >
          <Text style={styles.homeEmoji}>🏠</Text>
        </LinearGradient>
      </Animated.View>

      {/* sparkle stars when focused */}
      {focused && (
        <>
          <Animated.View style={[styles.star1, { opacity: glow, transform: [{ scale }] }]}>
            <LinearGradient colors={[TAB_COLORS.home.from, TAB_COLORS.home.to]} style={styles.starGrad}>
              <Text style={styles.starEmoji}>✨</Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View style={[styles.star2, { opacity: glow, transform: [{ scale }] }]}>
            <LinearGradient colors={[TAB_COLORS.home.from, TAB_COLORS.home.to]} style={styles.starGrad}>
              <Text style={styles.starEmoji}>🌟</Text>
            </LinearGradient>
          </Animated.View>
        </>
      )}

      <Animated.Text style={[styles.homeLabel, { opacity: labelOpacity }]}>Home</Animated.Text>
    </View>
  );
};

// ─── Tab layout ───────────────────────────────────────────────────────────────

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="index"
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
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
        }}
      />

      <Tabs.Screen
        name="tracker"
        options={{
          title: 'Tracker',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="Tracker" focused={focused} colors={TAB_COLORS.tracker} />
          ),
        }}
      />

      <Tabs.Screen
        name="info"
        options={{
          title: 'Inspire',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💡" label="Inspire" focused={focused} colors={TAB_COLORS.learn} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Settings" focused={focused} colors={TAB_COLORS.settings} />
          ),
        }}
      />
    </Tabs>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === 'ios' ? 94 : 82,
    borderTopWidth: 0,
    backgroundColor: WHITE,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 24,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.13,
    shadowRadius: 18,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 4,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(126,87,194,0.10)',
  },

  // ── Regular tab ──
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 76,
    paddingVertical: 4,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: -4,
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  bgPill: {
    position: 'absolute',
    top: -2,
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  circleActive: {
    width: ICON_ACTIVE,
    height: ICON_ACTIVE,
    borderRadius: ICON_ACTIVE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.88)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 7,
  },
  circleInactive: {
    width: ICON_INACTIVE,
    height: ICON_INACTIVE,
    borderRadius: ICON_INACTIVE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1.5,
    borderColor: 'rgba(126,87,194,0.18)',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  emojiActive: {
    fontSize: 20,
  },
  emojiInactive: {
    fontSize: 18,
    opacity: 0.78,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 3,
    marginBottom: 1,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.1,
  },

  // ── Home tab ──
  homeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 76,
    paddingVertical: 4,
    position: 'relative',
  },
  homeGlow: {
    position: 'absolute',
    top: -6,
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: PURPLE,
  },
  homeCircle: {
    width: ICON_ACTIVE + 4,
    height: ICON_ACTIVE + 4,
    borderRadius: (ICON_ACTIVE + 4) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.90)',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 10,
  },
  homeCircleFocused: {
    borderWidth: 3,
    borderColor: WHITE,
  },
  homeEmoji: {
    fontSize: 22,
  },
  homeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: PURPLE,
    marginTop: 4,
    letterSpacing: 0.1,
  },
  star1: {
    position: 'absolute',
    top: -3,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  star2: {
    position: 'absolute',
    top: -3,
    left: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  starGrad: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  starEmoji: {
    fontSize: 11,
  },
});
