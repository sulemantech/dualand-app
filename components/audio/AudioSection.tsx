import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AudioPlayer } from './AudioPlayer';

// Mock audio files - you can use these for testing
const mockAudioFiles = {
  full: { uri: 'https://www.soundjay.com/button/beep-07.mp3' }, // Test beep sound
  wordByWord: { uri: 'https://www.soundjay.com/button/beep-07.mp3' }, // Test beep sound
};

// Alternative: Use test audio URLs if you don't have local files
const testAudioFiles = {
  full: { uri: 'https://www.soundjay.com/button/beep-07.mp3' }, // Test beep sound
  wordByWord: { uri: 'https://www.soundjay.com/button/beep-07.mp3' }, // Test beep sound
};

interface AudioSectionProps {
  duaId: string;
}

export const AudioSection: React.FC<AudioSectionProps> = ({ duaId }) => {
  const [audioFiles, setAudioFiles] = useState(mockAudioFiles);
  const [useTestAudio, setUseTestAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, you would fetch the actual audio files based on duaId
  useEffect(() => {
    const loadAudioFiles = async () => {
      try {
        setIsLoading(true);
        
        // Simulate checking for local files
        // In a real app, you would check if the files exist in your assets
        const hasLocalFiles = mockAudioFiles.full && mockAudioFiles.wordByWord;
        
        if (!hasLocalFiles) {
          console.log('Local audio files not found, using test audio');
          setUseTestAudio(true);
          setAudioFiles(testAudioFiles);
        } else {
          console.log('Using local audio files');
          setUseTestAudio(false);
          setAudioFiles(mockAudioFiles);
        }
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log('Error loading audio files, using test audio:', error);
        setUseTestAudio(true);
        setAudioFiles(testAudioFiles);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudioFiles();
  }, [duaId]);

  const handleAudioError = (error: string) => {
    Alert.alert(
      'Audio Error', 
      `Could not play audio: ${error}`,
      [
        {
          text: 'Use Test Audio',
          onPress: () => {
            setUseTestAudio(true);
            setAudioFiles(testAudioFiles);
          }
        },
        { text: 'OK', style: 'default' }
      ]
    );
  };

  const handleSwitchAudioSource = () => {
    if (useTestAudio) {
      // Try to switch back to local files
      const hasLocalFiles = mockAudioFiles.full && mockAudioFiles.wordByWord;
      if (hasLocalFiles) {
        setUseTestAudio(false);
        setAudioFiles(mockAudioFiles);
      } else {
        Alert.alert('No Local Files', 'Local audio files are not available. Please add them to assets/audio/');
      }
    } else {
      // Switch to test audio
      setUseTestAudio(true);
      setAudioFiles(testAudioFiles);
    }
  };

  const handleReplayAll = () => {
    // This would trigger both players to replay
    // In a real implementation, you might want to use refs to control the players
    Alert.alert('Replay All', 'Both audio players will restart from the beginning when you implement this feature.');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Ionicons name="musical-notes" size={32} color="#D97706" />
          <Text style={styles.loadingText}>Loading Audio...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.audioSection}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Ionicons name="play-circle" size={20} color="#D97706" />
        <Text style={styles.sectionTitle}>Audio Playback</Text>
      </View>

      {/* Audio Source Info */}
      {useTestAudio && (
        <View style={styles.testAudioNotice}>
          <Ionicons name="information-circle" size={16} color="#D97706" />
          <Text style={styles.testAudioText}>
            Using test audio files. Add your own Dua audio files to assets/audio/
          </Text>
        </View>
      )}

      {/* Complete Dua Player */}
      <View style={styles.audioPlayerContainer}>
        <AudioPlayer
          audioSource={audioFiles.full}
          title="Complete Dua"
          size="large"
          showProgress={true}
        />
        <View style={styles.playerDescription}>
          <Ionicons name="headset" size={14} color="#64748B" />
          <Text style={styles.descriptionText}>
            Listen to the complete Dua with proper pronunciation
          </Text>
        </View>
      </View>

      {/* Word by Word Player */}
      <View style={styles.audioPlayerContainer}>
        <AudioPlayer
          audioSource={audioFiles.wordByWord}
          title="Word by Word"
          size="small"
          showProgress={true}
        />
        <View style={styles.playerDescription}>
          <Ionicons name="text" size={14} color="#64748B" />
          <Text style={styles.descriptionText}>
            Learn each word separately for better memorization
          </Text>
        </View>
      </View>

      {/* Audio Features Info */}
      <View style={styles.featuresInfo}>
        <Text style={styles.featuresTitle}>How to Use</Text>
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#05966920' }]}>
            <Ionicons name="play" size={14} color="#059669" />
          </View>
          <Text style={styles.featureText}>
            <Text style={styles.featureTextBold}>Tap Play</Text> to listen to the Dua
          </Text>
        </View>
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#D9770620' }]}>
            <Ionicons name="reload" size={14} color="#D97706" />
          </View>
          <Text style={styles.featureText}>
            <Text style={styles.featureTextBold}>Tap Reload</Text> to restart from beginning
          </Text>
        </View>
        <View style={styles.featureItem}>
          <View style={[styles.featureIcon, { backgroundColor: '#3B82F620' }]}>
            <Ionicons name="bar-chart" size={14} color="#3B82F6" />
          </View>
          <Text style={styles.featureText}>
            <Text style={styles.featureTextBold}>Progress bar</Text> shows current position
          </Text>
        </View>
        {useTestAudio && (
          <View style={styles.featureItem}>
            <View style={[styles.featureIcon, { backgroundColor: '#8B5CF620' }]}>
              <Ionicons name="download" size={14} color="#8B5CF6" />
            </View>
            <Text style={styles.featureText}>
              <Text style={styles.featureTextBold}>Add real audio files</Text> to assets/audio/ for full experience
            </Text>
          </View>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.actionsTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleReplayAll}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#D9770620' }]}>
              <Ionicons name="refresh" size={18} color="#D97706" />
            </View>
            <Text style={styles.actionButtonText}>Replay Both</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSwitchAudioSource}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F620' }]}>
              <Ionicons 
                name={useTestAudio ? "cloud-download" : "cloud"} 
                size={18} 
                color="#3B82F6" 
              />
            </View>
            <Text style={styles.actionButtonText}>
              {useTestAudio ? 'Use Local' : 'Use Test'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Practice Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Practice Tips</Text>
        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#F59E0B" />
          <Text style={styles.tipText}>
            Listen to the Complete Dua first to understand the flow
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#F59E0B" />
          <Text style={styles.tipText}>
            Use Word by Word to practice pronunciation of each word
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#F59E0B" />
          <Text style={styles.tipText}>
            Repeat after the audio to improve your memorization
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  audioSection: {
    gap: 16,
    marginBottom: 24,
  },
  loadingContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    marginBottom: 24,
  },
  loadingContent: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  testAudioNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 8,
  },
  testAudioText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
    lineHeight: 18,
  },
  audioPlayerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  playerDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  descriptionText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  featuresInfo: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  featureTextBold: {
    fontWeight: '600',
    color: '#374151',
  },
  quickActions: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  tipsSection: {
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#92400E',
    flex: 1,
    lineHeight: 20,
  },
});

export default AudioSection;