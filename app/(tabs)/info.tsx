import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import {
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const THEME = {
  primary: '#FF6B9D',      // Softer Pink
  secondary: '#FFF7D0',    // Bright Lemon Yellow
  tertiary: '#E8F4FF',     // Softer Sky Blue
  neutral: '#FFFFFF',      // White
  accent: '#FFD166',       // Sunny Yellow
  success: '#4ECDC4',      // Mint Green
  header: '#fcf8b1',       // Yellow Header Color
  
  // Kid-Friendly Text Colors - Softer and Warmer
  text: {
    primary: '#2D4A63',    // Soft Blue-Gray - Easy on eyes
    secondary: '#6B7B8C',  // Warm Gray - Gentle contrast
    light: '#FFFFFF',      // White
    dark: '#4A5C6B',       // Soft Charcoal - Not too dark
    accent: '#E53E3E',     // Red accent for important text
  }
};

// Animated Feature Item Component
const AnimatedFeatureItem = ({ feature, emoji, delay = 0 }) => {
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
      <View style={styles.featureItem}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
        <Text style={styles.featureText}>{feature}</Text>
      </View>
    </Animated.View>
  );
};

// Header Component with Animation
const AnimatedHeader = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 6,
          useNativeDriver: true,
        })
      ]);

      animation.start();

      return () => {
        animation.stop();
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.8);
      };
    }, [fadeAnim, scaleAnim])
  );

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <View style={styles.header}>
        <LinearGradient
          colors={[THEME.secondary, '#9e904bff']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.headerEmoji}>📚</Text>
              <View>
                <Text style={styles.title}>About DuaLand</Text>
                <Text style={styles.subtitle}>Learn Beautiful Duas</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default function InfoScreen() {
  return (
    <ScreenWrapper bottomMargin={30}>
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
        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.description}>
            DuaLand is a beautiful app designed to help you learn and memorize Islamic prayers and supplications (Duas) in an engaging and interactive way.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>✨</Text>
            <Text style={styles.sectionTitle}>Amazing Features</Text>
          </View>
          
          <AnimatedFeatureItem 
            feature="Learn beautiful Duas with translations"
            emoji="🕌"
            delay={100}
          />
          <AnimatedFeatureItem 
            feature="Audio playback for proper pronunciation"
            emoji="🎵"
            delay={200}
          />
          <AnimatedFeatureItem 
            feature="Word-by-word learning mode"
            emoji="📖"
            delay={300}
          />
          <AnimatedFeatureItem 
            feature="Favorite your most-used Duas"
            emoji="⭐"
            delay={400}
          />
          <AnimatedFeatureItem 
            feature="Kid-friendly interface with animations"
            emoji="👶"
            delay={500}
          />
          <AnimatedFeatureItem 
            feature="Search and discover new Duas"
            emoji="🔍"
            delay={600}
          />
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>🎯</Text>
            <Text style={styles.sectionTitle}>Our Mission</Text>
          </View>
          <Text style={styles.missionText}>
            To make learning Islamic prayers accessible, engaging, and enjoyable for everyone, especially children and new Muslims.
          </Text>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>📞</Text>
            <Text style={styles.sectionTitle}>Contact & Support</Text>
          </View>
          <Text style={styles.contactText}>
            We'd love to hear from you! If you have any questions, feedback, or suggestions, please reach out to us:
          </Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactDetail}>📧 Email: support@dualand.app</Text>
            <Text style={styles.contactDetail}>🌐 Website: www.dualand.app</Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>ℹ️</Text>
            <Text style={styles.sectionTitle}>App Information</Text>
          </View>
          <View style={styles.appInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>January 2024</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Developed With</Text>
              <Text style={styles.infoValue}>❤️ & React Native</Text>
            </View>
          </View>
        </View>

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
    </ScreenWrapper>
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
    paddingTop: 20,
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
    textAlign: 'center',
    alignContent: 'center',
    color: THEME.text.dark,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.text.dark,
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
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
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  featureEmoji: {
    fontSize: 20,
    marginRight: 16,
    width: 30,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  missionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  contactInfo: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  contactDetail: {
    fontSize: 15,
    color: '#7C3AED',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  appInfo: {
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  infoLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#7C3AED',
    fontWeight: '600',
  },
  bottomPadding: {
    height: 20,
  },
});