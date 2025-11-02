import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function ShareScreen() {
  const handleShare = () => {
    Alert.alert('Share DuaLand', 'Share this app with your friends and family!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Share DuaLand</Text>
        <Text style={styles.description}>
          Spread the blessings by sharing this app with your loved ones. Help others discover the beauty of Islamic prayers and supplications.
        </Text>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Text style={styles.shareButtonText}>Share App</Text>
        </TouchableOpacity>

        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>Benefits of Sharing</Text>
          <Text style={styles.benefit}>• Spread Islamic knowledge</Text>
          <Text style={styles.benefit}>• Help others learn beautiful Duas</Text>
          <Text style={styles.benefit}>• Earn rewards for sharing beneficial knowledge</Text>
          <Text style={styles.benefit}>• Build a community of learners</Text>
        </View>
      </View>
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
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ec4899',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 30,
  },
  shareButton: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 40,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  benefitsSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
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
    textAlign: 'center',
  },
  benefit: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 8,
    lineHeight: 22,
  },
});