import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

const THEME = {
  primary: '#FF9A3D',
  accent: '#FFD166',
  text: {
    primary: '#2D4A63',
    secondary: '#6B7B8C',
  },
};

interface WordAudioPair {
  id: string;
  dua_id: string;
  word_text: string;
  audio_res_id: any;
  sequence_order: number;
}

interface WordByWordDisplayProps {
  arabicText: string;
  currentWordIndex: number;
  isPlaying: boolean;
  translationText: string;
  referenceText: string;
  wordAudioPairs: WordAudioPair[];
}

export const WordByWordDisplay: React.FC<WordByWordDisplayProps> = ({
  arabicText,
  currentWordIndex,
  isPlaying,
  translationText,
  referenceText,
  wordAudioPairs = []
}) => {
  // Use wordAudioPairs if available, otherwise fall back to space splitting
  const words = wordAudioPairs.length > 0 
    ? wordAudioPairs.map(pair => pair.word_text)
    : (arabicText || "بِسْمِ اللّٰہِ").split(' ').filter(word => word.trim().length > 0);

  const [animations] = useState(() =>
    words.map(() => new Animated.Value(0))
  );

  // Track the previous word index to reset its animation
  const [prevWordIndex, setPrevWordIndex] = useState(-1);

  useEffect(() => {
    // Only animate if we're actually playing
    if (!isPlaying) {
      return;
    }

    // Reset previous word animation when current word changes
    if (prevWordIndex !== -1 && prevWordIndex !== currentWordIndex && animations[prevWordIndex]) {
      Animated.timing(animations[prevWordIndex], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    // Animate current word only if playing and it's a valid index
    if (currentWordIndex < words.length && animations[currentWordIndex]) {
      Animated.sequence([
        Animated.timing(animations[currentWordIndex], {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(animations[currentWordIndex], {
          toValue: 0.8,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Update previous word index
    setPrevWordIndex(currentWordIndex);
  }, [currentWordIndex, isPlaying, words.length]);

  // Reset all animations when playback stops or starts
  useEffect(() => {
    if (!isPlaying) {
      // Reset all animations when playback stops
      animations.forEach((animation, index) => {
        Animated.timing(animation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
      setPrevWordIndex(-1);
    } else {
      // Reset all animations when playback starts (to ensure clean state)
      animations.forEach((animation, index) => {
        if (index !== currentWordIndex) {
          Animated.timing(animation, {
            toValue: 0,
            duration: 0, // Instant reset
            useNativeDriver: true,
          }).start();
        }
      });
    }
  }, [isPlaying]);

  const getWordAnimationStyle = (index: number) => {
    if (!animations[index]) {
      return {
        transform: [{ scale: 1 }],
        backgroundColor: 'transparent',
      };
    }

    const scale = animations[index].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.1],
    });

    const backgroundColor = animations[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', THEME.primary + '40'],
    });

    return {
      transform: [{ scale }],
      backgroundColor,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.arabicTextContainer}>
        <Text style={styles.arabicText} dir="rtl">
          {words.map((word, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.arabicWord,
                getWordAnimationStyle(index),
                // Only apply currentWord styles if actually playing
                isPlaying && index === currentWordIndex && styles.currentWord,
              ]}
            >
              {word}{index < words.length - 1 ? ' ' : ''}
            </Animated.Text>
          ))}
        </Text>
        
        <View style={styles.translationInline}>
          <Text style={styles.translationText}>
            {translationText}
          </Text>
        </View>

        {referenceText && referenceText !== 'Reference not available' && (
          <View style={styles.referenceInline}>
            <Text style={styles.referenceText}>{referenceText}</Text>
          </View>
        )}
      </View>

      {isPlaying && (
        <View style={styles.readingGuide}>
          <Text style={styles.readingGuideText}>
            👆 Listening to word {currentWordIndex + 1} of {words.length}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    justifyContent: 'center',
  },
  arabicTextContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  arabicText: {
    fontSize: 28,
    lineHeight: 48,
    textAlign: 'right',
    color: THEME.text.primary,
  },
  arabicWord: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  currentWord: {
    fontWeight: 'bold',
  },
  translationInline: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: `${THEME.primary}20`,
  },
  translationText: {
    fontSize: 14,
    color: THEME.text.primary,
    lineHeight: 20,
  },
  referenceInline: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: `${THEME.primary}10`,
  },
  referenceText: {
    fontSize: 13,
    color: THEME.text.secondary,
    fontStyle: 'italic',
  },
  readingGuide: {
    marginTop: 16,
    padding: 12,
    backgroundColor: `${THEME.accent}20`,
    borderRadius: 12,
    alignItems: 'center',
  },
  readingGuideText: {
    fontSize: 14,
    color: THEME.text.primary,
    fontWeight: '600',
  },
});