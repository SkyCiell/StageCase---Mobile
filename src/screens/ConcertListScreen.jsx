import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, ActivityIndicator, RefreshControl, TextInput 
} from 'react-native';
import { concertService } from '../services/concertService';
import { COLORS } from '../utils/theme';
import { format } from 'date-fns';

export default function ConcertListScreen({ navigation }) {
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      const response = await concertService.getConcerts();
      setConcerts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching concerts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchConcerts();
  };

  const filteredConcerts = concerts.filter(concert =>
    concert.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concert.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    concert.venue?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConcert = ({ item }) => {
    const formattedDate = item.date 
      ? format(new Date(item.date), 'MMM dd, yyyy')
      : 'Date TBA';
    
    const formattedTime = item.date 
      ? format(new Date(item.date), 'HH:mm')
      : '';

    const minPrice = item.ticket_categories?.reduce((min, cat) => 
      Math.min(min, cat.price || Infinity), Infinity
    ) || item.ticket_price_min || 0;

    return (
      <TouchableOpacity
        style={styles.concertCard}
        onPress={() => navigation.navigate('ConcertDetail', { 
          concertId: item.id,
          slug: item.slug 
        })}
        activeOpacity={0.7}
      >
        {/* Tag */}
        <View style={styles.cardHeader}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>UPCOMING</Text>
          </View>
          {item.available_seats && item.available_seats < 50 && (
            <View style={styles.limitedBadge}>
              <Text style={styles.limitedText}>🔥 {item.available_seats} left</Text>
            </View>
          )}
        </View>

        {/* Title & Artist */}
        <Text style={styles.concertTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.concertArtist}>{item.artist}</Text>

        {/* Venue & Date */}
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText}>{item.venue?.name || 'Venue TBA'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📅</Text>
          <Text style={styles.infoText}>{formattedDate} · {formattedTime}</Text>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.priceValue}>
              Rp {minPrice.toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Upcoming Shows</Text>
        <Text style={styles.subtitle}>
          {filteredConcerts.length} concert{filteredConcerts.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search concerts, artists, venues..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Concert List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.jade} />
        </View>
      ) : filteredConcerts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🎤</Text>
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No Results' : 'No Concerts'}
          </Text>
          <Text style={styles.emptyText}>
            {searchQuery 
              ? `No concerts found for "${searchQuery}"`
              : 'No upcoming concerts at the moment. Check back soon!'
            }
          </Text>
          {searchQuery && (
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
            >
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredConcerts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConcert}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.jade}
              colors={[COLORS.jade]}
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
    backgroundColor: COLORS.background 
  },
  header: { 
    padding: 20,
    paddingBottom: 16,
  },
  title: { 
    color: COLORS.ivory, 
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.ivory,
    fontSize: 14,
  },
  clearButton: {
    padding: 4,
  },
  clearIcon: {
    color: COLORS.textMuted,
    fontSize: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: COLORS.ivory,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  clearSearchButton: {
    backgroundColor: COLORS.jade,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearSearchText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  list: { 
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 100,
  },
  concertCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagBadge: {
    backgroundColor: `${COLORS.jade}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: { 
    color: COLORS.jade, 
    fontSize: 9, 
    fontWeight: 'bold', 
    letterSpacing: 0.5,
  },
  limitedBadge: {
    backgroundColor: `${COLORS.error}15`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  limitedText: {
    color: COLORS.error,
    fontSize: 10,
    fontWeight: 'bold',
  },
  concertTitle: { 
    color: COLORS.ivory, 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 4,
    lineHeight: 24,
  },
  concertArtist: {
    color: COLORS.jade,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  infoText: { 
    color: COLORS.textSecondary, 
    fontSize: 13,
  },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  priceValue: { 
    color: COLORS.gold, 
    fontSize: 17, 
    fontWeight: 'bold',
  },
  bookButton: { 
    backgroundColor: COLORS.jade, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderRadius: 12,
  },
  bookButtonText: { 
    color: COLORS.white, 
    fontWeight: 'bold', 
    fontSize: 13,
  },
});
