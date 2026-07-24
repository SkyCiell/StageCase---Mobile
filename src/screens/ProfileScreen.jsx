import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={{ color: COLORS.jade, fontSize: 24, fontWeight: 'bold' }}>SC</Text>
        </View>
        <Text style={styles.name}>StageCase User</Text>
        <Text style={styles.email}>user@stagecase.id</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  header: { marginBottom: 20 },
  title: { color: COLORS.ivory, fontSize: 22, fontWeight: 'bold' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.darkJade,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { color: COLORS.ivory, fontSize: 18, fontWeight: 'bold' },
  email: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
});
