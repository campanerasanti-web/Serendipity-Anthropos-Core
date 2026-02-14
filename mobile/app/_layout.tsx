import React from 'react';
import { Stack, Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0f172a',
            borderTopColor: '#1e293b',
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: '#10b981',
          tabBarInactiveTintColor: '#64748b',
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text>,
          }}
        />

        <Tabs.Screen
          name="agents"
          options={{
            title: 'Agents',
            tabBarLabel: 'Agents',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🤖</Text>,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>⚙️</Text>,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}

import { Text } from 'react-native';
