# 🔧 StageCase Mobile - Troubleshooting Guide

Panduan lengkap untuk mengatasi error umum di aplikasi mobile StageCase.

---

## 🚨 Common Errors

### 1. "Unable to resolve module axios"

**Error Message:**
```
Unable to resolve "axios" from "src/services/api.js"
```

**Cause:** Package `axios` belum terinstall.

**Solution:**
```bash
cd mobile
npm install axios
npx expo start --clear
```

---

### 2. "Unable to resolve module [SERVICE_NAME]"

**Error Message:**
```
Unable to resolve "../../services/concertService" from "src/screens/HomeScreen.jsx"
```

**Cause:** Import path salah.

**Solution:** 
Cek import path. Dari folder `screens/`, path ke `services/` adalah `../services/`:

```javascript
// ✅ Correct
import { concertService } from '../services/concertService';
import { useAuth } from '../context/AuthContext';

// ❌ Wrong
import { concertService } from '../../services/concertService';
```

**Path Rules:**
- `screens/` → `services/` = `../services/`
- `screens/` → `context/` = `../context/`
- `screens/` → `utils/` = `../utils/`
- `screens/auth/` → `services/` = `../../services/`
- `screens/auth/` → `context/` = `../../context/`

---

### 3. Network Error / API Connection Failed

**Error Message:**
```
Error: Network Error
AxiosError: Request failed with status code undefined
```

**Causes & Solutions:**

#### A. Backend tidak running
```bash
# Check backend
cd backend
npm start
# Pastikan muncul: "Server running on port 5000"
```

#### B. API_BASE salah

Edit `mobile/src/services/api.js`:

```javascript
// Pilih sesuai device
export const API_BASE = 'http://10.0.2.2:5000/api';        // Android Emulator
export const API_BASE = 'http://localhost:5000/api';       // iOS Simulator
export const API_BASE = 'http://192.168.1.14:5000/api';    // Device Fisik
```

**Cara cek IP komputer:**
```bash
# Windows
ipconfig
# Lihat IPv4 Address di WiFi adapter

# Mac/Linux
ifconfig
# Lihat inet di en0 (WiFi)
```

#### C. Device dan komputer beda network

**Solution:** Pastikan HP dan komputer connect ke WiFi yang sama.

#### D. Firewall blocking

**Windows:**
1. Open Windows Defender Firewall
2. Allow Node.js atau port 5000

**Mac:**
```bash
# Allow incoming connections
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which node)
```

---

### 4. Metro Bundler Cache Issue

**Error Message:**
```
Error: Unable to resolve module
TransformError: ...
```

**Solution:**
```bash
# Clear cache
npx expo start --clear

# atau full clean
rm -rf node_modules
npm install
npx expo start --clear
```

---

### 5. "Expo Go not installed"

**Error Message:**
```
Couldn't start project on Android: No Android device available
```

**Solution:**

**Option A: Install Expo Go**
- Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

**Option B: Use Emulator**
```bash
# Android
# 1. Open Android Studio
# 2. AVD Manager → Start emulator
# 3. npm run android

# iOS (Mac only)
npm run ios
```

---

### 6. "Command failed: ./gradlew" (Android)

**Error Message:**
```
Command failed: ./gradlew app:installDebug -PreactNativeDevServerPort=8081
```

**Solutions:**

#### A. Missing Android SDK
1. Install Android Studio
2. Open Android Studio → SDK Manager
3. Install SDK Platform 33 (Android 13)
4. Install SDK Build-Tools

#### B. Environment variables
```bash
# Windows (System Environment Variables)
ANDROID_HOME = C:\Users\[USER]\AppData\Local\Android\Sdk

# Add to PATH
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\tools
```

#### C. Gradle permission (Mac/Linux)
```bash
cd android
chmod +x gradlew
```

---

### 7. "Maximum call stack size exceeded"

**Error Message:**
```
RangeError: Maximum call stack size exceeded
```

**Cause:** Circular dependency atau infinite loop.

**Solutions:**

#### A. Check imports
```javascript
// ❌ Circular import
// AuthContext.js imports from HomeScreen
// HomeScreen imports from AuthContext

// ✅ One-way import
// HomeScreen imports from AuthContext only
```

#### B. Clear cache
```bash
npx expo start --clear
```

---

### 8. "Unable to find module @react-navigation"

**Error Message:**
```
Unable to resolve module @react-navigation/native
```

**Solution:**
```bash
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npx expo start --clear
```

---

### 9. AsyncStorage Error

**Error Message:**
```
Error: @react-native-async-storage/async-storage not found
```

**Solution:**
```bash
npm install @react-native-async-storage/async-storage
npx expo start --clear
```

---

### 10. "Unauthorized" / 401 Error

**Error Message:**
```
Request failed with status code 401
```

**Causes:**

#### A. Token expired
```javascript
// Solution: Logout and login again
const { logout } = useAuth();
logout();
```

#### B. Token tidak tersimpan
```javascript
// Check storage
import { getToken } from '../utils/storage';

const token = await getToken();
console.log('Token:', token); // Should not be null
```

#### C. Backend auth middleware error

Check backend `/api/users/me` endpoint:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/users/me
```

---

## 🔍 Debugging Tips

### 1. Enable Console Logs

**In api.js:**
```javascript
api.interceptors.request.use(async (config) => {
  console.log('📤 API Request:', config.method.toUpperCase(), config.url);
  console.log('📦 Data:', config.data);
  // ...
});

api.interceptors.response.use(
  (res) => {
    console.log('✅ API Response:', res.status, res.config.url);
    console.log('📦 Data:', res.data);
    return res;
  },
  (err) => {
    console.error('❌ API Error:', err.response?.status, err.config?.url);
    console.error('📦 Error Data:', err.response?.data);
    // ...
  }
);
```

### 2. Check State

```javascript
import { useAuth } from '../context/AuthContext';

function MyScreen() {
  const { user, isLoggedIn } = useAuth();
  
  console.log('User:', user);
  console.log('Is Logged In:', isLoggedIn);
}
```

### 3. Network Debugging

**Test API manually:**
```bash
# Test from terminal
curl http://192.168.1.14:5000/api/concerts

# Or use Postman/Insomnia
GET http://192.168.1.14:5000/api/concerts
```

### 4. Device Logs

**Android:**
```bash
# Real-time logs
adb logcat *:S ReactNative:V ReactNativeJS:V

# Or in Android Studio
View → Tool Windows → Logcat
```

**iOS:**
```bash
# Simulator logs
xcrun simctl spawn booted log stream --level=debug
```

---

## 🛠 Complete Reset

Jika semua cara gagal, lakukan complete reset:

```bash
# 1. Stop all processes
# Ctrl+C di terminal yang running expo

# 2. Clear cache
cd mobile
rm -rf node_modules
rm -rf .expo
rm package-lock.json

# 3. Clean install
npm install

# 4. Clear Metro cache
npx expo start --clear

# 5. If still failing, restart computer
```

---

## 📱 Device-Specific Issues

### Android Emulator

**Issue: Emulator lambat**
```
Solution: 
1. AVD Manager → Edit AVD
2. Graphics: Hardware
3. RAM: 2048 MB minimum
4. Enable "Use Host GPU"
```

**Issue: Keyboard tidak muncul**
```
Solution: Ctrl+Shift+K di emulator
```

### iOS Simulator (Mac)

**Issue: Simulator crash**
```bash
# Reset simulator
xcrun simctl erase all

# Restart simulator
```

### Physical Device

**Issue: Device tidak terdetect**

**Android:**
```bash
# Enable USB Debugging
# Settings → About Phone → Tap Build Number 7x
# Developer Options → USB Debugging → ON

# Check device
adb devices
```

**iOS:**
```
# Trust this computer
# Popup akan muncul di device
```

---

## 🔄 Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all
npm update

# Or update specific package
npm install axios@latest

# After update
npx expo start --clear
```

---

## 📞 Still Need Help?

### Check Logs

1. **Metro Bundler Terminal** - Error messages
2. **Device/Emulator** - Runtime errors
3. **Backend Terminal** - API errors
4. **Network Tab** - API calls (Chrome DevTools)

### Debug Checklist

- [ ] Backend is running
- [ ] API_BASE is correct
- [ ] Device and computer on same network
- [ ] Token is saved (check AsyncStorage)
- [ ] Import paths are correct
- [ ] All dependencies installed
- [ ] Cache cleared
- [ ] No typos in code

### Common Fixes Summary

```bash
# 90% of issues solved by:
npm install
npx expo start --clear

# If not solved:
rm -rf node_modules
npm install
npx expo start --clear

# Still not solved:
# Check API_BASE
# Check backend is running
# Check network connection
```

---

## 🎯 Best Practices to Avoid Issues

1. **Always use correct import paths**
2. **Install packages before using**
3. **Clear cache after installing packages**
4. **Check API_BASE before testing**
5. **Keep dependencies up to date**
6. **Use console.log for debugging**
7. **Test API in Postman first**
8. **Keep backend running while testing**

---

Happy debugging! 🐛🔧
