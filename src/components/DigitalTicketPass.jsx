import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
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

function formatDate(dateStr) {
  if (!dateStr) return 'TBA';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function DigitalTicketPass({ ticket, onPressQR }) {
  if (!ticket) return null;

  const concert = ticket.concert || {};
  const bandColor = getBandColor(concert.artist_name);
  const posterUri = getConcertPoster(concert);
  const qrCodeValue = ticket.ticket_code || ticket.booking_code || `STAGECASE-${ticket.id}`;
  const status = (ticket.status || 'CONFIRMED').toUpperCase();

  const isConfirmed = status === 'CONFIRMED' || status === 'PAID';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPressQR && onPressQR(qrCodeValue)}
      activeOpacity={0.92}
    >
      {/* ── Top Header Banner ── */}
      <View style={[styles.headerBanner, { backgroundColor: bandColor.primary }]}>
        <View style={styles.headerRow}>
          <Text style={styles.brandText}>STAGECASE PASS</Text>
          <View style={[styles.statusBadge, isConfirmed ? styles.statusConfirmed : styles.statusPending]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>
      </View>

      {/* ── Ticket Content ── */}
      <View style={styles.body}>
        <View style={styles.concertRow}>
          <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
          <View style={styles.concertDetails}>
            <Text style={[styles.artistTag, { color: bandColor.accent }]}>
              {concert.artist_name || 'LIVE CONCERT'}
            </Text>
            <Text style={styles.concertTitle} numberOfLines={2}>
              {concert.title || 'Concert Ticket'}
            </Text>
            <Text style={styles.metaText} numberOfLines={1}>
              📅 {formatDate(concert.date)}
            </Text>
            <Text style={styles.metaText} numberOfLines={1}>
              📍 {concert.venue?.name || 'Venue TBA'}
            </Text>
          </View>
        </View>

        {/* ── Perforated Tear Divider ── */}
        <View style={styles.tearContainer}>
          <View style={styles.notchLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.notchRight} />
        </View>

        {/* ── Pass Info Details ── */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>CATEGORY</Text>
            <Text style={styles.infoValGold}>
              {ticket.details?.[0]?.ticketCategory?.name || ticket.category_name || ticket.ticket_category?.name || 'REGULAR'}
            </Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>SEAT / QTY</Text>
            <Text style={styles.infoVal}>
              {ticket.seat_number || `${ticket.details?.length || ticket.quantity || 1} Ticket(s)`}
            </Text>
          </View>

          <View style={styles.infoColRight}>
            <Text style={styles.infoLabel}>TOTAL</Text>
            <Text style={styles.infoVal}>
              {formatCurrency(ticket.total_price || ticket.price)}
            </Text>
          </View>
        </View>

        {/* ── QR Section ── */}
        <View style={styles.qrSection}>
          <View style={styles.qrBg}>
            <QRCode value={qrCodeValue} size={64} backgroundColor="#FFFFFF" color="#000000" />
          </View>
          <View style={styles.qrInfo}>
            <Text style={styles.qrCodeText}>{qrCodeValue}</Text>
            <Text style={styles.tapToEnlarge}>🔍 Tap anywhere on pass to view full QR</Text>
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
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  headerBanner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandText: {
    color: COLORS.ivory,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(63, 185, 80, 0.25)',
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  statusPending: {
    backgroundColor: 'rgba(210, 153, 34, 0.25)',
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  statusText: {
    color: COLORS.ivory,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  body: {
    padding: 16,
  },
  concertRow: {
    flexDirection: 'row',
    gap: 14,
  },
  poster: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
  },
  concertDetails: {
    flex: 1,
  },
  artistTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 2,
  },
  concertTitle: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 4,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 1,
  },
  tearContainer: {
    height: 24,
    marginHorizontal: -16,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  notchLeft: {
    width: 14,
    height: 24,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: COLORS.background,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    marginHorizontal: 8,
  },
  notchRight: {
    width: 14,
    height: 24,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: COLORS.background,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoCol: {
    flex: 1,
  },
  infoColRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  infoVal: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  infoValGold: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '800',
  },
  qrSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qrBg: {
    padding: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  qrInfo: {
    flex: 1,
  },
  qrCodeText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: COLORS.mono,
    letterSpacing: 1,
    marginBottom: 3,
  },
  tapToEnlarge: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
  },
});
