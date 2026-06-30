import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

interface AppHeaderProps {
  icon?: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  icon,
  title,
  subtitle,
  rightElement,
}) => {
  // Reactive — updates on iPad rotation and split-screen resize
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Side slot width matches the icon circle so the text block is perfectly centered.
  const SIDE_SIZE = isTablet ? 56 : 46;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#7E57C2', '#4527A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            paddingTop:        isTablet ? 20 : 14,
            paddingBottom:     isTablet ? 24 : 18,
            paddingHorizontal: isTablet ? 32 : 20,
          },
        ]}
      >
        <View style={styles.content}>
          {/* Left: icon circle — hidden when no icon provided */}
          {icon ? (
            <View
              style={[
                styles.iconCircle,
                { width: SIDE_SIZE, height: SIDE_SIZE, borderRadius: SIDE_SIZE / 2 },
              ]}
            >
              <Text style={[styles.icon, { fontSize: isTablet ? 28 : 22 }]}>{icon}</Text>
            </View>
          ) : (
            <View style={{ width: SIDE_SIZE, height: SIDE_SIZE }} />
          )}

          {/* Center: title + subtitle */}
          <View style={styles.textBlock}>
            <Text
              style={[styles.title, { fontSize: isTablet ? 26 : 22 }]}
              numberOfLines={1}
            >
              {title}
            </Text>
            {subtitle ? (
              <Text
                style={[styles.subtitle, { fontSize: isTablet ? 14 : 12 }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Right: same width as icon so text stays centered */}
          <View style={[styles.rightSlot, { width: SIDE_SIZE, height: SIDE_SIZE }]}>
            {rightElement ?? null}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    shadowColor: '#4527A0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    // paddingTop/Bottom/Horizontal are set inline (responsive)
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    // fontSize set inline
  },
  textBlock: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: 'mochiypopp',
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    marginTop: 2,
    fontWeight: '500',
    textAlign: 'center',
  },
  rightSlot: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
