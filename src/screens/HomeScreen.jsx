import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl, StatusBar,
} from 'react-native';
import { concertService } from '../services/concertService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';

function formatDate(dateStr) {
  if (!dateStr) return { month: '—', day: '—' };
  const d = new Date(dateStr);
  return {
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
    year: d.getFullYear(),
  };
}

function formatCurrency(amount) {
  if (!amount) return 'IDR —';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
  }).format(amount);
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConcerts = async () => {
    try {
      const res = await concertService.getConcerts({ limit: 8 });
      setConcerts(res.data.data || []);
    } catch (e) {
      console.log('fetch concerts error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchConcerts(); }, []);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SC';

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchConcerts(); }}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>StageCase</Text>
            <Text style={styles.brandSub}>EVERY STAGE BEGINS HERE</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.avatarText}>{initials}</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero block ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🎶  Live Music Experience</Text>
          </View>
          <Text style={styles.heroTitle}>
            Hey, {firstName}.{'\n'}
            <Text style={styles.heroAccent}>Discover your{'\n'}next show.</Text>
          </Text>
          <View style={styles.statsRow}>
            {[
              { val: '500+', label: 'Events' },
              { val: '50K+', label: 'Happy Fans' },
              { val: '100+', label: 'Venues' },
            ].map(s => (
              <View key={s.label} style={styles.stat}>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick actions ── */}
        <View style={styles.quickRow}>
          {[
            { icon: '🎤', label: 'Browse', screen: 'Concerts' },
            { icon: '🎟', label: 'My Tickets', screen: 'MyTickets' },
            { icon: '👤', label: 'Account', screen: 'Profile' },
          ].map(item => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickCard}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickIcon}>{item.icon}</Text>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Section header ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionLeft}>
            <View style={styles.accentLine} />
            <Text style={styles.sectionLabel}>UPCOMING SHOWS</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Concerts')}>
            <Text style={styles.sectionLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Concert list ── */}
        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginTop: 32 }} />
        ) : concerts.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎵</Text>
            <Text style={styles.emptyText}>No concerts found.</Text>
          </View>
        ) : (
          concerts.map((c, idx) => {
            const date = formatDate(c.date);
            return (
              <TouchableOpacity
                key={c.id}
                style={styles.concertCard}
                onPress={() => navigation.navigate('ConcertDetail', { slug: c.slug })}
                activeOpacity={0.75}
              >
                {/* Left accent bar */}
                <View style={styles.concertAccent} />

                {/* Date badge */}
                <View style={styles.dateBadge}>
                  <Text style={styles.dateMonth}>{date.month}</Text>
                  <Text style={styles.dateDay}>{date.day}</Text>
                </View>

                {/* Info */}
                <View style={styles.concertInfo}>
                  <Text style={styles.concertTitle} numberOfLines={1}>
                    {c.title}
                  </Text>
                  <Text style={styles.concertVenue} numberOfLines={1}>
                    {c.venue?.name || 'Venue TBA'}{c.venue?.city ? ` · ${c.venue.city}` : ''}
                  </Text>
                  {c.min_price && (
                    <Text style={styles.concertPrice}>
                      From {formatCurrency(c.min_price)}
                    </Text>
                  )}
                </View>

                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.bottomPad} />
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
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  brand: {
    color: COLORS.ivory,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
  brandSub: {
    color: COLORS.bronze,
    fontSize: 7,
    letterSpacing: 2.5,
    marginTop: 2,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: 'rgba(245,243,245,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.ivory,
    fontWeight: 'bold',
    fontSize: 12,
  },

  // Hero
  hero: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: COLORS.surfaceDark,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 24,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(42,98,156,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(42,98,156,0.4)',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: COLORS.ivory,
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 34,
    marginBottom: 24,
  },
  heroAccent: {
    color: COLORS.primaryLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statVal: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.5,
  },

  // Quick actions
  quickRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  quickCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
    gap: 6,
  },
  quickIcon: {
    fontSize: 20,
  },
  quickLabel: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accentLine: {
    width: 3,
    height: 14,
    backgroundColor: COLORS.bronze,
  },
  sectionLabel: {
    color: COLORS.ivory,
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  sectionLink: {
    color: COLORS.bronze,
    fontSize: 11,
    fontWeight: '600',
  },

  // Concert card
  concertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 16,
    paddingRight: 20,
    gap: 16,
    position: 'relative',
    marginHorizontal: 0,
  },
  concertAccent: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.border,
    position: 'absolute',
    left: 24,
    top: 0,
  },
  dateBadge: {
    width: 44,
    alignItems: 'center',
    marginLeft: 40,
  },
  dateMonth: {
    color: COLORS.bronze,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  dateDay: {
    color: COLORS.ivory,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  concertInfo: {
    flex: 1,
  },
  concertTitle: {
    color: COLORS.ivory,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 3,
  },
  concertVenue: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },
  concertPrice: {
    color: COLORS.amber,
    fontSize: 11,
    fontWeight: '600',
  },
  arrow: {
    color: COLORS.textMuted,
    fontSize: 22,
  },

  // Empty
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
    opacity: 0.3,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  bottomPad: { height: 20 },
});
