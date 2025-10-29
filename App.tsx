// App.tsx - CORRECTED VERSION
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useDuaStore } from './src/stores/duaStore';
import SplashScreenComponent from './src/screens/SplashScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen';
import DuaAudioScreen from './src/screens/DuaAudioScreen';
import { RootStackParamList } from './src/navigation/NavigationTypes';

const Stack = createStackNavigator<RootStackParamList>();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const initializeData = useDuaStore(state => state.initializeData);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load resources and initialize database
        await initializeData();
        
        // Artificially delay for two seconds to simulate loading things
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Dashboard"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#FFFFFF' },
          }}
        >
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
          <Stack.Screen name="DuaAudio" component={DuaAudioScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}