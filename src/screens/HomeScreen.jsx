import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/theme';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>StageCase</Text>
            <Text style={styles.subBrand}>EVERY STAGE BEGINS HERE</Text>
          </View>
          <TouchableOpacity style={styles.avatarBadge} onPress={() => navigation.navigate('Profile')}>
            <Text style={{ color: COLORS.jade, fontWeight: 'bold' }}>SC</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTag}>CRAYON CASE TOUR 2026</Text>
          <Text style={styles.heroTitle}>Live In Jakarta</Text>
          <Text style={styles.heroSub}>Istora Senayan · Nov 15, 2026</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => navigation.navigate('Concerts')}
          >
            <Text style={styles.heroBtnText}>Book Tickets</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Nav */}
        <Text style={styles.sectionTitle}>Explore</Text>
        <View style={styles.navRow}>
          {[
            { label: 'Concerts', icon: '🎤', screen: 'Concerts' },
            { label: 'My Passes', icon: '🎟', screen: 'MyTickets' },
            { label: 'Profile', icon: '👤', screen: 'Profile' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.navCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              <Text style={styles.navLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
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
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  brand: {
    color: COLORS.ivory,
    fontSize: 22,
    fontWeight: 'bold',
  },
  subBrand: {
    color: COLORS.gold,
    fontSize: 9,
    letterSpacing: 1.5,
  },
  avatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.jade,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 28,
  },
  heroTag: {
    color: COLORS.jade,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: COLORS.ivory,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 18,
  },
  heroBtn: {
    backgroundColor: COLORS.jade,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  heroBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  sectionTitle: {
    color: COLORS.ivory,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  navRow: {
    flexDirection: 'row',
    gap: 12,
  },
  navCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 8,
  },
  navLabel: {
    color: COLORS.ivory,
    fontSize: 12,
    fontWeight: '600',
  },
});
