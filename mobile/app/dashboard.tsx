import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mobileApiClient } from '../services/apiClient';
import { useDashboardStore } from '../store/dashboardStore';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { financial, setFinancial, setError: setStoreError } = useDashboardStore();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await mobileApiClient.fetchSerendipityDashboard();
        
        // Verify data structure
        if (response?.financial) {
          const financialData = {
            totalIncome: response.financial.totalIncome || 0,
            totalExpenses: response.financial.totalExpenses || 0,
            cashFlow: response.financial.cashFlow || 0,
            forecast: response.financial.forecast || 0,
          };
          setFinancial(financialData);
        } else {
          throw new Error('Dashboard data structure mismatch');
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to load dashboard';
        console.error('Dashboard fetch error:', errorMsg);
        setError(errorMsg);
        setStoreError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [setFinancial, setStoreError]);

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Sync Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Serendipity Dashboard</Text>
      </View>

      {financial && (
        <View style={styles.card}>
          <View style={styles.metric}>
            <Text style={styles.label}>Total Income</Text>
            <Text style={styles.value}>${financial.totalIncome.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metric}>
            <Text style={styles.label}>Total Expenses</Text>
            <Text style={[styles.value, { color: '#ef4444' }]}>
              ${financial.totalExpenses.toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metric}>
            <Text style={styles.label}>Cash Flow</Text>
            <Text
              style={[
                styles.value,
                { color: financial.cashFlow >= 0 ? '#10b981' : '#ef4444' },
              ]}
            >
              ${financial.cashFlow.toLocaleString()}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.metric}>
            <Text style={styles.label}>30-Day Forecast</Text>
            <Text
              style={[
                styles.value,
                { color: financial.forecast >= 0 ? '#10b981' : '#ef4444' },
              ]}
            >
              ${financial.forecast.toLocaleString()}
            </Text>
          </View>
        </View>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#fca5a5',
    textAlign: 'center',
  },
  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b98133',
  },
  metric: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#10b981',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
});
