import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, SafeAreaView, Image, StatusBar, Alert, Platform,
} from 'react-native';
import { concertService } from '../services/concertService';
import { bookingService } from '../services/bookingService';
import { COLORS, getBandColor } from '../utils/theme';
import { getConcertPoster } from '../utils/covers';

function formatCurrency(amount) {
  if (!amount) return 'IDR 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateFull(dateStr) {
  if (!dateStr) return 'Date TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ConcertDetailScreen({ route, navigation }) {
  const { concertId, slug, id } = route.params || {};
  const targetSlug = slug;
  const targetId = id || concertId;

  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchConcertDetail();
  }, []);

  const fetchConcertDetail = async () => {
    try {
      let res;
      if (targetSlug) {
        res = await concertService.getConcertBySlug(targetSlug);
      } else if (targetId) {
        res = await concertService.getConcerts({ id: targetId });
      }
      const data = res?.data?.data || res?.data;
      setConcert(data);
      const categories = data?.ticketCategories || data?.ticket_categories || [
        { id: 1, name: 'VIP FRONT', price: 750000, description: 'Front stage area + Merch' },
        { id: 2, name: 'REGULAR TIER 1', price: 350000, description: 'General admission standing' },
      ];
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    } catch (error) {
      console.error('Error fetching concert detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedCategory?.id && !selectedCategory?.ticket_category_id) {
      const msg = 'Silakan pilih kategori tiket terlebih dahulu.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Kategori Tiket', msg);
      return;
    }

    const categoryId = selectedCategory.id || selectedCategory.ticket_category_id;
    setSubmitting(true);
    try {
      await bookingService.createBooking({
        concert_id: concert.id,
        items: [
          {
            ticket_category_id: categoryId,
            quantity: 1,
          },
        ],
      });

      const successMsg = `Pemesanan tiket ${selectedCategory.name || 'Konsep'} Berhasil! E-Ticket QR Code telah dibuat.`;
      if (Platform.OS === 'web') {
        window.alert(successMsg);
        navigation.navigate('Main', { screen: 'MyTickets' });
      } else {
        Alert.alert('Sukses 🎉', successMsg, [
          { text: 'Lihat Tiket Saya', onPress: () => navigation.navigate('Main', { screen: 'MyTickets' }) }
        ]);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Gagal membuat pesanan tiket.';
      if (Platform.OS === 'web') window.alert(`Gagal Beli Tiket: ${errorMsg}`);
      else Alert.alert('Gagal Beli Tiket', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!concert) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Concert details unavailable</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const posterUri = getConcertPoster(concert);
  const bandColor = getBandColor(concert.artist_name);
  const categories = concert.ticketCategories || concert.ticket_categories || [
    { name: 'VIP FRONT', price: 750000, description: 'Front stage area + Merch' },
    { name: 'REGULAR TIER 1', price: 350000, description: 'General admission standing' },
  ];

  const minPrice = categories.length
    ? Math.min(...categories.map(c => Number(c.price)))
    : 350000;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Floating Back Navigation Bar */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.navBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.navBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>{concert.title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ── Poster Banner Hero ── */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: posterUri }} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          
          <View style={styles.heroBadgeRow}>
            <Text style={[styles.artistTag, { color: bandColor.accent }]}>
              {concert.artist_name || 'LIVE CONCERT'}
            </Text>
          </View>
          
          <Text style={styles.heroTitle}>{concert.title}</Text>
        </View>

        <View style={styles.bodyContent}>
          {/* ── Info Cards ── */}
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📅</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>DATE & TIME</Text>
                <Text style={styles.infoVal}>{formatDateFull(concert.date)}</Text>
                <Text style={styles.infoSubVal}>Doors Open: 18:00 WIB</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>VENUE & LOCATION</Text>
                <Text style={styles.infoVal}>{concert.venue?.name || 'Main Stage Venue'}</Text>
                <Text style={styles.infoSubVal}>{concert.venue?.city || 'Indonesia'}</Text>
              </View>
            </View>
          </View>

          {/* ── Description ── */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>ABOUT THE EVENT</Text>
            <Text style={styles.descText}>
              {concert.description || `${concert.title} live experience by ${concert.artist_name || 'artist'}. Grab your digital ticket pass now on StageCase.`}
            </Text>
          </View>

          {/* ── Ticket Category Selection ── */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>SELECT TICKET CATEGORY</Text>
            {categories.map((cat, idx) => {
              const isSelected = selectedCategory?.name === cat.name;
              return (
                <TouchableOpacity
                  key={cat.name || idx}
                  style={[styles.tierCard, isSelected && { borderColor: bandColor.accent, backgroundColor: COLORS.surface }]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <View style={styles.tierHeader}>
                    <Text style={styles.tierName}>{cat.name}</Text>
                    <Text style={styles.tierPrice}>{formatCurrency(cat.price)}</Text>
                  </View>
                  {cat.description && (
                    <Text style={styles.tierDesc}>{cat.description}</Text>
                  )}
                  {isSelected && (
                    <View style={[styles.selectedCheck, { backgroundColor: bandColor.accent }]}>
                      <Text style={styles.checkText}>✓ SELECTED</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Booking Bar ── */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceCol}>
          <Text style={styles.bottomPriceLabel}>TOTAL PRICE</Text>
          <Text style={styles.bottomPriceVal}>
            {formatCurrency(selectedCategory?.price || minPrice)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: bandColor.primary }, submitting && { opacity: 0.6 }]}
          onPress={handleCreateBooking}
          disabled={submitting}
          activeOpacity={0.88}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.ivory} size="small" />
          ) : (
            <Text style={styles.bookBtnText}>BUY TICKET →</Text>
          )}
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
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  navBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navBackText: {
    color: COLORS.ivory,
    fontSize: 18,
    fontWeight: '800',
  },
  navTitle: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroContainer: {
    height: 240,
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: COLORS.card,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 17, 23, 0.65)',
  },
  heroBadgeRow: {
    marginBottom: 6,
  },
  artistTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: COLORS.ivory,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 28,
  },
  bodyContent: {
    padding: 20,
    gap: 20,
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  infoIcon: {
    fontSize: 20,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  infoVal: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  infoSubVal: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  descText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  tierCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    position: 'relative',
    marginBottom: 10,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  tierName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  tierPrice: {
    color: COLORS.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  tierDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  selectedCheck: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 10,
  },
  checkText: {
    color: COLORS.ivory,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomPriceCol: {
    flex: 1,
  },
  bottomPriceLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bottomPriceVal: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 2,
  },
  bookBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  bookBtnText: {
    color: COLORS.ivory,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginBottom: 16,
  },
  backButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: COLORS.ivory,
    fontWeight: '800',
  },
});
