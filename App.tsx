// App.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DuaAudioScreen from './src/screens/DuaAudioScreen';
import { databaseService, Category, Dua } from '@/lib/database/database';

const Stack = createStackNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 Initializing Dualand App...');
        setIsLoading(true);
        setError(null);

        // Use your existing database service
        await databaseService.init();
        
        console.log('✅ App initialized successfully');
        setIsReady(true);
        
      } catch (err) {
        console.error('❌ App initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const retryInitialization = () => {
    setIsLoading(true);
    setError(null);
    initializeApp();
  };

  // Show loading screen
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
        <ActivityIndicator size="large" color="#2D5AFF" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666' }}>
          Initializing Dualand App...
        </Text>
      </View>
    );
  }

  // Show error screen
  if (error && !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#FFF' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 }}>
          Oops!
        </Text>
        <Text style={{ fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity 
          style={{ 
            backgroundColor: '#2D5AFF', 
            paddingHorizontal: 24, 
            paddingVertical: 12, 
            borderRadius: 8 
          }}
          onPress={retryInitialization}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main app
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="DuaAudio" 
            component={DuaAudioScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}