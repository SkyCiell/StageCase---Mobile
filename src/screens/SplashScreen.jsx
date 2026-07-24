import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/theme';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoText}>SC</Text>
      </View>
      <Text style={styles.title}>StageCase</Text>
      <Text style={styles.subtitle}>EVERY STAGE BEGINS HERE</Text>
      <ActivityIndicator color={COLORS.jade} style={{ marginTop: 40 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.darkJade,
    alignItems: 'center',
    justify: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  logoText: {
    color: COLORS.ivory,
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    color: COLORS.ivory,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: COLORS.gold,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 6,
    fontWeight: '600',
  },
});
