import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Version</Text>
        <Text style={styles.sectionContent}>Serendipity Mobile v1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Configuration</Text>
        <Text style={styles.sectionContent}>
          {process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Realtime Sync</Text>
        <Text style={styles.sectionContent}>Supabase PostgreSQL Changes</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionContent}>
          Serendipity Anthropos Core Mobile{'\n'}
          Interactive agent system with realtime dashboard sync
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#064e3b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b98133',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
  },
  sectionContent: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '500',
  },
});
