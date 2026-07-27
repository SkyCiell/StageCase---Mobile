import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah kamu yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'SC';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={{ color: COLORS.jade, fontSize: 24, fontWeight: 'bold' }}>
            {initials}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'StageCase User'}</Text>
        <Text style={styles.email}>{user?.email || 'user@stagecase.id'}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📧</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuLabel}>Email</Text>
            <Text style={styles.menuValue}>{user?.email || 'N/A'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📱</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuLabel}>Phone</Text>
            <Text style={styles.menuValue}>{user?.phone || 'Not set'}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🎟️</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuLabel}>Total Bookings</Text>
            <Text style={styles.menuValue}>0</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  header: { marginBottom: 20 },
  title: { color: COLORS.ivory, fontSize: 22, fontWeight: 'bold' },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.darkJade,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { color: COLORS.ivory, fontSize: 18, fontWeight: 'bold' },
  email: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  menuSection: {
    gap: 12,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  menuValue: {
    color: COLORS.ivory,
    fontSize: 14,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

