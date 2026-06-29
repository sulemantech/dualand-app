import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' }}>
      <ActivityIndicator size="large" color="#ec4899" />
      <Text style={{ marginTop: 16, color: '#6b7280' }}>Loading DuaLand...</Text>
    </View>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fef2f2' }}>
          <Text style={{ fontSize: 18, color: '#dc2626', marginBottom: 16 }}>Something went wrong</Text>
          <Text style={{ color: '#6b7280', textAlign: 'center' }}>
            Please restart the app
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    MyArabicFont:    require('../assets/fonts/vazirmatn_regular.ttf'),
    translationtext: require('../assets/fonts/poppins_regular.ttf'),
    reference:       require('../assets/fonts/poppins_semibold.ttf'),
    title:           require('../assets/fonts/mochypop_regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Minimum 1-second splash, but wait for fonts too
      const timer = setTimeout(() => setAppReady(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ErrorBoundary>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f0f9ff' },
        }}
      >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="dua-detail"
            options={{
              headerShown: false,
              gestureEnabled: true,
            }}
          />
        </Stack>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}
