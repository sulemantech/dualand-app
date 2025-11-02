import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

// Simple loading component
function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f9ff' }}>
      <ActivityIndicator size="large" color="#ec4899" />
      <Text style={{ marginTop: 16, color: '#6b7280' }}>Loading DuaLand...</Text>
    </View>
  );
}

// Simple error boundary component
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

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#f0f9ff' },
        }}
      >
        {/* Main tabs navigation */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Modal screens */}
        <Stack.Screen 
          name="dua-detail" 
          options={{ 
            presentation: 'modal',
            headerShown: false,
            gestureEnabled: true,
          }} 
        />
        
        {/* Add more screens as needed */}
        {/* <Stack.Screen 
          name="category-detail" 
          options={{ 
            presentation: 'card',
            headerShown: false,
          }} 
        /> */}
      </Stack>
    </ErrorBoundary>
  );
}