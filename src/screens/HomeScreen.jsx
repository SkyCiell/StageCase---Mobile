import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, ActivityIndicator, RefreshControl, StatusBar, Image,
} from 'react-native';
import { concertService } from '../services/concertService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';
import { ARTIST_COVERS } from '../utils/covers';
import ConcertCard from '../components/ConcertCard';

const ARTIST_PIS = [
  { name: 'Crayon Case', cover: ARTIST_COVERS['Crayon Case'] },
  { name: 'Reality Club', cover: ARTIST_COVERS['Reality Club'] },
  { name: 'The Milo', cover: ARTIST_COVERS['The Milo'] },
  { name: 'Wave to Earth', cover: ARTIST_COVERS['Wave to Earth'] },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [concerts, setConcerts] = useState([]);
  const [featuredConcerts, setFeaturedConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConcerts = async () => {
    try {
      const res = await concertService.getConcerts({ limit: 12 });
      const list = res.data?.data || res.data || [];
      setConcerts(list);
      setFeaturedConcerts(list.filter(c => c.is_featured));
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

  const firstName = user?.name?.split(' ')[0] || 'Fan';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* ── Navbar ── */}
      <View style={styles.navHeader}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandTitle}>STAGECASE</Text>
          <Text style={styles.brandSubtitle}>EVERY STAGE BEGINS HERE</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarBtn}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchConcerts(); }}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Banner ── */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>✨ LIVE EXPERIENCE PLATFORM</Text>
          </View>
          <Text style={styles.heroTitle}>
            Hello, <Text style={styles.heroName}>{firstName}</Text>.{'\n'}
            Discover live concerts & digital passes.
          </Text>
          <Text style={styles.heroSubtitle}>
            Get official tickets, seat reservations, and exclusive band merchandise.
          </Text>

          {/* Quick Metrics */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>100%</Text>
              <Text style={styles.statLabel}>OFFICIAL</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>INSTANT</Text>
              <Text style={styles.statLabel}>E-TICKETS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>QR PASS</Text>
              <Text style={styles.statLabel}>SECURE ENTRY</Text>
            </View>
          </View>
        </View>

        {/* ── Featured Artists Horizontal Reel ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.goldLine} />
            <Text style={styles.sectionTitle}>FEATURED ARTISTS</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.artistsReel}
        >
          {ARTIST_PIS.map((artist) => (
            <TouchableOpacity
              key={artist.name}
              style={styles.artistChip}
              onPress={() => navigation.navigate('Concerts', { search: artist.name })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: artist.cover }} style={styles.artistAvatar} />
              <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Concert Feed Section ── */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <View style={styles.jadeLine} />
            <Text style={styles.sectionTitle}>UPCOMING SHOWS</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Concerts')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
        ) : concerts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming concerts available.</Text>
          </View>
        ) : (
          <View style={styles.concertList}>
            {concerts.map((concert) => (
              <ConcertCard
                key={concert.id || concert.slug}
                concert={concert}
                onPress={() => navigation.navigate('ConcertDetail', { slug: concert.slug, id: concert.id })}
              />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandContainer: {
    gap: 2,
  },
  brandTitle: {
    color: COLORS.ivory,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },
  brandSubtitle: {
    color: COLORS.gold,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.ivory,
    fontWeight: '800',
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heroCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 24,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.goldSubtle,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroName: {
    color: COLORS.accent,
  },
  heroSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: COLORS.gold,
    fontSize: 13,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goldLine: {
    width: 4,
    height: 14,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
  },
  jadeLine: {
    width: 4,
    height: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  sectionTitle: {
    color: COLORS.ivory,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  viewAllText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  artistsReel: {
    gap: 12,
    paddingBottom: 24,
  },
  artistChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  artistAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },
  artistName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  concertList: {
    gap: 4,
  },
  loader: {
    marginVertical: 40,
  },
  emptyCard: {
    padding: 30,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
