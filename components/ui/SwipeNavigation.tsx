import React, { useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';

interface SwipeNavigationProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: React.ReactNode;
}

export const SwipeNavigation: React.FC<SwipeNavigationProps> = ({
  onSwipeLeft,
  onSwipeRight,
  children
}) => {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 1.5);
        return isHorizontalSwipe;
      },
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 1.5);
        return isHorizontalSwipe;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx } = gestureState;
        const swipeThreshold = 40;

        if (dx > swipeThreshold) {
          console.log('➡️ Swipe right - Previous dua');
          onSwipeRight();
        } else if (dx < -swipeThreshold) {
          console.log('⬅️ Swipe left - Next dua');
          onSwipeLeft();
        }
      },
      onPanResponderTerminate: () => null,
      onShouldBlockNativeResponder: () => false,
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});