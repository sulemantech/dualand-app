import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
}

export const SwipeNavigation: React.FC<SwipeNavigationProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children,
}) => {
  const pan = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onEnd((event) => {
      if (event.translationX > 60) {
        onSwipeRight();
      } else if (event.translationX < -60) {
        onSwipeLeft();
      }
    });

  return (
    <GestureDetector gesture={pan}>
      <View style={styles.container}>
        {children}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
