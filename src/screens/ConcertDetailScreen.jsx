import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, SafeAreaView, Image
} from 'react-native';
import { concertService } from '../services/concertService';
import { COLORS } from '../utils/theme';
import { format } from 'date-fns';

export default function ConcertDetailScreen({ route, navigation }) {
  const { concertId, slug } = route.params;
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConcertDetail();
  }, []);

  const fetchConcertDetail = async () => {
    try {
      const response = slug 
        ? await concertService.getConcertBySlug(slug)
        : await concertService.getConcerts({ id: concertId });
      
      setConcert(response.data.data);
    } catch (error) {
      console.error('Error fetching concert detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.jade} />
        </View>
      </SafeAreaView>
    );
  }

  if (!concert) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Concert not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const formattedDate = concert.date 
    ? format(new Date(concert.date), 'EEEE, MMMM dd, yyyy')
    : 'Date TBA';
  
  const formattedTime = concert.date 
    ? format(new Date(concert.date), 'HH:mm')
    : '';

  const minPrice = concert.ticket_categories?.reduce((min, cat) => 
    Math.min(min, cat.price || Infinity), Infinity
  ) || concert.ticket_price_min || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {concert.title}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Poster Image (if available) */}
        {concert.poster_url && (
          <View style={styles.posterContainer}>
            <Image 
              source={{ uri: concert.poster_url }}
              style={styles.posterImage}
              resizeMode="cover"
            />
          </View>
        )}

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Artist */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{concert.title}</Text>
            <Text style={styles.artist}>{concert.artist}</Text>
          </View>

          {/* Info Cards */}
          <View style={styles.infoCards}>
            {/* Date & Time */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date & Time</Text>
                <Text style={styles.infoValue}>{formattedDate}</Text>
                <Text style={styles.infoSubValue}>{formattedTime}</Text>
              </View>
            </View>

            {/* Venue */}
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>
                  {concert.venue?.name || 'Venue TBA'}
                </Text>
                <Text style={styles.infoSubValue}>
                  {concert.venue?.city || ''}
                </Text>
              </View>
            </View>

            {/* Seats Available */}
            {concert.available_seats && (
              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>🎟️</Text>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Seats Available</Text>
                  <Text style={[
                    styles.infoValue,
                    concert.available_seats < 50 && { color: COLORS.error }
                  ]}>
                    {concert.available_seats} seats left
                  </Text>
                  {concert.available_seats < 50 && (
                    <Text style={styles.limitedText}>🔥 Limited availability!</Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          {concert.description && (
            <View style={styles.descSection}>
              <Text style={styles.sectionTitle}>About This Concert</Text>
              <Text style={styles.description}>{concert.description}</Text>
            </View>
          )}

          {/* Ticket Categories */}
          {concert.ticket_categories && concert.ticket_categories.length > 0 && (
            <View style={styles.ticketSection}>
              <Text style={styles.sectionTitle}>Ticket Categories</Text>
              {concert.ticket_categories.map((category, index) => (
                <View key={index} style={styles.ticketCard}>
                  <View style={styles.ticketInfo}>
                    <Text style={styles.ticketName}>{category.name}</Text>
                    <Text style={styles.ticketPrice}>
                      Rp {category.price?.toLocaleString('id-ID')}
                    </Text>
                  </View>
                  {category.available_seats && (
                    <Text style={styles.ticketSeats}>
                      {category.available_seats} available
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.bottomLabel}>Starting from</Text>
          <Text style={styles.bottomPrice}>
            Rp {minPrice.toLocaleString('id-ID')}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.bookBtn}
          onPress={() => {
            // TODO: Navigate to booking screen
            alert('Booking feature coming soon!');
          }}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  errorText: {
    color: COLORS.ivory,
    fontSize: 16,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.jade,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${COLORS.ivory}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: COLORS.ivory,
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    color: COLORS.ivory,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  posterContainer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: COLORS.surface,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    color: COLORS.ivory,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 34,
  },
  artist: {
    color: COLORS.jade,
    fontSize: 18,
    fontWeight: '600',
  },
  infoCards: {
    gap: 12,
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: COLORS.ivory,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoSubValue: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  limitedText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  descSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.ivory,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  ticketSection: {
    marginBottom: 24,
  },
  ticketCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketName: {
    color: COLORS.ivory,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketPrice: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketSeats: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  priceInfo: {
    flex: 1,
  },
  bottomLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  bottomPrice: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: 'bold',
  },
  bookBtn: {
    backgroundColor: COLORS.jade,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
