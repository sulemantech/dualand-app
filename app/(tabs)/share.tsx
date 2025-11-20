import React, { useRef, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Animated,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { ScreenWrapper } from '@/components/common/ScreenWrapper';
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
// Animated Benefit Item Component
const AnimatedBenefitItem = ({ benefit, emoji, delay = 0 }) => {
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
      <View style={styles.benefitItem}>
        <Text style={styles.benefitEmoji}>{emoji}</Text>
        <Text style={styles.benefitText}>{benefit}</Text>
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
          colors={[THEME.header, '#fef9c3']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.headerEmoji}>🌟</Text>
              <View>
                <Text style={styles.title}>Share DuaLand</Text>
                <Text style={styles.subtitle}>Spread the Blessings</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );
};

export default function ShareScreen() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleShare = () => {
    // Animation when share button is pressed
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      })
    ]).start();

    Alert.alert(
      'Share DuaLand 🌟', 
      'Spread the blessings by sharing this app with your loved ones!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Share Now', style: 'default' }
      ]
    );
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

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
        {/* Main Content */}
        <View style={styles.mainSection}>
          <Text style={styles.description}>
            Spread the blessings by sharing this app with your loved ones. Help others discover the beauty of Islamic prayers and supplications.
          </Text>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#EC4899', '#DB2777']}
                style={styles.shareButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.shareButtonEmoji}>↗️</Text>
                <Text style={styles.shareButtonText}>Share App</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>💫</Text>
            <Text style={styles.sectionTitle}>Benefits of Sharing</Text>
          </View>
          
          <AnimatedBenefitItem 
            benefit="Spread Islamic knowledge and blessings"
            emoji="📚"
            delay={200}
          />
          <AnimatedBenefitItem 
            benefit="Help others learn beautiful Duas"
            emoji="🕌"
            delay={300}
          />
          <AnimatedBenefitItem 
            benefit="Earn rewards for sharing beneficial knowledge"
            emoji="🎁"
            delay={400}
          />
          <AnimatedBenefitItem 
            benefit="Build a community of learners"
            emoji="👥"
            delay={500}
          />
          <AnimatedBenefitItem 
            benefit="Multiply your good deeds"
            emoji="⭐"
            delay={600}
          />
        </View>

        {/* Sharing Tips Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionEmoji}>💡</Text>
            <Text style={styles.sectionTitle}>Sharing Tips</Text>
          </View>
          
          <View style={styles.tipItem}>
            <Text style={styles.tipEmoji}>📱</Text>
            <Text style={styles.tipText}>Share with family and friends via messaging apps</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipEmoji}>👨‍👩‍👧‍👦</Text>
            <Text style={styles.tipText}>Recommend to your local community and mosque</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipEmoji}>🌍</Text>
            <Text style={styles.tipText}>Share on social media to reach more people</Text>
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
  mainSection: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
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
    marginBottom: 30,
    fontWeight: '500',
  },
  shareButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  shareButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  shareButtonEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
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
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  benefitEmoji: {
    fontSize: 20,
    marginRight: 16,
    width: 30,
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
    lineHeight: 22,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  tipEmoji: {
    fontSize: 18,
    marginRight: 16,
    width: 30,
  },
  tipText: {
    fontSize: 15,
    color: '#4b5563',
    flex: 1,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});