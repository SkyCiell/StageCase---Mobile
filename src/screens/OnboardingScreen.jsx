import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../utils/theme';

const SLIDES = [
  { title: "Exclusive Concerts", subtitle: "Book official tickets for Crayon Case shows across Indonesia." },
  { title: "Interactive Seating", subtitle: "Select your preferred seat section with real-time availability." },
  { title: "Instant QR E-Tickets", subtitle: "Receive your venue entry pass straight to your phone." },
];

export default function OnboardingScreen({ navigation }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      setIndex(index + 1);
    } else {
      navigation.navigate('Login');
    }
  };

  const current = SLIDES[index];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Skip Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.skipText}>Skip →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 48 }}>🎵</Text>
        </View>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setIndex(i)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <View style={[styles.dot, i === index && styles.activeDot]} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{index === SLIDES.length - 1 ? 'Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
  },
  skipBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skipText: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.jade,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    color: COLORS.ivory,
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  footer: {
    gap: 24,
    marginBottom: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.jade,
  },
  button: {
    backgroundColor: COLORS.jade,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
