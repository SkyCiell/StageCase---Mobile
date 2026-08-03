import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, ActivityIndicator, RefreshControl, TextInput, ScrollView,
} from 'react-native';
import { concertService } from '../services/concertService';
import { COLORS } from '../utils/theme';
import ConcertCard from '../components/ConcertCard';

const ARTIST_CATEGORIES = ['All', 'Crayon Case', 'Reality Club', 'The Milo', 'Wave to Earth'];

export default function ConcertListScreen({ navigation, route }) {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(route.params?.search || '');
  const [selectedCategory, setSelectedCategory] = useState(route.params?.search || 'All');

  useEffect(() => {
    fetchConcerts();
  }, []);

  useEffect(() => {
    if (route.params?.search !== undefined) {
      setSearchQuery(route.params.search);
      setSelectedCategory(route.params.search || 'All');
    }
  }, [route.params?.search]);

  const fetchConcerts = async () => {
    try {
      const response = await concertService.getConcerts();
      const list = response.data?.data || response.data || [];
      setConcerts(list);
    } catch (error) {
      console.error('Error fetching concerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredConcerts = concerts.filter(concert => {
    const matchesSearch =
      !searchQuery ||
      concert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concert.artist_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concert.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      concert.venue?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      concert.artist_name?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      concert.artist?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.title}>Live Concerts</Text>
        <Text style={styles.subtitle}>
          Browse official shows & reserve your seats
        </Text>
      </View>

      {/* ── Search Bar ── */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search concert, band, or venue..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category Filter Pills ── */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {ARTIST_CATEGORIES.map(cat => {
            const active = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, active && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={[styles.catText, active && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── List ── */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : filteredConcerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎤</Text>
          <Text style={styles.emptyTitle}>No Concerts Found</Text>
          <Text style={styles.emptyText}>
            We couldn't find any shows matching your criteria. Try adjusting your search query or filter.
          </Text>
          {(searchQuery !== '' || selectedCategory !== 'All') && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            >
              <Text style={styles.resetText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredConcerts}
          keyExtractor={(item) => (item.id || item.slug).toString()}
          renderItem={({ item }) => (
            <ConcertCard
              concert={item}
              onPress={() => navigation.navigate('ConcertDetail', { slug: item.slug, id: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchConcerts(); }}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  clearBtn: {
    padding: 6,
  },
  clearText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  catPill: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  catPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.gold,
  },
  catText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  catTextActive: {
    color: COLORS.ivory,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '800',
  },
});
