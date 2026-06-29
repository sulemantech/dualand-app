import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TAB_BAR_BASE_HEIGHT } from '../../app/(tabs)/_layout';

interface ScreenWrapperProps {
  children: React.ReactNode;
  /**
   * Extra padding added on top of the automatic tab-bar clearance.
   * Only needed for screens with floating buttons sitting above the tab bar.
   */
  extraBottom?: number;
  style?: ViewStyle;
}

export function ScreenWrapper({ children, extraBottom = 0, style }: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: TAB_BAR_BASE_HEIGHT + insets.bottom + extraBottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
