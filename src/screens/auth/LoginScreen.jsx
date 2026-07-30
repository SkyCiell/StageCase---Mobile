import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      const msg = 'Silakan isi email dan password Anda.';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login gagal. Periksa kembali email & password.';
      if (Platform.OS === 'web') window.alert(`Login Gagal: ${msg}`);
      else Alert.alert('Login Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View style={styles.brandRow}>
            <Text style={styles.brand}>StageCase</Text>
            <Text style={styles.brandSub}>EVERY STAGE BEGINS HERE</Text>
          </View>

          {/* Editorial Heading */}
          <View style={styles.headingBlock}>
            <View style={styles.accentRow}>
              <View style={styles.accentLine} />
              <Text style={styles.accentLabel}>Sign In</Text>
            </View>
            <Text style={styles.heading}>Welcome back</Text>
            <Text style={styles.sub}>
              Enter your credentials to manage your tickets and bookings.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="name@domain.com"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(p => !p)}
                  style={styles.showBtn}
                >
                  <Text style={styles.showBtnText}>
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={COLORS.ivory} size="small" />
                : <Text style={styles.btnText}>SIGN IN</Text>
              }
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Register link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account yet?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>  Create one now →</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.copyright}>
            Protected by StageCase Auth • All rights reserved
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },

  // Brand
  brandRow: {
    alignItems: 'center',
    marginBottom: 48,
  },
  brand: {
    color: COLORS.ivory,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  brandSub: {
    color: COLORS.bronze,
    fontSize: 8,
    letterSpacing: 3,
    marginTop: 3,
  },

  // Heading
  headingBlock: {
    marginBottom: 36,
  },
  accentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  accentLine: {
    width: 12,
    height: 1,
    backgroundColor: COLORS.bronze,
  },
  accentLabel: {
    color: COLORS.bronze,
    fontSize: 10,
    letterSpacing: 3,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  heading: {
    color: COLORS.ivory,
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  sub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },

  // Form
  form: {
    gap: 24,
    marginBottom: 32,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLORS.ivory,
    fontSize: 14,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  showBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  showBtnText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Button
  btn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(245,243,245,0.2)',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: COLORS.ivory,
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 3,
  },

  // Footer
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  footerLink: {
    color: COLORS.bronze,
    fontSize: 12,
    fontWeight: '600',
  },
  copyright: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
    opacity: 0.5,
  },
});
