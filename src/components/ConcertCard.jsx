import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, getBandColor } from '../utils/theme';
import { getConcertPoster } from '../utils/covers';

function formatDate(dateStr) {
  if (!dateStr) return { day: '—', month: 'TBA' };
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
  };
}

function formatCurrency(amount) {
  if (!amount) return 'IDR 350.000';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ConcertCard({ concert, onPress }) {
  if (!concert) return null;

  const posterUri = getConcertPoster(concert);
  const bandColor = getBandColor(concert.artist_name);
  const { day, month } = formatDate(concert.date);

  const minPrice = concert.ticketCategories?.length
    ? Math.min(...concert.ticketCategories.map(c => Number(c.price)))
    : concert.min_price || 350000;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* ── Poster Section ── */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: posterUri }}
          style={styles.posterImage}
          resizeMode="cover"
        />

        {/* Date Overlay Badge */}
        <View style={[styles.dateBadge, { backgroundColor: bandColor.primary }]}>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateMonth}>{month}</Text>
        </View>

        {/* Featured Tag */}
        {concert.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>★ FEATURED</Text>
          </View>
        )}

        {/* Bottom Accent Bar */}
        <View style={[styles.accentBar, { backgroundColor: bandColor.primary }]} />
      </View>

      {/* ── Info Section ── */}
      <View style={styles.infoContainer}>
        {/* Artist Pill */}
        <Text style={[styles.artistTag, { color: bandColor.accent }]}>
          {concert.artist_name || 'LIVE CONCERT'}
        </Text>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {concert.title}
        </Text>

        {/* Venue */}
        <Text style={styles.venue} numberOfLines={1}>
          📍 {concert.venue?.name || 'Venue TBA'}{concert.venue?.city ? `, ${concert.venue.city}` : ''}
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Footer: Price & CTA */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.priceLabel}>FROM</Text>
            <Text style={styles.priceValue}>{formatCurrency(minPrice)}</Text>
          </View>

          <View style={[styles.ctaButton, { borderColor: bandColor.accent }]}>
            <Text style={[styles.ctaText, { color: bandColor.accent }]}>
              Book  →
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  posterContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    backgroundColor: COLORS.surface,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  dateDay: {
    color: COLORS.ivory,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 20,
  },
  dateMonth: {
    color: COLORS.ivory,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredText: {
    color: COLORS.background,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  infoContainer: {
    padding: 16,
  },
  artistTag: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  venue: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  priceValue: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '800',
    marginTop: 1,
  },
  ctaButton: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ctaText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
