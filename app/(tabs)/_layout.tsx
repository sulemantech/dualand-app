import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';

const TabIcon = ({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) => (
  <View style={{ 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  }}>
    <Text style={{ fontSize: 20, marginBottom: 4 }}>
      {emoji}
    </Text>
    <Text style={{ 
      fontSize: 12, 
      fontWeight: focused ? 'bold' : '600',
      color: focused ? '#ec4899' : '#fb923c',
    }}>
      {label}
    </Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          borderTopWidth: 4,
          borderTopColor: '#fb923c', // orange-400
          backgroundColor: '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          elevation: 8,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}
    >
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="ℹ️" label="Info" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="share"
        options={{
          title: 'Share',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="↗️" label="Share" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="⚙️" label="Settings" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}