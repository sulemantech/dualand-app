import { ScreenWrapper } from '@/components/common/ScreenWrapper';
import { useFocusEffect } from 'expo-router';
import Slider from '@react-native-community/slider';
import React, { useCallback, useRef, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useAppSettingsStore } from '../../stores/appSettingsStore';
import { useUserProgressStore } from '../../stores/userProgressStore';
import {
  Alert,
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../../components/ui/AppHeader';

const PURPLE = '#7E57C2';
const PURPLE_DARK = '#4527A0';
const PURPLE_LIGHT = '#EDE7F6';
const PURPLE_TINT = 'rgba(126,87,194,0.10)';

const T = {
  bg: '#F5F3FB',
  card: '#FFFFFF',
  border: '#EEEBF8',
  divider: '#F0EDF8',
  text: {
    primary: '#1A1A2E',
    secondary: '#6B7280',
    muted: '#A0AEC0',
  },
};

const LANGUAGE_OPTIONS = [
  { id: 'en', name: 'English',  emoji: '🇺🇸', available: true  },
  { id: 'ur', name: 'Urdu',     emoji: '🇵🇰', available: false },
  { id: 'ar', name: 'Arabic',   emoji: '🇸🇦', available: false },
  { id: 'hi', name: 'Hindi',    emoji: '🇮🇳', available: false },
];

// ─── Section ────────────────────────────────────────────────────────────────

const Section = ({
  title,
  icon,
  children,
  delay = 0,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  delay?: number;
}) => {
  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(16)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fade,  { toValue: 1, duration: 350, delay, useNativeDriver: true }),
        Animated.timing(slide, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
      ]).start();
      return () => { fade.setValue(0); slide.setValue(16); };
    }, [fade, slide, delay])
  );

  return (
    <Animated.View style={[styles.section, { opacity: fade, transform: [{ translateY: slide }] }]}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionIconWrap}>
          <Text style={styles.sectionIconText}>{icon}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.card}>{children}</View>
    </Animated.View>
  );
};

// ─── Row ─────────────────────────────────────────────────────────────────────

const Row = ({
  icon,
  title,
  subtitle,
  right,
  onPress,
  disabled = false,
  divider = true,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  divider?: boolean;
}) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      style={[
        styles.row,
        divider && styles.rowDivider,
        disabled && styles.rowDisabled,
        pressed && styles.rowPressed,
      ]}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled || !onPress}
      activeOpacity={1}
    >
      <View style={styles.rowIconWrap}>
        <Text style={styles.rowIcon}>{icon}</Text>
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {right ? <View style={styles.rowRight}>{right}</View> : null}
    </TouchableOpacity>
  );
};

// ─── Toggle row ──────────────────────────────────────────────────────────────

const ToggleRow = ({
  icon,
  title,
  subtitle,
  value,
  onChange,
  disabled = false,
  divider = true,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  divider?: boolean;
}) => (
  <Row
    icon={icon}
    title={title}
    subtitle={subtitle}
    disabled={disabled}
    divider={divider}
    onPress={disabled ? undefined : () => onChange(!value)}
    right={
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#D1D5DB', true: PURPLE }}
        thumbColor={value ? '#FFFFFF' : '#F3F4F6'}
        ios_backgroundColor="#D1D5DB"
        disabled={disabled}
      />
    }
  />
);

// ─── Font size picker ─────────────────────────────────────────────────────────

const FontSizePicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [preview, setPreview] = useState(value);

  // Sync local preview when persisted value loads from storage after mount
  React.useEffect(() => { setPreview(value); }, [value]);

  return (
    <View style={styles.fontRow}>
      <View style={styles.fontRowIconWrap}>
        <Text style={styles.rowIcon}>✏️</Text>
      </View>
      <View style={styles.fontTextBlock}>
        <View style={styles.fontRowHeader}>
          <Text style={styles.rowTitle}>Arabic Font Size</Text>
          <View style={styles.fontBadge}>
            <Text style={styles.fontBadgeText}>{preview}px</Text>
          </View>
        </View>

        {/* live Arabic preview */}
        <Text style={[styles.fontPreview, { fontSize: preview }]} numberOfLines={1}>
          بِسْمِ اللَّهِ
        </Text>

        <Slider
          style={styles.slider}
          minimumValue={16}
          maximumValue={38}
          step={1}
          value={preview}
          onValueChange={setPreview}
          onSlidingComplete={onChange}
          minimumTrackTintColor={PURPLE}
          maximumTrackTintColor={T.border}
          thumbTintColor={PURPLE}
        />

        <View style={styles.fontSliderLabels}>
          <Text style={styles.fontSliderLabel}>A</Text>
          <Text style={[styles.fontSliderLabel, { fontSize: 18 }]}>A</Text>
        </View>
      </View>
    </View>
  );
};

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const {
    language, arabicFontSize, darkMode, readDuaTitle, readDuaTranslation,
    autoPlayAudio, wordByWordPause, enableRewards,
    autoNextDuas, hapticFeedback, notifications,
    updateSetting,
  } = useAppSettingsStore(useShallow(s => s));

  const resetAllProgress = useUserProgressStore(s => s.resetAllProgress);

  const currentLang = LANGUAGE_OPTIONS.find(l => l.id === language);

  const handleSupport = useCallback((action: 'rate' | 'feedback' | 'help' | 'about') => {
    const map = {
      rate: [
        '⭐ Rate DuaLand',
        'Thank you for using DuaLand! If you enjoy the app, please consider rating us on the App Store.',
        [{ text: 'Maybe Later', style: 'cancel' as const }, { text: 'Rate Now', style: 'default' as const }],
      ],
      feedback: [
        '💌 Send Feedback',
        "We'd love to hear your thoughts! Your feedback helps us improve DuaLand for everyone.",
        [{ text: 'Cancel', style: 'cancel' as const }, { text: 'Send Feedback', style: 'default' as const }],
      ],
      help: [
        '❓ Help & Support',
        'Need help with DuaLand? Visit our help center or contact our support team.',
        [{ text: 'Cancel', style: 'cancel' as const }, { text: 'Get Help', style: 'default' as const }],
      ],
      about: [
        '📱 About DuaLand',
        'DuaLand v1.0.0\n\nA beautiful, kid-friendly app for learning and memorizing Islamic duas. Built with love for the Muslim community.',
        [{ text: 'Close', style: 'cancel' as const }],
      ],
    } as const;
    const [title, msg, buttons] = map[action];
    Alert.alert(title, msg, [...buttons]);
  }, []);

  return (
    <ScreenWrapper bottomMargin={70}>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="#7E57C2" />

        <AppHeader icon="⚙️" title="Settings" subtitle="Customize your experience" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Language & Display */}
          <Section title="Language & Display" icon="🌐" delay={80}>
            <Row
              icon="🌐"
              title="App Language"
              subtitle="Change the app display language"
              divider={true}
              onPress={() =>
                Alert.alert(
                  'Select Language',
                  'Choose your preferred language',
                  LANGUAGE_OPTIONS.map(lang => ({
                    text: `${lang.emoji} ${lang.name}${!lang.available ? ' (Coming Soon)' : ''}`,
                    onPress: lang.available ? () => updateSetting('language', lang.id) : undefined,
                    style: lang.available ? ('default' as const) : ('cancel' as const),
                  }))
                )
              }
              right={
                <View style={styles.langPill}>
                  <Text style={styles.langPillText}>
                    {currentLang?.emoji} {currentLang?.name}
                  </Text>
                  <Text style={styles.chevron}>›</Text>
                </View>
              }
            />
            <FontSizePicker
              value={arabicFontSize}
              onChange={v => updateSetting('arabicFontSize', v)}
            />
            <ToggleRow
              icon="🌙"
              title="Dark Mode"
              subtitle="Coming soon in the next update"
              value={darkMode}
              onChange={v => updateSetting('darkMode', v)}
              disabled
              divider={false}
            />
          </Section>

          {/* Audio & Playback */}
          <Section title="Audio & Playback" icon="🔊" delay={160}>
            <ToggleRow
              icon="📖"
              title="Read Dua Titles"
              subtitle="Announce dua titles automatically"
              value={readDuaTitle}
              onChange={v => updateSetting('readDuaTitle', v)}
            />
            <ToggleRow
              icon="🔤"
              title="Read Translations"
              subtitle="Read translation after Arabic"
              value={readDuaTranslation}
              onChange={v => updateSetting('readDuaTranslation', v)}
            />
            <ToggleRow
              icon="🎵"
              title="Auto-play Audio"
              subtitle="Play audio when opening a dua"
              value={autoPlayAudio}
              onChange={v => updateSetting('autoPlayAudio', v)}
            />
            <ToggleRow
              icon="⏸️"
              title="Word-by-Word Pause"
              subtitle="Pause between words for learning"
              value={wordByWordPause}
              onChange={v => updateSetting('wordByWordPause', v)}
              divider={true}
            />
            <Row
              icon="🎙️"
              title="Reciter Voice"
              subtitle="Multiple reciters coming soon"
              disabled
              divider={false}
              right={
                <View style={styles.soonBadge}>
                  <Text style={styles.soonText}>SOON</Text>
                </View>
              }
            />
          </Section>

          {/* Features */}
          <Section title="Features" icon="✨" delay={240}>
            <ToggleRow
              icon="🏆"
              title="Rewards System"
              subtitle="Earn rewards for completing duas"
              value={enableRewards}
              onChange={v => updateSetting('enableRewards', v)}
            />
            <ToggleRow
              icon="➡️"
              title="Auto Next Dua"
              subtitle="Automatically proceed to next dua"
              value={autoNextDuas}
              onChange={v => updateSetting('autoNextDuas', v)}
            />
            <ToggleRow
              icon="📳"
              title="Haptic Feedback"
              subtitle="Vibrate on interactions"
              value={hapticFeedback}
              onChange={v => updateSetting('hapticFeedback', v)}
            />
            <ToggleRow
              icon="🔔"
              title="Push Notifications"
              subtitle="Coming soon in the next update"
              value={notifications}
              onChange={v => updateSetting('notifications', v)}
              disabled
              divider={false}
            />
          </Section>

          {/* App Info */}
          <Section title="App Information" icon="📱" delay={320}>
            {[
              { label: 'Version',    value: '1.0.0'        },
              { label: 'Duas',       value: '43'           },
              { label: 'Categories', value: '32'           },
              { label: 'Platform',   value: 'iOS / Android'},
            ].map((item, i, arr) => (
              <View
                key={item.label}
                style={[styles.infoRow, i < arr.length - 1 && styles.rowDivider]}
              >
                <Text style={styles.infoLabel}>{item.label}</Text>
                <View style={styles.infoBadge}>
                  <Text style={styles.infoBadgeText}>{item.value}</Text>
                </View>
              </View>
            ))}
          </Section>

          {/* Support */}
          <Section title="Support" icon="❤️" delay={400}>
            <Row icon="⭐" title="Rate DuaLand"   subtitle="Share your experience" onPress={() => handleSupport('rate')}     />
            <Row icon="💌" title="Send Feedback"  subtitle="Help us improve the app" onPress={() => handleSupport('feedback')} />
            <Row icon="❓" title="Help & Support" subtitle="Get help with the app"  onPress={() => handleSupport('help')}     />
            <Row icon="📱" title="About DuaLand"  subtitle="Learn more about the app" onPress={() => handleSupport('about')} divider={false} />
          </Section>

          {/* Reset — destructive, standalone */}
          <TouchableOpacity
            style={styles.resetButton}
            activeOpacity={0.75}
            onPress={() =>
              Alert.alert(
                'Reset Progress',
                'This will clear all your favorites and memorization progress. This cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', style: 'destructive', onPress: () => resetAllProgress() },
                ]
              )
            }
          >
            <Text style={styles.resetIcon}>🔄</Text>
            <Text style={styles.resetText}>Reset All Progress</Text>
          </TouchableOpacity>

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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },

  // Section
  section: {
    marginBottom: 20,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PURPLE_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sectionIconText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.text.primary,
    letterSpacing: 0.1,
  },
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: PURPLE_DARK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: T.card,
    minHeight: 60,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.divider,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  rowPressed: {
    backgroundColor: PURPLE_LIGHT,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: PURPLE_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  rowIcon: {
    fontSize: 17,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: T.text.primary,
    marginBottom: 1,
  },
  rowSub: {
    fontSize: 13,
    color: T.text.secondary,
    lineHeight: 17,
  },
  rowRight: {
    marginLeft: 12,
    flexShrink: 0,
  },

  // Language pill
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURPLE_TINT,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 4,
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },
  chevron: {
    fontSize: 16,
    color: PURPLE,
    fontWeight: '700',
  },

  // Font size picker
  fontRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: T.divider,
    backgroundColor: T.card,
  },
  fontRowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: PURPLE_TINT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  fontTextBlock: {
    flex: 1,
  },
  fontRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fontBadge: {
    backgroundColor: PURPLE_TINT,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  fontBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: PURPLE,
  },
  fontPreview: {
    color: T.text.primary,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 36,
    marginVertical: 2,
  },
  fontSliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -2,
  },
  fontSliderLabel: {
    fontSize: 13,
    color: T.text.muted,
    fontWeight: '600',
  },

  // Coming soon badge
  soonBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  soonText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 0.5,
  },

  // App info rows
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: T.card,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: T.text.primary,
  },
  infoBadge: {
    backgroundColor: PURPLE_TINT,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  infoBadgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: PURPLE,
  },

  // Reset button
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 0,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 8,
  },
  resetIcon: {
    fontSize: 16,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerHeart: {
    fontSize: 14,
    color: T.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  footerVersion: {
    fontSize: 12,
    color: T.text.muted,
    textAlign: 'center',
  },
});
