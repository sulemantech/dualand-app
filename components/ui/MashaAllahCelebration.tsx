import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native';

const THEME = {
  text: {
    light: '#FFFFFF',
  },
};

interface MashaAllahCelebrationProps {
  visible: boolean;
  onHide: () => void;
}

export const MashaAllahCelebration: React.FC<MashaAllahCelebrationProps> = ({ visible, onHide }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [internalVisible, setInternalVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (visible && !internalVisible) {
      console.log('🎉 Starting celebration animation');
      setInternalVisible(true);
      Vibration.vibrate(300);

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      scaleAnim.setValue(0);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        })
      ]).start();

      hideTimeoutRef.current = setTimeout(() => {
        console.log('🎉 Starting hide animation');
        hideCelebration();
      }, 2000);

    } else if (!visible && internalVisible) {
      hideCelebration();
    }
  }, [visible, internalVisible]);

  const hideCelebration = () => {
    console.log('🎉 Hiding celebration');
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start(({ finished }) => {
      if (finished) {
        console.log('🎉 Hide animation completed');
        setInternalVisible(false);
        onHide();
      }
    });
  };

  const handleManualClose = () => {
    console.log('🎉 Manual close triggered');
    hideCelebration();
  };

  if (!internalVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={['#FFD166', '#FFB347', '#FF9A3D']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={handleManualClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        
        <Text style={styles.celebrationText}>ماشاءالله</Text>
        <Text style={styles.celebrationSubtext}>Masha'Allah! You completed the Dua!</Text>
        <View style={styles.stars}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>🌟</Text>
          <Text style={styles.star}>✨</Text>
          <Text style={styles.star}>🎉</Text>
          <Text style={styles.star}>🕌</Text>
        </View>
        <Text style={styles.hint}>Continue to next Dua or replay</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '25%',
    left: '5%',
    right: '5%',
    zIndex: 1000,
    pointerEvents: 'box-none',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.4,
        shadowRadius: 25,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  gradient: {
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  celebrationText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: THEME.text.light,
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  celebrationSubtext: {
    fontSize: 20,
    color: THEME.text.light,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  hint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  star: {
    fontSize: 28,
    marginHorizontal: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
  },
  closeButtonText: {
    color: THEME.text.light,
    fontSize: 16,
    fontWeight: 'bold',
  },
});