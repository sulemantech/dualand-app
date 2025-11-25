import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Enhanced Theme System
const THEME = {
  primary: '#FF9A3D',
  primaryLight: '#FFB366',
  primaryDark: '#CC7A29',
  secondary: '#FFF7D0',
  tertiary: '#F8FAFF',
  neutral: '#FFFFFF',
  accent: '#FFD166',
  success: '#4ECDC4',
  error: '#FF6B6B',
  warning: '#FFD166',
  header: '#fcf8b1',
  
  text: {
    primary: '#1A1F36',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    light: '#FFFFFF',
    inverted: '#FFFFFF',
  },
  
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFF',
    tertiary: '#F1F5F9',
    card: '#FFFFFF',
  },
  
  border: {
    light: '#F3F4F6',
    medium: '#E5E7EB',
    dark: '#D1D5DB',
  }
};

// Voice Options with enhanced metadata
const VOICE_OPTIONS = [
  { 
    id: '1', 
    name: 'Arabic (Male)', 
    language: 'ar',
    quality: 'Premium',
    emoji: '👨‍💼'
  },
  { 
    id: '2', 
    name: 'Arabic (Female)', 
    language: 'ar',
    quality: 'Premium',
    emoji: '👩‍💼'
  },
  { 
    id: '3', 
    name: 'English Voice', 
    language: 'en',
    quality: 'Standard',
    emoji: '🔊'
  },
  { 
    id: '4', 
    name: 'Urdu Voice', 
    language: 'ur',
    quality: 'Standard',
    emoji: '🗣️'
  },
];

// Language Options
const LANGUAGE_OPTIONS = [
  { id: 'en', name: 'English', available: true, emoji: '🇺🇸' },
  { id: 'ur', name: 'Urdu', available: false, emoji: '🇵🇰' },
  { id: 'ar', name: 'Arabic', available: false, emoji: '🇸🇦' },
  { id: 'hi', name: 'Hindi', available: false, emoji: '🇮🇳' },
];

// Enhanced Section Component
const SettingsSection = ({ title, icon, children, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useFocusEffect(
    useCallback(() => {
      const animation = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          delay,
          useNativeDriver: true,
        })
      ]);

      animation.start();

      return () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
      };
    }, [fadeAnim, slideAnim, delay])
  );

  return (
    <Animated.View
      style={[
        styles.sectionContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcon}>
          <Text style={styles.sectionIconText}>{icon}</Text>
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </Animated.View>
  );
};

// Enhanced Setting Row Component
const SettingRow = ({ 
  title, 
  subtitle,
  icon,
  rightElement,
  onPress,
  disabled = false,
  showDivider = true,
  isFirst = false,
  isLast = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  return (
    <TouchableOpacity
      style={[
        styles.settingRow,
        isFirst && styles.settingRowFirst,
        isLast && styles.settingRowLast,
        showDivider && !isLast && styles.settingRowWithDivider,
        disabled && styles.settingRowDisabled,
        isPressed && styles.settingRowPressed,
      ]}
      onPress={onPress}
      disabled={disabled || !onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <View style={styles.settingLeft}>
        {icon && (
          <View style={[
            styles.settingIcon,
            disabled && styles.settingIconDisabled
          ]}>
            <Text style={styles.settingIconText}>{icon}</Text>
          </View>
        )}
        <View style={styles.settingTextContainer}>
          <Text style={[
            styles.settingTitle,
            disabled && styles.settingTitleDisabled
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[
              styles.settingSubtitle,
              disabled && styles.settingSubtitleDisabled
            ]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {rightElement}
      </View>
    </TouchableOpacity>
  );
};

// Enhanced Switch Component
const SettingSwitch = ({ 
  title, 
  subtitle, 
  icon,
  value, 
  onValueChange,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    
    onValueChange(!value);
  };

  return (
    <SettingRow
      title={title}
      subtitle={subtitle}
      icon={icon}
      onPress={handlePress}
      disabled={disabled}
      rightElement={
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ 
              false: THEME.border.light, 
              true: THEME.primaryLight 
            }}
            thumbColor={value ? THEME.primary : THEME.neutral}
            ios_backgroundColor={THEME.border.light}
            disabled={disabled}
          />
        </Animated.View>
      }
    />
  );
};

// Language Selector Component
const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const currentLang = LANGUAGE_OPTIONS.find(lang => lang.id === currentLanguage);

  return (
    <View>
      <SettingRow
        title="App Language"
        subtitle="Change the app display language"
        icon="🌐"
        onPress={() => {
          Alert.alert(
            'Select Language',
            'Choose your preferred language',
            LANGUAGE_OPTIONS.map(lang => ({
              text: `${lang.emoji} ${lang.name}${!lang.available ? ' (Coming Soon)' : ''}`,
              onPress: lang.available ? () => onLanguageChange(lang.id) : null,
              style: lang.available ? 'default' : 'cancel',
            }))
          );
        }}
        rightElement={
          <View style={styles.languageSelector}>
            <Text style={styles.currentLanguage}>
              {currentLang?.emoji} {currentLang?.name}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        }
      />
    </View>
  );
};

// Voice Selector Component
const VoiceSelector = ({ selectedVoice, onVoiceSelect }) => {
  return (
    <View style={styles.voiceSection}>
      <Text style={styles.voiceSectionTitle}>Select Voice</Text>
      {VOICE_OPTIONS.map((voice, index) => (
        <TouchableOpacity
          key={voice.id}
          style={[
            styles.voiceOption,
            index === VOICE_OPTIONS.length - 1 && styles.voiceOptionLast,
            selectedVoice.id === voice.id && styles.voiceOptionSelected,
          ]}
          onPress={() => onVoiceSelect(voice)}
        >
          <View style={styles.voiceInfo}>
            <View style={styles.voiceEmojiContainer}>
              <Text style={styles.voiceEmoji}>{voice.emoji}</Text>
            </View>
            <View style={styles.voiceDetails}>
              <Text style={styles.voiceName}>{voice.name}</Text>
              <Text style={styles.voiceMeta}>
                {voice.language.toUpperCase()} • {voice.quality}
              </Text>
            </View>
          </View>
          
          {selectedVoice.id === voice.id && (
            <View style={styles.voiceSelectedIndicator}>
              <View style={styles.voiceSelectedDot} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Font Size Selector Component
const FontSizeSelector = ({ size, onSizeChange }) => {
  return (
    <View style={styles.fontSizeContainer}>
      <View style={styles.fontSizeHeader}>
        <Text style={styles.fontSizeLabel}>Arabic Font Size</Text>
        <Text style={styles.fontSizeValue}>{size.toFixed(1)}</Text>
      </View>
      
      <View style={styles.fontSizeSliderContainer}>
        <View style={styles.fontSizeLabels}>
          <Text style={styles.fontSizeMinMax}>A</Text>
          <Text style={styles.fontSizeMinMax}>A</Text>
        </View>
        
        <View style={styles.fontSizeSlider}>
          {[16, 20, 24, 28, 32].map((fontSize) => (
            <TouchableOpacity
              key={fontSize}
              style={[
                styles.fontSizeOption,
                size >= fontSize && styles.fontSizeOptionActive,
              ]}
              onPress={() => onSizeChange(fontSize)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// Data Management Section
const DataManagementSection = ({ onExport, onImport, onViewInfo, isExporting }) => {
  return (
    <View style={styles.dataManagementGrid}>
      <TouchableOpacity
        style={[styles.dataActionCard, isExporting && styles.dataActionCardDisabled]}
        onPress={onExport}
        disabled={isExporting}
      >
        <View style={[styles.dataActionIcon, { backgroundColor: '#10B981' }]}>
          {isExporting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.dataActionIconText}>💾</Text>
          )}
        </View>
        <Text style={styles.dataActionTitle}>
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Text>
        <Text style={styles.dataActionDescription}>
          Backup your progress and settings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dataActionCard}
        onPress={onViewInfo}
      >
        <View style={[styles.dataActionIcon, { backgroundColor: '#8B5CF6' }]}>
          <Text style={styles.dataActionIconText}>📊</Text>
        </View>
        <Text style={styles.dataActionTitle}>Database Info</Text>
        <Text style={styles.dataActionDescription}>
          View storage and usage statistics
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.dataActionCard, styles.dataActionCardDisabled]}
        onPress={onImport}
        disabled
      >
        <View style={[styles.dataActionIcon, { backgroundColor: '#6B7280' }]}>
          <Text style={styles.dataActionIconText}>📥</Text>
        </View>
        <Text style={styles.dataActionTitle}>Import Data</Text>
        <Text style={styles.dataActionDescription}>
          Coming in next update
        </Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>SOON</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dataActionCard}
        onPress={() => Alert.alert('Reset Data', 'This will reset all your progress. Are you sure?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Reset', style: 'destructive' },
        ])}
      >
        <View style={[styles.dataActionIcon, { backgroundColor: '#EF4444' }]}>
          <Text style={styles.dataActionIconText}>🔄</Text>
        </View>
        <Text style={styles.dataActionTitle}>Reset Data</Text>
        <Text style={styles.dataActionDescription}>
          Clear all progress and start fresh
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Enhanced Header Component
const SettingsHeader = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ]).start();
    }, [fadeAnim, slideAnim])
  );

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={['#FF9E7D', '#FF6B9D']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>⚙️</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              Customize your DuaLand experience
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Main Settings Screen Component
export default function EnhancedSettingsScreen() {
  const [settings, setSettings] = useState({
    // Language & Display
    language: 'en',
    arabicFontSize: 24,
    darkMode: false,
    
    // Audio & Playback
    readDuaTitle: true,
    readDuaTranslation: true,
    autoPlayAudio: true,
    wordByWordPause: true,
    pauseDuration: 2,
    selectedVoice: VOICE_OPTIONS[0],
    
    // Features
    enableRewards: true,
    autoNextDuas: false,
    hapticFeedback: true,
    notifications: true,
    
    // Data
    cloudSync: false,
  });

  const [isExporting, setIsExporting] = useState(false);

  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    Alert.alert(
      '✅ Export Complete',
      'Your DuaLand data has been successfully exported and saved to your device.',
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

  const handleImport = useCallback(() => {
    Alert.alert(
      '🚧 Coming Soon',
      'The data import feature will be available in our next major update. Stay tuned!',
      [{ text: 'Got It', style: 'default' }]
    );
  }, []);

  const handleViewInfo = useCallback(() => {
    Alert.alert(
      '📊 Database Information',
      'Here\'s your current data usage:\n\n• Total Duas: 142\n• Categories: 32\n• Favorites: 12\n• Storage Used: 45.2 MB\n• Last Backup: Today, 14:30',
      [{ text: 'Close', style: 'cancel' }]
    );
  }, []);

  const handleSupport = useCallback((action) => {
    const actions = {
      rate: () => Alert.alert(
        '⭐ Rate DuaLand',
        'Thank you for using DuaLand! If you enjoy the app, please consider rating us on the App Store.',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Rate Now', style: 'default' }
        ]
      ),
      feedback: () => Alert.alert(
        '💌 Send Feedback',
        'We\'d love to hear your thoughts! Your feedback helps us improve DuaLand for everyone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Send Feedback', style: 'default' }
        ]
      ),
      help: () => Alert.alert(
        '❓ Help & Support',
        'Need help with DuaLand? Visit our help center or contact our support team.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Get Help', style: 'default' }
        ]
      ),
      about: () => Alert.alert(
        '📱 About DuaLand',
        'DuaLand v1.4.2\n\nA beautiful, kid-friendly app for learning and memorizing Islamic duas. Built with love for the Muslim community.',
        [{ text: 'Close', style: 'cancel' }]
      )
    };
    
    actions[action]?.();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      
      {/* Header */}
      <SettingsHeader />

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Language & Display */}
        <SettingsSection title="Language & Display" icon="🌐" delay={100}>
          <LanguageSelector
            currentLanguage={settings.language}
            onLanguageChange={(lang) => updateSetting('language', lang)}
          />
          <FontSizeSelector
            size={settings.arabicFontSize}
            onSizeChange={(size) => updateSetting('arabicFontSize', size)}
          />
          <SettingSwitch
            title="Dark Mode"
            subtitle="Switch to dark theme"
            icon="🌙"
            value={settings.darkMode}
            onValueChange={(value) => updateSetting('darkMode', value)}
          />
        </SettingsSection>

        {/* Audio & Playback */}
        <SettingsSection title="Audio & Playback" icon="🔊" delay={200}>
          <SettingSwitch
            title="Read Dua Titles"
            subtitle="Announce dua titles automatically"
            icon="📖"
            value={settings.readDuaTitle}
            onValueChange={(value) => updateSetting('readDuaTitle', value)}
          />
          <SettingSwitch
            title="Read Translations"
            subtitle="Read translation after Arabic"
            icon="🔤"
            value={settings.readDuaTranslation}
            onValueChange={(value) => updateSetting('readDuaTranslation', value)}
          />
          <SettingSwitch
            title="Auto-play Audio"
            subtitle="Play audio when opening a dua"
            icon="🎵"
            value={settings.autoPlayAudio}
            onValueChange={(value) => updateSetting('autoPlayAudio', value)}
          />
          <SettingSwitch
            title="Word-by-Word Pause"
            subtitle="Pause between words for learning"
            icon="⏸️"
            value={settings.wordByWordPause}
            onValueChange={(value) => updateSetting('wordByWordPause', value)}
          />
          <VoiceSelector
            selectedVoice={settings.selectedVoice}
            onVoiceSelect={(voice) => updateSetting('selectedVoice', voice)}
          />
        </SettingsSection>

        {/* Features */}
        <SettingsSection title="Features" icon="✨" delay={300}>
          <SettingSwitch
            title="Rewards System"
            subtitle="Earn rewards for completing duas"
            icon="🏆"
            value={settings.enableRewards}
            onValueChange={(value) => updateSetting('enableRewards', value)}
          />
          <SettingSwitch
            title="Auto Next Dua"
            subtitle="Automatically proceed to next dua"
            icon="➡️"
            value={settings.autoNextDuas}
            onValueChange={(value) => updateSetting('autoNextDuas', value)}
          />
          <SettingSwitch
            title="Haptic Feedback"
            subtitle="Vibrate on interactions"
            icon="📱"
            value={settings.hapticFeedback}
            onValueChange={(value) => updateSetting('hapticFeedback', value)}
          />
          <SettingSwitch
            title="Push Notifications"
            subtitle="Receive reminders and updates"
            icon="🔔"
            value={settings.notifications}
            onValueChange={(value) => updateSetting('notifications', value)}
          />
        </SettingsSection>

        {/* Data Management */}
        <SettingsSection title="Data Management" icon="💾" delay={400}>
          <DataManagementSection
            onExport={handleExport}
            onImport={handleImport}
            onViewInfo={handleViewInfo}
            isExporting={isExporting}
          />
        </SettingsSection>

        {/* App Information */}
        <SettingsSection title="App Information" icon="📱" delay={500}>
          <View style={styles.appInfoGrid}>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Version</Text>
              <Text style={styles.appInfoValue}>1.4.2</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Build</Text>
              <Text style={styles.appInfoValue}>2024.02.1</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Last Updated</Text>
              <Text style={styles.appInfoValue}>Feb 15, 2024</Text>
            </View>
            <View style={styles.appInfoItem}>
              <Text style={styles.appInfoLabel}>Storage</Text>
              <Text style={styles.appInfoValue}>62.3 MB</Text>
            </View>
          </View>
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support" icon="❤️" delay={600}>
          <SettingRow
            title="Rate DuaLand"
            subtitle="Share your experience with us"
            icon="⭐"
            onPress={() => handleSupport('rate')}
          />
          <SettingRow
            title="Send Feedback"
            subtitle="Help us improve the app"
            icon="💌"
            onPress={() => handleSupport('feedback')}
          />
          <SettingRow
            title="Help & Support"
            subtitle="Get help with the app"
            icon="❓"
            onPress={() => handleSupport('help')}
          />
          <SettingRow
            title="About DuaLand"
            subtitle="Learn more about the app"
            icon="📱"
            onPress={() => handleSupport('about')}
          />
        </SettingsSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for the Muslim Ummah
          </Text>
          <Text style={styles.footerSubtext}>
            DuaLand v1.4.2 • © 2024
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerIconText: {
    fontSize: 28,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.text.inverted,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionIconText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.text.primary,
  },
  sectionContent: {
    backgroundColor: THEME.background.card,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: THEME.background.card,
    minHeight: 68,
  },
  settingRowFirst: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  settingRowLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  settingRowWithDivider: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.border.light,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  settingRowPressed: {
    backgroundColor: THEME.background.tertiary,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingIconDisabled: {
    backgroundColor: THEME.border.light,
  },
  settingIconText: {
    fontSize: 18,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  settingTitleDisabled: {
    color: THEME.text.tertiary,
  },
  settingSubtitle: {
    fontSize: 14,
    color: THEME.text.secondary,
    lineHeight: 18,
  },
  settingSubtitleDisabled: {
    color: THEME.text.tertiary,
  },
  settingRight: {
    marginLeft: 12,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentLanguage: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.primary,
    marginRight: 4,
  },
  chevron: {
    fontSize: 16,
    color: THEME.primary,
    fontWeight: 'bold',
  },
  fontSizeContainer: {
    padding: 20,
  },
  fontSizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  fontSizeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
  },
  fontSizeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primary,
    backgroundColor: THEME.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  fontSizeSliderContainer: {
    marginTop: 8,
  },
  fontSizeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fontSizeMinMax: {
    fontSize: 14,
    color: THEME.text.secondary,
    fontWeight: '500',
  },
  fontSizeSlider: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: THEME.border.light,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fontSizeOption: {
    flex: 1,
    height: 4,
    backgroundColor: THEME.border.light,
    marginHorizontal: 1,
  },
  fontSizeOptionActive: {
    backgroundColor: THEME.primary,
  },
  voiceSection: {
    paddingVertical: 8,
  },
  voiceSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text.secondary,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  voiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: THEME.background.card,
  },
  voiceOptionLast: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  voiceOptionSelected: {
    backgroundColor: THEME.primary + '08',
  },
  voiceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  voiceEmojiContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  voiceEmoji: {
    fontSize: 20,
  },
  voiceDetails: {
    flex: 1,
  },
  voiceName: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 2,
  },
  voiceMeta: {
    fontSize: 13,
    color: THEME.text.secondary,
  },
  voiceSelectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: THEME.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceSelectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.primary,
  },
  dataManagementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 12,
  },
  dataActionCard: {
    width: (width - 64) / 2,
    backgroundColor: THEME.background.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dataActionCardDisabled: {
    opacity: 0.6,
  },
  dataActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dataActionIconText: {
    fontSize: 20,
  },
  dataActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text.primary,
    marginBottom: 4,
  },
  dataActionDescription: {
    fontSize: 13,
    color: THEME.text.secondary,
    lineHeight: 16,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: THEME.warning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  appInfoGrid: {
    padding: 16,
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border.light,
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  appInfoLabel: {
    fontSize: 15,
    color: THEME.text.primary,
    fontWeight: '500',
  },
  appInfoValue: {
    fontSize: 15,
    color: THEME.primary,
    fontWeight: '600',
    backgroundColor: THEME.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    color: THEME.text.secondary,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 14,
    color: THEME.text.tertiary,
    textAlign: 'center',
  },
});