import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const THEME = {
  primary: '#FF9A3D',
  text: {
    primary: '#2D4A63',
    secondary: '#6B7B8C',
  },
};

interface CombinedDuaDisplayProps {
  arabic: string;
  translation: string;
  reference: string;
}

export const CombinedDuaDisplay: React.FC<CombinedDuaDisplayProps> = ({
  arabic,
  translation,
  reference
}) => {
  return (
    <View style={styles.arabicTextContainer}>
      <Text style={styles.arabicText} dir="rtl">
        {arabic}
      </Text>
      
      <View style={styles.translationInline}>
        <Text style={styles.translationText}>
          {translation}
        </Text>
      </View>

      {reference && reference !== 'Reference not available' && (
        <View style={styles.referenceInline}>
          <Text style={styles.referenceText}>{reference}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});