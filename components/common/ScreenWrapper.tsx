// components/ScreenWrapper.tsx
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWrapperProps {
  children: React.ReactNode;
  bottomMargin?: number; // Custom margin per screen
  style?: ViewStyle;
}

export function ScreenWrapper({ 
  children, 
  bottomMargin = 40, // Default 40, but customizable per screen
  style 
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container,
      style,
      { paddingBottom: insets.bottom + bottomMargin }
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});