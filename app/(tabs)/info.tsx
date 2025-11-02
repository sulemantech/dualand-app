import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export default function InfoScreen() {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>About DuaLand</Text>
        <Text style={styles.description}>
          DuaLand is a beautiful app designed to help you learn and memorize Islamic prayers and supplications (Duas) in an engaging and interactive way.
        </Text>
        
        <View style={styles.featureSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.feature}>• Learn beautiful Duas with translations</Text>
          <Text style={styles.feature}>• Audio playback for proper pronunciation</Text>
          <Text style={styles.feature}>• Word-by-word learning mode</Text>
          <Text style={styles.feature}>• Favorite your most-used Duas</Text>
          <Text style={styles.feature}>• Kid-friendly interface</Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <Text style={styles.contactText}>
            If you have any questions or feedback, please reach out to us at support@dualand.app
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ec4899',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 30,
  },
  featureSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  feature: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 22,
  },
});