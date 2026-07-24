import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/theme';

const MOCK_CONCERTS = [
  { id: '1', title: 'Crayon Case: Live In Jakarta', venue: 'Istora Senayan', date: '15 Nov 2026', price: 'Rp 350.000' },
  { id: '2', title: 'Crayon Case: Bandung Stage', venue: 'Tennis Indoor', date: '22 Nov 2026', price: 'Rp 400.000' },
  { id: '3', title: 'Crayon Case: Surabaya Night', venue: 'Grand City Hall', date: '05 Dec 2026', price: 'Rp 350.000' },
];

export default function ConcertListScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Concerts</Text>
      </View>

      <FlatList
        data={MOCK_CONCERTS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTag}>UPCOMING</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.venue} · {item.date}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.cardPrice}>{item.price}</Text>
              <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Book</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20 },
  title: { color: COLORS.ivory, fontSize: 22, fontWeight: 'bold' },
  list: { paddingHorizontal: 20, gap: 16, paddingBottom: 24 },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTag: { color: COLORS.jade, fontSize: 9, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4 },
  cardTitle: { color: COLORS.ivory, fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardSub: { color: COLORS.textSecondary, fontSize: 12, marginBottom: 16 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { color: COLORS.gold, fontSize: 16, fontWeight: 'bold' },
  btn: { backgroundColor: COLORS.jade, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12 },
  btnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },
});
