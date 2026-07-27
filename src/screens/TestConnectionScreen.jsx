import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/theme';
import api, { API_BASE } from '../services/api';

/**
 * Test Connection Screen
 * Debug screen untuk test koneksi ke backend
 */
export default function TestConnectionScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setResults(prev => [...prev, { test, status, message, data, time: new Date().toLocaleTimeString() }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    clearResults();
    
    addResult('Config', 'info', `API Base: ${API_BASE}`);

    try {
      // Test 1: Ping backend
      addResult('Ping', 'loading', 'Testing backend connection...');
      const pingResponse = await api.get('/');
      addResult('Ping', 'success', 'Backend is reachable', pingResponse.data);
    } catch (error) {
      addResult('Ping', 'error', error.message, {
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });
    }

    try {
      // Test 2: Test auth endpoint
      addResult('Auth', 'loading', 'Testing auth endpoint...');
      const authResponse = await api.post('/auth/login', {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
      addResult('Auth', 'success', 'Auth endpoint reachable', authResponse.data);
    } catch (error) {
      if (error.response?.status === 401) {
        addResult('Auth', 'success', 'Auth endpoint working (401 is expected)', {
          status: 401,
          message: 'Invalid credentials (normal)'
        });
      } else {
        addResult('Auth', 'error', error.message, {
          status: error.response?.status,
          data: error.response?.data
        });
      }
    }

    try {
      // Test 3: Test concerts endpoint
      addResult('Concerts', 'loading', 'Testing concerts endpoint...');
      const concertsResponse = await api.get('/concerts');
      addResult('Concerts', 'success', `Found ${concertsResponse.data.data?.length || 0} concerts`, {
        count: concertsResponse.data.data?.length
      });
    } catch (error) {
      addResult('Concerts', 'error', error.message, {
        status: error.response?.status,
        data: error.response?.data
      });
    }

    setLoading(false);
  };

  const testLoginWithRealCredentials = async () => {
    setLoading(true);
    clearResults();

    addResult('Real Login', 'info', 'Attempting login with credentials...');
    
    try {
      const response = await api.post('/auth/login', {
        email: 'user@example.com',  // Ganti dengan email yang ada di database
        password: 'password123'      // Ganti dengan password yang benar
      });
      
      addResult('Real Login', 'success', 'Login successful!', {
        token: response.data.data?.token?.substring(0, 20) + '...',
        user: response.data.data?.user
      });
    } catch (error) {
      addResult('Real Login', 'error', error.message, {
        status: error.response?.status,
        data: error.response?.data
      });
    }

    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>🔧 Connection Test</Text>
        <Text style={styles.subtitle}>Debug backend connection</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={testBackendConnection}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Testing...' : 'Test Backend'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.buttonSecondary, loading && styles.buttonDisabled]} 
            onPress={testLoginWithRealCredentials}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Test Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.clearButton} 
          onPress={clearResults}
        >
          <Text style={styles.clearButtonText}>Clear Results</Text>
        </TouchableOpacity>

        {/* Results */}
        <View style={styles.results}>
          {results.length === 0 ? (
            <Text style={styles.emptyText}>No tests run yet</Text>
          ) : (
            results.map((result, index) => (
              <View key={index} style={[
                styles.resultCard,
                result.status === 'success' && styles.resultSuccess,
                result.status === 'error' && styles.resultError,
                result.status === 'loading' && styles.resultLoading,
              ]}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultIcon}>
                    {result.status === 'success' ? '✅' : 
                     result.status === 'error' ? '❌' : 
                     result.status === 'loading' ? '⏳' : 'ℹ️'}
                  </Text>
                  <View style={styles.resultHeaderText}>
                    <Text style={styles.resultTest}>{result.test}</Text>
                    <Text style={styles.resultTime}>{result.time}</Text>
                  </View>
                </View>
                <Text style={styles.resultMessage}>{result.message}</Text>
                {result.data && (
                  <View style={styles.resultData}>
                    <Text style={styles.resultDataText}>
                      {JSON.stringify(result.data, null, 2)}
                    </Text>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    color: COLORS.ivory,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.jade,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: COLORS.gold,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  results: {
    gap: 12,
  },
  emptyText: {
    color: COLORS.textMuted,
    textAlign: 'center',
    fontSize: 14,
    marginTop: 40,
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resultSuccess: {
    borderColor: COLORS.success,
    backgroundColor: `${COLORS.success}10`,
  },
  resultError: {
    borderColor: COLORS.error,
    backgroundColor: `${COLORS.error}10`,
  },
  resultLoading: {
    borderColor: COLORS.jade,
    backgroundColor: `${COLORS.jade}10`,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  resultIcon: {
    fontSize: 20,
  },
  resultHeaderText: {
    flex: 1,
  },
  resultTest: {
    color: COLORS.ivory,
    fontWeight: 'bold',
    fontSize: 14,
  },
  resultTime: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  resultMessage: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  resultData: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  resultDataText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
});
