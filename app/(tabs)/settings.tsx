import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  Switch, 
  ScrollView, 
  StyleSheet, 
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';

const { width } = Dimensions.get('window');

// Simplified Animated Setting Item Component
const AnimatedSettingItem = ({ 
  title, 
  description, 
  value, 
  onValueChange,
  emoji,
  delay = 0
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(fadeAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          })
        ])
      ]);

      animation.start();

      return () => {
        animation.stop();
        fadeAnim.setValue(0);
        slideAnim.setValue(50);
      };
    }, [fadeAnim, slideAnim, delay])
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: slideAnim }],
      }}
    >
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => onValueChange(!value)}
        activeOpacity={0.8}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingEmoji}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </View>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            <Text style={styles.settingDescription}>{description}</Text>
          </View>
        </View>
        
        <View style={styles.switchContainer}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#d1d5db', true: '#8B5CF6' }}
            thumbColor={value ? '#ffffff' : '#f3f4f6'}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Simplified Info Item Component
const AnimatedInfoItem = ({ label, value, emoji, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(fadeAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 60,
            friction: 5,
            useNativeDriver: true,
          })
        ])
      ]);

      animation.start();

      return () => {
        animation.stop();
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.9);
      };
    }, [fadeAnim, scaleAnim, delay])
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <View style={styles.infoItem}>
        <View style={styles.infoLeft}>
          <Text style={styles.infoEmoji}>{emoji}</Text>
          <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <View style={styles.infoValueContainer}>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Header Component with Animation
const AnimatedHeader = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        })
      ]);

      animation.start();

      return () => {
        animation.stop();
        fadeAnim.setValue(0);
        slideAnim.setValue(-100);
      };
    }, [fadeAnim, slideAnim])
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.headerEmoji}>⚡</Text>
              <View>
                <Text style={styles.title}>Power Settings</Text>
                <Text style={styles.subtitle}>Customize DuaLand</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {/* Background */}
      <View style={styles.background} />

      {/* Header */}
      <AnimatedHeader />

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>⚙️</Text>
            <Text style={styles.sectionTitle}>Preferences</Text>
          </View>
          
          <AnimatedSettingItem
            title="Notifications"
            description="Receive prayer reminders and updates"
            value={notifications}
            onValueChange={setNotifications}
            emoji="🔔"
            delay={100}
          />
          
          <AnimatedSettingItem
            title="Dark Mode"
            description="Switch to dark theme"
            value={darkMode}
            onValueChange={setDarkMode}
            emoji="🌙"
            delay={200}
          />
          
          <AnimatedSettingItem
            title="Auto-play Audio"
            description="Automatically play Dua audio"
            value={autoPlay}
            onValueChange={setAutoPlay}
            emoji="🎵"
            delay={300}
          />
          
          <AnimatedSettingItem
            title="Haptic Feedback"
            description="Vibrate on interactions"
            value={hapticFeedback}
            onValueChange={setHapticFeedback}
            emoji="📱"
            delay={400}
          />
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>📱</Text>
            <Text style={styles.sectionTitle}>App Information</Text>
          </View>
          
          <AnimatedInfoItem 
            label="Version" 
            value="1.0.0"
            emoji="🏷️"
            delay={500}
          />
          <AnimatedInfoItem 
            label="Last Updated" 
            value="January 2024"
            emoji="📅"
            delay={600}
          />
          <AnimatedInfoItem 
            label="Build Number" 
            value="2024.01.001"
            emoji="🔢"
            delay={700}
          />
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>🚀</Text>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#EC4899' }]}>
                <Text style={styles.actionEmoji}>❤️</Text>
              </View>
              <Text style={styles.actionText}>Rate App</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
                <Text style={styles.actionEmoji}>↗️</Text>
              </View>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
                <Text style={styles.actionEmoji}>❓</Text>
              </View>
              <Text style={styles.actionText}>Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#F0F9FF',
  },
  header: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingEmoji: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emojiText: {
    fontSize: 20,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  switchContainer: {
    marginLeft: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoEmoji: {
    fontSize: 18,
    marginRight: 12,
    opacity: 0.7,
  },
  infoLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  infoValueContainer: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  infoValue: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#7C3AED',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 20,
  },
});