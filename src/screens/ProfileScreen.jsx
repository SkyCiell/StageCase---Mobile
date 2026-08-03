import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to log out of StageCase?');
      if (confirmed) {
        await logout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to log out of StageCase?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => await logout()
          }
        ]
      );
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SC';

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Fan Profile</Text>
        <Text style={styles.subtitle}>StageCase Account & Preferences</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'StageCase Fan'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'fan@stagecase.id'}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.memberBadge}>
              <Text style={styles.memberBadgeText}>★ OFFICIAL PASS MEMBER</Text>
            </View>
          </View>
        </View>

        {/* Details List */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ACCOUNT DETAILS</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Profile Info', `Full Name: ${user?.name || 'Not specified'}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.menuIcon}>👤</Text>
            <View style={styles.menuCol}>
              <Text style={styles.menuLabel}>FULL NAME</Text>
              <Text style={styles.menuVal}>{user?.name || 'Not specified'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Profile Info', `Email: ${user?.email || 'Not specified'}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.menuIcon}>✉️</Text>
            <View style={styles.menuCol}>
              <Text style={styles.menuLabel}>EMAIL ADDRESS</Text>
              <Text style={styles.menuVal}>{user?.email || 'Not specified'}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('Profile Info', `Phone: ${user?.phone || 'Not linked'}`)}
            activeOpacity={0.8}
          >
            <Text style={styles.menuIcon}>📱</Text>
            <View style={styles.menuCol}>
              <Text style={styles.menuLabel}>PHONE NUMBER</Text>
              <Text style={styles.menuVal}>{user?.phone || 'Not linked'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>MY ACTIVITY & EXPLORE</Text>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('MyTickets')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🎟️</Text>
            <Text style={styles.actionText}>View My Digital E-Tickets</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate('Concerts')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>🎤</Text>
            <Text style={styles.actionText}>Explore Upcoming Concerts</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.88}>
          <Text style={styles.logoutText}>SIGN OUT</Text>
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: COLORS.ivory,
    fontSize: 24,
    fontWeight: '900',
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  userEmail: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  memberBadge: {
    backgroundColor: COLORS.goldSubtle,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  memberBadgeText: {
    color: COLORS.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 14,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuCol: {
    flex: 1,
  },
  menuLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  menuVal: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    gap: 12,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionText: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  arrow: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '800',
  },
  logoutBtn: {
    backgroundColor: 'rgba(248, 81, 73, 0.15)',
    borderWidth: 1,
    borderColor: COLORS.error,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
