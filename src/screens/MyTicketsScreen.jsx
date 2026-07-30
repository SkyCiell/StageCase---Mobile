import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, SafeAreaView,
  TouchableOpacity, ActivityIndicator, RefreshControl, Modal,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { bookingService } from '../services/bookingService';
import { COLORS } from '../utils/theme';
import DigitalTicketPass from '../components/DigitalTicketPass';

export default function MyTicketsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // QR Modal State
  const [activeQR, setActiveQR] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      const list = response.data?.data || response.data || [];
      setBookings(list);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Digital Passes</Text>
        <Text style={styles.subtitle}>
          {bookings.length} active entry ticket{bookings.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🎟️</Text>
          <Text style={styles.emptyTitle}>No Passes Found</Text>
          <Text style={styles.emptySub}>
            Book your live concert tickets on StageCase to access your digital QR entry pass anytime.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate('Concerts')}
            activeOpacity={0.8}
          >
            <Text style={styles.browseBtnText}>Explore Concerts</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => (item.id || item.booking_code).toString()}
          renderItem={({ item }) => (
            <DigitalTicketPass
              ticket={item}
              onPressQR={(code) => setActiveQR({ code, ticket: item })}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => { setRefreshing(true); fetchBookings(); }}
              tintColor={COLORS.primary}
            />
          }
        />
      )}

      {/* ── Enlarged QR Pass Modal ── */}
      <Modal
        visible={!!activeQR}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveQR(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setActiveQR(null)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>OFFICIAL ENTRY QR</Text>
            <Text style={styles.modalTitle}>
              {activeQR?.ticket?.concert?.title || 'StageCase Event'}
            </Text>

            <View style={styles.qrContainer}>
              {activeQR?.code && (
                <QRCode
                  value={activeQR.code}
                  size={180}
                  backgroundColor="#FFFFFF"
                  color="#000000"
                />
              )}
            </View>

            <Text style={styles.qrCodeText}>{activeQR?.code}</Text>
            <Text style={styles.scanInstruction}>
              Show this QR code at the venue gate for check-in.
            </Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setActiveQR(null)}
            >
              <Text style={styles.closeBtnText}>Close Pass</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  list: {
    padding: 20,
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
    padding: 36,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 14,
    opacity: 0.5,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 24,
  },
  browseBtn: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: COLORS.ivory,
    fontSize: 13,
    fontWeight: '800',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 17, 23, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalHeader: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  modalTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 20,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
  },
  qrCodeText: {
    color: COLORS.gold,
    fontFamily: COLORS.mono,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  scanInstruction: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  closeBtnText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
});
