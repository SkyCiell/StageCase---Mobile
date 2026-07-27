import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, SafeAreaView, 
  TouchableOpacity, ActivityIndicator, RefreshControl, Image 
} from 'react-native';
import { bookingService } from '../services/bookingService';
import { COLORS } from '../utils/theme';
import { format } from 'date-fns';

export default function MyTicketsScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.textMuted;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'CONFIRMED';
      case 'pending':
        return 'PENDING';
      case 'cancelled':
        return 'CANCELLED';
      default:
        return status?.toUpperCase();
    }
  };

  const renderTicket = ({ item }) => {
    const concert = item.concert || {};
    const formattedDate = item.concert_date 
      ? format(new Date(item.concert_date), 'MMM dd, yyyy')
      : 'Date TBA';

    return (
      <TouchableOpacity 
        style={styles.ticketCard}
        onPress={() => navigation.navigate('TicketDetail', { bookingId: item.id })}
        activeOpacity={0.7}
      >
        {/* Header dengan status */}
        <View style={styles.ticketHeader}>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={styles.bookingId}>#{item.booking_code || item.id}</Text>
        </View>

        {/* Concert Info */}
        <View style={styles.ticketBody}>
          <Text style={styles.concertTitle}>{concert.title || 'Concert'}</Text>
          <Text style={styles.concertVenue}>
            {concert.venue?.name || 'Venue'} · {formattedDate}
          </Text>
          
          <View style={styles.ticketFooter}>
            <View>
              <Text style={styles.footerLabel}>Seats</Text>
              <Text style={styles.footerValue}>
                {item.booking_details?.length || 0} ticket(s)
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.footerLabel}>Total</Text>
              <Text style={styles.footerValue}>
                Rp {(item.total_amount || 0).toLocaleString('id-ID')}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code Icon */}
        {item.status === 'confirmed' && (
          <View style={styles.qrIndicator}>
            <Text style={styles.qrIcon}>📱</Text>
            <Text style={styles.qrText}>Tap to view QR</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My E-Tickets</Text>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.jade} />
        </View>
      </SafeAreaView>
    );
  }

  if (bookings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My E-Tickets</Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={{ fontSize: 64, marginBottom: 16 }}>🎟️</Text>
          <Text style={styles.emptyTitle}>No Tickets Yet</Text>
          <Text style={styles.emptySub}>
            Book a concert ticket to view your QR entry pass here.
          </Text>
          <TouchableOpacity 
            style={styles.emptyButton}
            onPress={() => navigation.navigate('Concerts')}
          >
            <Text style={styles.emptyButtonText}>Browse Concerts</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My E-Tickets</Text>
        <Text style={styles.subtitle}>{bookings.length} ticket(s)</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTicket}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.jade}
            colors={[COLORS.jade]}
          />
        }
      />
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
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40 
  },
  emptyTitle: { 
    color: COLORS.ivory, 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  emptySub: { 
    color: COLORS.textSecondary, 
    fontSize: 14, 
    textAlign: 'center', 
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: COLORS.jade,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 15,
  },
  list: { 
    padding: 20,
    gap: 16,
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderStyle: 'dashed',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bookingId: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  ticketBody: {
    padding: 16,
  },
  concertTitle: {
    color: COLORS.ivory,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  concertVenue: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: 16,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginBottom: 4,
  },
  footerValue: {
    color: COLORS.ivory,
    fontSize: 15,
    fontWeight: 'bold',
  },
  qrIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: `${COLORS.jade}15`,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderStyle: 'dashed',
  },
  qrIcon: {
    fontSize: 16,
  },
  qrText: {
    color: COLORS.jade,
    fontSize: 12,
    fontWeight: '600',
  },
});
