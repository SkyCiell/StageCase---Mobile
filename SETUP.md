# StageCase Mobile App - Setup Guide

## 📱 React Native / Expo Mobile App (Android & iOS)

Aplikasi mobile StageCase untuk user (tanpa admin panel).

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Konfigurasi Backend API

Edit file `src/services/api.js` dan sesuaikan `API_BASE` dengan environment kamu:

```javascript
// src/services/api.js
export const API_BASE = 'http://192.168.1.14:5000/api';
```

**Pilihan API_BASE berdasarkan device:**

- **Android Emulator**: `http://10.0.2.2:5000/api`
- **iOS Simulator**: `http://localhost:5000/api`
- **Device Fisik (HP)**: `http://[IP_KOMPUTER]:5000/api`

**Cara cek IP komputer:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

Lihat di `IPv4 Address` atau `inet`.

### 3. Jalankan Backend Server

Pastikan backend sudah running:

```bash
cd backend
npm start
# Backend running di http://localhost:5000
```

### 4. Start Expo Development Server

```bash
cd mobile
npm start
# atau
npx expo start
```

### 5. Run di Device

Setelah Expo DevTools muncul:

- **Android**: Tekan `a` (otomatis buka emulator atau device)
- **iOS**: Tekan `i` (butuh Mac)
- **Web**: Tekan `w` (browser preview)

---

## 📦 Dependencies

### Core Dependencies

```json
{
  "axios": "^1.7.0",                              // HTTP client
  "@react-navigation/native": "^7.0.14",          // Navigation
  "@react-navigation/native-stack": "^7.2.0",     // Stack navigator
  "@react-native-async-storage/async-storage": "^3.1.1", // Storage
  "react-native-qrcode-svg": "^6.3.21",          // QR Code generator
  "react-native-svg": "^15.15.5",                // SVG support
  "expo": "~54.0.0",                             // Expo SDK
  "react": "19.1.0",
  "react-native": "0.81.5"
}
```

### Install Manual (jika ada yang kurang)

```bash
npm install axios
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-native-async-storage/async-storage
npm install react-native-qrcode-svg react-native-svg
```

---

## 📁 Project Structure

```
mobile/
├── App.js                      # Root app dengan navigation
├── index.js                    # Entry point
├── package.json
├── src/
│   ├── screens/                # Semua screens
│   │   ├── HomeScreen.jsx
│   │   ├── ConcertListScreen.jsx
│   │   ├── MyTicketsScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   ├── SplashScreen.jsx
│   │   ├── OnboardingScreen.jsx
│   │   └── auth/
│   │       ├── LoginScreen.jsx
│   │       └── RegisterScreen.jsx
│   ├── services/               # API services
│   │   ├── api.js              # Axios config
│   │   ├── authService.js
│   │   ├── concertService.js
│   │   └── bookingService.js
│   ├── context/                # React Context
│   │   └── AuthContext.js      # Auth state management
│   ├── utils/                  # Utilities
│   │   ├── theme.js            # Colors & fonts
│   │   └── storage.js          # AsyncStorage helpers
│   └── components/             # Reusable components
└── assets/                     # Images, fonts, icons
```

---

## 🎨 Design System

### Colors (COLORS dari theme.js)

```javascript
import { COLORS } from '../utils/theme';

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background },
  text: { color: COLORS.ivory },
  button: { backgroundColor: COLORS.jade }
});
```

**Available Colors:**
- `background` - #121A33 (Midnight Blue)
- `surface` - #1D2A4F (Card surface)
- `jade` - #2F5FDC (Primary blue/CTA)
- `gold` - #B89B5E (Accent)
- `ivory` - #EEE9DF (Text)
- `textSecondary` - #A8AFB4
- `border` - rgba(255,255,255,0.08)
- `success` - #4CAF7A
- `warning` - #E7B567
- `error` - #D65A5A

### Typography

All screens use React Native default fonts (System).

---

## 🔐 Authentication Flow

### Login Flow
1. User buka app → `SplashScreen` (loading)
2. Jika belum login → `OnboardingScreen`
3. Tap "Get Started" → `LoginScreen`
4. Login berhasil → save token → redirect ke `HomeScreen`

### Auth State Management

```javascript
import { useAuth } from '../context/AuthContext';

function MyScreen() {
  const { user, isLoggedIn, login, logout } = useAuth();
  
  // Check if logged in
  if (!isLoggedIn) {
    // Show login prompt
  }
  
  // Get user data
  console.log(user.name, user.email);
  
  // Logout
  const handleLogout = () => {
    logout();
  };
}
```

### Token Storage

Token disimpan di AsyncStorage:

```javascript
import { saveToken, getToken, removeToken } from '../utils/storage';

// Save token
await saveToken('your-jwt-token');

// Get token
const token = await getToken();

// Remove token (logout)
await removeToken();
```

---

## 🛠 Common Issues & Solutions

### Issue 1: "Unable to resolve module axios"

**Solution:**
```bash
cd mobile
npm install axios
npx expo start --clear
```

### Issue 2: "Network Error" saat API call

**Solutions:**
1. Pastikan backend running di `http://localhost:5000`
2. Cek API_BASE di `src/services/api.js`
3. Untuk Android emulator, gunakan `http://10.0.2.2:5000/api`
4. Untuk device fisik, pastikan HP dan komputer di network WiFi yang sama

### Issue 3: Import path error

Pastikan import path benar:

```javascript
// ✅ Correct (dari screens/)
import { concertService } from '../services/concertService';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../utils/theme';

// ❌ Wrong
import { concertService } from '../../services/concertService';
```

### Issue 4: Metro bundler cache issue

```bash
npx expo start --clear
# atau
rm -rf node_modules
npm install
npx expo start
```

### Issue 5: "Expo Go not installed"

Install Expo Go di HP:
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

---

## 📱 Testing

### Test di Android Emulator

1. Buka Android Studio
2. Start AVD (Android Virtual Device)
3. Run: `npm run android`

### Test di iOS Simulator (Mac only)

1. Install Xcode
2. Run: `npm run ios`

### Test di Device Fisik

1. Install Expo Go app
2. Run: `npm start`
3. Scan QR code dengan Expo Go (Android) atau Camera (iOS)

---

## 🚀 Build Production APK/IPA

### Android APK (via EAS Build)

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### iOS IPA (Mac + Apple Developer Account required)

```bash
eas build --platform ios --profile preview
```

### Local Build (tanpa EAS)

```bash
# Android
npx expo run:android

# iOS
npx expo run:ios
```

---

## 🔧 Configuration Files

### app.json (Expo Config)

```json
{
  "expo": {
    "name": "StageCase",
    "slug": "stagecase-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#121A33"
    },
    "android": {
      "package": "com.stagecase.mobile",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#121A33"
      }
    },
    "ios": {
      "bundleIdentifier": "com.stagecase.mobile",
      "supportsTablet": true
    }
  }
}
```

---

## 📝 API Services Usage

### Concert Service

```javascript
import { concertService } from '../services/concertService';

// Get all concerts
const concerts = await concertService.getConcerts({ limit: 10 });

// Get concert by slug
const concert = await concertService.getConcertBySlug('concert-slug');

// Get seats for a concert
const seats = await concertService.getSeats(concertId);
```

### Auth Service

```javascript
import { authService } from '../services/authService';

// Login
const result = await authService.login(email, password);
// result.data.data = { token, user }

// Register
const result = await authService.register(name, email, password);

// Get current user
const user = await authService.getMe();
```

### Booking Service

```javascript
import { bookingService } from '../services/bookingService';

// Get user's bookings
const bookings = await bookingService.getMyBookings();

// Get booking detail
const booking = await bookingService.getBookingById(bookingId);
```

---

## 🎯 Features

### Current Features
- ✅ Authentication (Login/Register/Logout)
- ✅ Home screen dengan featured concerts
- ✅ Concert list
- ✅ My tickets (placeholder)
- ✅ User profile
- ✅ Token-based auth
- ✅ Persistent login (AsyncStorage)
- ✅ Pull-to-refresh

### Upcoming Features (To-Do)
- [ ] Concert detail screen
- [ ] Seat selection
- [ ] Booking flow
- [ ] Payment upload
- [ ] QR code ticket
- [ ] Push notifications
- [ ] Favorites
- [ ] Search concerts

---

## 🐛 Debug Mode

Enable console logs:

```javascript
// src/services/api.js
api.interceptors.request.use(async (config) => {
  console.log('API Request:', config.method.toUpperCase(), config.url);
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    console.log('API Response:', res.status, res.config.url);
    return res;
  },
  async (err) => {
    console.error('API Error:', err.response?.status, err.config?.url);
    if (err.response?.status === 401) {
      await removeToken();
    }
    return Promise.reject(err);
  }
);
```

---

## 📞 Support

Jika ada masalah:
1. Check console logs di Metro bundler
2. Check backend logs
3. Pastikan API_BASE sudah benar
4. Clear cache: `npx expo start --clear`
5. Reinstall: `rm -rf node_modules && npm install`

---

## ✅ Checklist Before Running

- [ ] Backend server running (`cd backend && npm start`)
- [ ] API_BASE configured correctly in `src/services/api.js`
- [ ] Dependencies installed (`npm install`)
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] Device/emulator ready
- [ ] Network connected (device fisik harus satu WiFi dengan komputer)

---

Happy coding! 🚀🎉
