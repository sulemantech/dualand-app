import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCustomAudioPlayer } from '../../hooks/useAudioPlayer';

interface AudioPlayerProps {
  audioSource: any;
  title: string;
  size?: 'small' | 'large';
  showProgress?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioSource,
  title,
  size = 'large',
  showProgress = true
}) => {
  const { isPlaying, position, duration, playPause, replay, seekTo } = useCustomAudioPlayer(audioSource);

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

  const handleSeek = (percentage: number) => {
    if (duration) {
      const newPosition = (percentage / 100) * duration;
      seekTo(newPosition);
    }
  };

  const buttonSize = size === 'large' ? 44 : 36;
  const iconSize = size === 'large' ? 20 : 16;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.playButton, { width: buttonSize, height: buttonSize }]}
          onPress={playPause}
        >
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={iconSize} 
            color="#FFFFFF" 
          />
        </TouchableOpacity>

        {showProgress && (
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            
            <TouchableOpacity 
              style={styles.progressBar}
              onPress={(e) => {
                // Simple seek implementation - in real app, use gesture handler for precise seeking
                const progress = getProgressPercentage() + 10;
                handleSeek(Math.min(progress, 100));
              }}
            >
              <View style={styles.progressBackground}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${getProgressPercentage()}%` }
                  ]} 
                />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.replayButton, { width: buttonSize - 8, height: buttonSize - 8 }]}
          onPress={replay}
        >
          <Ionicons name="reload" size={iconSize - 4} color="#64748B" />
        </TouchableOpacity>
      </View>
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
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
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
  replayButton: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});