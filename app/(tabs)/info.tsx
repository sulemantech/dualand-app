import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/ui/AppHeader';

const { width } = Dimensions.get('window');
const CARD_GAP  = 12;
const GRID_PAD  = 16;
const GRID_ITEM = (width - GRID_PAD * 2 - CARD_GAP) / 2;

const PURPLE      = '#7E57C2';
const PURPLE_DARK = '#4527A0';
const PURPLE_DEEP = '#1A0A5C';
const PURPLE_TINT = 'rgba(126,87,194,0.09)';
const PURPLE_BORD = 'rgba(126,87,194,0.14)';

const T = {
  bg:   '#F5F3FB',
  card: '#FFFFFF',
  text: { primary: '#1A1A2E', secondary: '#6B7280', muted: '#A0AEC0', white: '#FFFFFF' },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 43,  suffix: '',  label: 'Duas'       },
  { value: 32,  suffix: '',  label: 'Categories' },
  { value: 200, suffix: '+', label: 'Audio Files' },
];

const FEATURES = [
  { emoji: '🕌', title: '43 Duas',       desc: 'Complete collection across 32 categories' },
  { emoji: '🎵', title: 'Audio',          desc: 'Listen for perfect pronunciation'        },
  { emoji: '📖', title: 'Word by Word',   desc: 'Learn letter by letter at your pace'     },
  { emoji: '⭐', title: 'Favourites',     desc: 'Save and revisit your top duas'          },
  { emoji: '🔍', title: 'Search',         desc: 'Find any dua instantly'                  },
  { emoji: '📊', title: 'Track Progress', desc: 'See how far you\'ve come'               },
];

// ─── Animated count-up stat ──────────────────────────────────────────────────

const StatCounter = ({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  delay?: number;
}) => {
  const [display, setDisplay] = useState(0);
  const fade  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.7)).current;

  useFocusEffect(
    useCallback(() => {
      setDisplay(0);
      const timer = setTimeout(() => {
        const duration = 900;
        const steps    = 40;
        const interval = duration / steps;
        let step       = 0;
        const id = setInterval(() => {
          step++;
          const progress = step / steps;
          // ease-out curve
          setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
          if (step >= steps) clearInterval(id);
        }, interval);
        Animated.parallel([
          Animated.timing(fade,  { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.spring(scale, { toValue: 1, tension: 160, friction: 7, useNativeDriver: true }),
        ]).start();
        return () => clearInterval(id);
      }, delay);
      return () => {
        clearTimeout(timer);
        setDisplay(0);
        fade.setValue(0);
        scale.setValue(0.7);
      };
    }, [value, delay])
  );

  return (
    <Animated.View style={[styles.statCell, { opacity: fade, transform: [{ scale }] }]}>
      <Text style={styles.statNumber}>
        {display}{suffix}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
};

// ─── Feature grid card ────────────────────────────────────────────────────────

const FeatureCard = ({
  emoji,
  title,
  desc,
  delay = 0,
}: {
  emoji: string;
  title: string;
  desc: string;
  delay?: number;
}) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 380, delay, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, tension: 100, friction: 10, delay, useNativeDriver: true }),
      ]).start();
      return () => { fade.setValue(0); slide.setValue(20); };
    }, [delay])
  );

  return (
    <Animated.View style={[styles.featureCard, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={styles.featureIconWrap}>
        <Text style={styles.featureEmoji}>{emoji}</Text>
      </View>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDesc}>{desc}</Text>
    </Animated.View>
  );
};

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function InspireScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleShare = () => {
    Alert.alert(
      '🌟 Share DuaLand',
      'Every person you share with is a continuous act of sadaqah jariyah — a reward that keeps giving long after this life.',
      [
        { text: 'Maybe Later', style: 'cancel'  },
        { text: 'Share Now',   style: 'default' },
      ]
    );
  };

  const handleSharePressIn = () =>
    Animated.spring(scaleAnim, { toValue: 0.96, tension: 200, friction: 6, useNativeDriver: true }).start();

  const handleSharePressOut = () =>
    Animated.spring(scaleAnim, { toValue: 1, tension: 200, friction: 6, useNativeDriver: true }).start();

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.screen} edges={['top']}>

        <AppHeader icon="💡" title="Inspire" subtitle="Knowledge & Community" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* ── 1. Hadith Hero ─────────────────────────────────────────── */}
          <LinearGradient
            colors={[PURPLE, PURPLE_DARK]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            {/* decorative circles */}
            <View style={styles.heroBubble1} />
            <View style={styles.heroBubble2} />

            <Text style={styles.heroLabel}>HADITH</Text>
            <Text style={styles.heroArabic}>
              طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
            </Text>
            <View style={styles.heroDivider} />
            <Text style={styles.heroEnglish}>
              "Seeking knowledge is an obligation{'\n'}upon every Muslim."
            </Text>
            <Text style={styles.heroSource}>— Ibn Mājah</Text>
          </LinearGradient>

          {/* ── 2. Live Stats ──────────────────────────────────────────── */}
          <View style={styles.statsCard}>
            {STATS.map((s, i) => (
              <React.Fragment key={s.label}>
                <StatCounter value={s.value} suffix={s.suffix} label={s.label} delay={i * 120} />
                {i < STATS.length - 1 && <View style={styles.statSep} />}
              </React.Fragment>
            ))}
            {/* progress bar — fill proportional to duas memorised (decorative) */}
            <View style={styles.statsProgressTrack}>
              <LinearGradient
                colors={[PURPLE, '#22C55E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ height: 3, width: '65%', borderRadius: 2 }}
              />
            </View>
          </View>

          {/* ── 3. Feature Grid ────────────────────────────────────────── */}
          <View style={styles.sectionHead}>
            <View style={styles.sectionIconWrap}>
              <Text style={styles.sectionIcon}>✨</Text>
            </View>
            <Text style={styles.sectionTitle}>What's Inside</Text>
          </View>

          <View style={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <FeatureCard
                key={f.title}
                emoji={f.emoji}
                title={f.title}
                desc={f.desc}
                delay={100 + i * 70}
              />
            ))}
          </View>

          {/* ── 4. Sadaqah Jariyah Share CTA ───────────────────────────── */}
          <LinearGradient
            colors={[PURPLE_DARK, PURPLE_DEEP]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shareCta}
          >
            <View style={styles.shareCtaBubble1} />
            <View style={styles.shareCtaBubble2} />

            <Text style={styles.shareCtaIcon}>🤲</Text>
            <Text style={styles.shareCtaHeading}>Earn Sadaqah Jariyah</Text>
            <Text style={styles.shareCtaBody}>
              Every person who learns a dua through your share earns you
              continuous reward — long after this life.
            </Text>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.shareCtaButton}
                onPress={handleShare}
                onPressIn={handleSharePressIn}
                onPressOut={handleSharePressOut}
                activeOpacity={1}
              >
                <Text style={styles.shareCtaButtonText}>↗  Share DuaLand</Text>
              </TouchableOpacity>
            </Animated.View>
          </LinearGradient>

          {/* ── 5. Contact ─────────────────────────────────────────────── */}
          <View style={styles.contactCard}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionIconWrap}>
                <Text style={styles.sectionIcon}>📞</Text>
              </View>
              <Text style={styles.sectionTitle}>Get in Touch</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📧</Text>
              <Text style={styles.contactText}>support@dualand.app</Text>
            </View>
            <View style={[styles.contactRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.contactIcon}>🌐</Text>
              <Text style={styles.contactText}>www.dualand.app</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerHeart}>Made with ❤️ for the Muslim Ummah</Text>
            <Text style={styles.footerVersion}>DuaLand v1.0.0 • © 2025</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: GRID_PAD,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ── Hero ──
  heroCard: {
    borderRadius: 22,
    padding: 28,
    marginBottom: 14,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: PURPLE_DARK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 8,
  },
  heroBubble1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -50,
    right: -40,
  },
  heroBubble2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30,
    left: -20,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 14,
  },
  heroArabic: {
    fontSize: 22,
    color: T.text.white,
    textAlign: 'center',
    lineHeight: 36,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroDivider: {
    width: 40,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginVertical: 16,
  },
  heroEnglish: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.90)',
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  heroSource: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // ── Stats ──
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: T.card,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: PURPLE_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: PURPLE,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: T.text.muted,
    fontWeight: '600',
    marginTop: 3,
    letterSpacing: 0.2,
  },
  statSep: {
    width: 1,
    height: 36,
    backgroundColor: PURPLE_BORD,
  },
  statsProgressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#EDE7F6',
  },

  // ── Section heading ──
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: PURPLE_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  sectionIcon: { fontSize: 15 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text.primary,
  },

  // ── Feature grid ──
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: 20,
  },
  featureCard: {
    width: GRID_ITEM,
    backgroundColor: T.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: PURPLE_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PURPLE_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  featureEmoji: { fontSize: 20 },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.text.primary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: T.text.secondary,
    lineHeight: 17,
  },

  // ── Sadaqah Jariyah CTA ──
  shareCta: {
    borderRadius: 22,
    padding: 28,
    marginBottom: 20,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: PURPLE_DEEP,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  shareCtaBubble1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    left: -50,
  },
  shareCtaBubble2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -30,
    right: -20,
  },
  shareCtaIcon: {
    fontSize: 40,
    marginBottom: 14,
  },
  shareCtaHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: T.text.white,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  shareCtaBody: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  shareCtaButton: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 32,
  },
  shareCtaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: T.text.white,
    letterSpacing: 0.3,
  },

  // ── Contact ──
  contactCard: {
    backgroundColor: T.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 8,
    shadowColor: PURPLE_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: PURPLE_BORD,
    gap: 12,
  },
  contactIcon: { fontSize: 18 },
  contactText: {
    fontSize: 14,
    fontWeight: '600',
    color: PURPLE,
  },

  // ── Footer ──
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  footerHeart: {
    fontSize: 14,
    color: T.text.secondary,
    fontWeight: '500',
  },
  footerVersion: {
    fontSize: 12,
    color: T.text.muted,
  },
});
