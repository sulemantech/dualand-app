import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCustomAudioPlayer } from '../../hooks/useAudioPlayer';

interface AdvancedAudioPlayerProps {
  audioSource: any;
  title: string;
}

const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export const AdvancedAudioPlayer: React.FC<AdvancedAudioPlayerProps> = ({
  audioSource,
  title,
}) => {
  const { isPlaying, position, duration, playPause, replay, setPlaybackRate, status } = useCustomAudioPlayer(audioSource);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [currentRate, setCurrentRate] = useState(1.0);

  const formatTime = (milliseconds: number) => {
    if (!milliseconds && milliseconds !== 0) return '0:00';
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!duration || duration === 0) return 0;
    return (position / duration) * 100;
  };

  const handleSpeedChange = async (rate: number) => {
    setCurrentRate(rate);
    await setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.controls}>
        {/* Play/Pause Button */}
        <TouchableOpacity 
          style={styles.playButton}
          onPress={playPause}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={20} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          
          <View style={styles.progressBar}>
            <View style={styles.progressBackground}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
          </View>
          
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        {/* Speed Control */}
        <TouchableOpacity 
          style={styles.speedButton}
          onPress={() => setShowSpeedMenu(true)}
        >
          <Text style={styles.speedText}>{currentRate}x</Text>
          <Ionicons name="chevron-down" size={12} color="#64748B" />
        </TouchableOpacity>

        {/* Replay Button */}
        <TouchableOpacity 
          style={styles.replayButton}
          onPress={replay}
        >
          <Ionicons name="reload" size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Playback Rate Modal */}
      <Modal
        visible={showSpeedMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSpeedMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowSpeedMenu(false)}
        >
          <View style={styles.speedMenu}>
            <Text style={styles.speedMenuTitle}>Playback Speed</Text>
            {PLAYBACK_RATES.map((rate) => (
              <TouchableOpacity
                key={rate}
                style={[
                  styles.speedOption,
                  currentRate === rate && styles.speedOptionActive
                ]}
                onPress={() => handleSpeedChange(rate)}
              >
                <Text style={[
                  styles.speedOptionText,
                  currentRate === rate && styles.speedOptionTextActive
                ]}>
                  {rate}x
                </Text>
                {currentRate === rate && (
                  <Ionicons name="checkmark" size={16} color="#D97706" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  playButton: {
    backgroundColor: '#D97706',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    minWidth: 40,
  },
  progressBar: {
    flex: 1,
  },
  progressBackground: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D97706',
    borderRadius: 2,
  },
  speedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  speedText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  replayButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  speedMenuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  speedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  speedOptionActive: {
    backgroundColor: '#FFFBEB',
  },
  speedOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  speedOptionTextActive: {
    color: '#D97706',
    fontWeight: '600',
  },
});