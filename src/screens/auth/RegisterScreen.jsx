import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../utils/theme';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const showAlert = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) return showAlert('Error', 'Semua field wajib diisi.');
    if (password.length < 8) return showAlert('Error', 'Password minimal 8 karakter.');
    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (err) {
      const msg = err.response?.data?.message || 'Registrasi gagal. Coba lagi.';
      showAlert('Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    const randomSuffix = Math.floor(Math.random() * 1000);
    setName(`Fan StageCase ${randomSuffix}`);
    setEmail(`fan${randomSuffix}@stagecase.id`);
    setPassword('password123');
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
          {/* Brand */}
          <View style={styles.brandRow}>
            <Text style={styles.brand}>StageCase</Text>
            <Text style={styles.brandSub}>EVERY STAGE BEGINS HERE</Text>
          </View>

          {/* Heading */}
          <View style={styles.headingBlock}>
            <View style={styles.accentRow}>
              <View style={styles.accentLine} />
              <Text style={styles.accentLabel}>Create Account</Text>
            </View>
            <Text style={styles.heading}>Join StageCase</Text>
            <Text style={styles.sub}>
              Register to access exclusive ticket drops and priority seating.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nama lengkap"
                placeholderTextColor={COLORS.textMuted}
                autoCapitalize="words"
              />
            </View>

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
                  placeholder="Min. 8 karakter"
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
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={COLORS.ivory} size="small" />
                : <Text style={styles.btnText}>CREATE ACCOUNT</Text>
              }
            </TouchableOpacity>

            {/* Quick Auto-Fill */}
            <TouchableOpacity
              style={styles.quickFillBtn}
              onPress={handleQuickFill}
              activeOpacity={0.85}
            >
              <Text style={styles.quickFillText}>✨ AUTO-FILL DEMO DATA</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Login link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>  Sign In →</Text>
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

  headingBlock: {
    marginBottom: 32,
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

  btn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: 'rgba(245,243,245,0.2)',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    color: COLORS.ivory,
    fontWeight: 'bold',
    fontSize: 11,
    letterSpacing: 3,
  },
  quickFillBtn: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.gold,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 8,
  },
  quickFillText: {
    color: COLORS.gold,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1.5,
  },

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
