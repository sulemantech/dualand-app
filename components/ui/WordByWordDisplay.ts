
import React from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { THEME } from '../../constants';

interface WordByWordDisplayProps {
  arabicText: string;
  currentWordIndex: number;
  isPlaying: boolean;
  translationText: string;
  referenceText: string;
}

export const WordByWordDisplay: React.FC<WordByWordDisplayProps> = ({
  arabicText,
  currentWordIndex,
  isPlaying,
  translationText,
  referenceText,
}) => {
  const words = (arabicText || "بِسْمِ اللّٰہِ").split(' ').filter(word => word.trim().length > 0);
  const [animations] = useState(() =>
    words.map(() => new Animated.Value(0))
  );

  useEffect(() => {
    if (isPlaying && currentWordIndex < words.length && animations[currentWordIndex]) {
      if (currentWordIndex > 0 && animations[currentWordIndex - 1]) {
        Animated.timing(animations[currentWordIndex - 1], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      if (animations[currentWordIndex]) {
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
    }
  }, [currentWordIndex, isPlaying, words.length]);

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
    <View style={styles.wordByWordContainer}>
      <View style={styles.arabicTextContainer}>
        <Text style={styles.arabicText} dir="rtl">
          {words.map((word, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.arabicWord,
                getWordAnimationStyle(index),
                index === currentWordIndex && styles.currentWord,
              ]}
            >
              {word}{' '}
            </Animated.Text>
          ))}
        </Text>
      </View>

      <View style={styles.translationSection}>
        <Text style={styles.translationTitle}>Translation</Text>
        <Text style={styles.translationText}>
          {translationText}
        </Text>

        {referenceText && referenceText !== 'Reference not available' && (
          <>
            <Text style={styles.referenceTitle}>Reference</Text>
            <Text style={styles.referenceText}>{referenceText}</Text>
          </>
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
