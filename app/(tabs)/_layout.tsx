import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PURPLE = '#7E57C2';
const WHITE  = '#FFFFFF';

export const TAB_BAR_BASE_HEIGHT = 72;

const TAB_COLORS = {
  home:     { from: '#7E57C2', to: '#4527A0' },
  tracker:  { from: '#5C6BC0', to: '#3949AB' },
  learn:    { from: '#8E24AA', to: '#6A1B9A' },
  settings: { from: '#5E35B1', to: '#311B92' },
};

// ─── Tab icon ─────────────────────────────────────────────────────────────────

const TabIcon = ({
  emoji,
  label,
  focused,
  colors,
}: {
  emoji: string;
  label: string;
  focused: boolean;
  colors: { from: string; to: string };
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.1 : 1,
      tension: 320,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
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

      {focused && <View style={[styles.dot, { backgroundColor: colors.from }]} />}

      <Text style={[
        styles.label,
        { color: focused ? colors.from : '#B0BEC5', fontWeight: focused ? '700' : '500' },
      ]}>
        {label}
      </Text>
    </View>
  );
};

// ─── Home tab icon (slightly larger, always gradient) ─────────────────────────

const HomeTabIcon = ({ focused }: { focused: boolean }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1.12 : 1,
      tension: 320,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [focused]);

  return (
    <View style={styles.homeWrap}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={focused ? [TAB_COLORS.home.from, TAB_COLORS.home.to] : ['#EDE7F6', '#D1C4E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.homeCircle, !focused && styles.homeCircleInactive]}
        >
          <Text style={focused ? styles.emojiActive : styles.emojiInactive}>🏠</Text>
        </LinearGradient>
      </Animated.View>

      {focused && <View style={[styles.dot, { backgroundColor: PURPLE }]} />}

      <Text style={[
        styles.label,
        { color: focused ? PURPLE : '#B0BEC5', fontWeight: focused ? '700' : '500' },
      ]}>
        Home
      </Text>
    </View>
  );
};

// ─── Tab layout ───────────────────────────────────────────────────────────────

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'visible',
        },
        tabBarIconStyle: {
          width: '100%',
          alignItems: 'center',
          overflow: 'visible',
        },
        tabBarStyle: {
          height: TAB_BAR_BASE_HEIGHT + bottomInset,
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
          paddingHorizontal: 4,
          paddingBottom: Platform.OS === 'android'
            ? Math.max(bottomInset, 20)
            : bottomInset + 4,
          paddingTop: 6,
        },
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
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  circleActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.88)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  circleInactive: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    opacity: 0.75,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 3,
    marginBottom: 1,
  },
  label: {
    fontSize: 10,
    letterSpacing: 0.1,
  },

  homeWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  homeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.90)',
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  homeCircleInactive: {
    borderColor: 'rgba(126,87,194,0.20)',
    shadowOpacity: 0.06,
  },
});
