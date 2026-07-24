import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/theme';

export default function MyTicketsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My E-Tickets</Text>
      </View>

      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 40, marginBottom: 12 }}>🎟</Text>
        <Text style={styles.emptyTitle}>No Passes Available</Text>
        <Text style={styles.emptySub}>Book a concert ticket to view your QR entry pass here.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20 },
  title: { color: COLORS.ivory, fontSize: 22, fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyTitle: { color: COLORS.ivory, fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  emptySub: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
