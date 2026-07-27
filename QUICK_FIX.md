# 🚀 Quick Fix - Common Errors

## Error: "Unable to resolve ./BottomTabItem.js"

### Masalah:
```
Unable to resolve "./BottomTabItem.js" from 
"node_modules\@react-navigation\bottom-tabs\lib\module\views\BottomTabBar.js"
```

### Penyebab:
Version mismatch antara `@react-navigation/native` (v7) dan `@react-navigation/bottom-tabs` (v6).

### Solusi:

```bash
# 1. Uninstall bottom-tabs
npm uninstall @react-navigation/bottom-tabs

# 2. Clear npm cache
npm cache clean --force

# 3. Install versi yang compatible dengan v7
npm install @react-navigation/bottom-tabs@^7.1.0 --legacy-peer-deps

# 4. Clear Metro cache
npx expo start --clear
```

---

## Error: "Unable to resolve module axios"

### Solusi:
```bash
npm install axios
npx expo start --clear
```

---

## Error: Network Error saat API Call

### Checklist:

1. **Backend running?**
```bash
cd backend
npm start
# Harus lihat: "Server running on port 5000"
```

2. **API_BASE benar?**

Edit `src/services/api.js`:
```javascript
// Android Emulator
export const API_BASE = 'http://10.0.2.2:5000/api';

// HP Fisik (ganti dengan IP komputer)
export const API_BASE = 'http://192.168.1.14:5000/api';

// iOS Simulator
export const API_BASE = 'http://localhost:5000/api';
```

**Check IP komputer:**
```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

3. **Same WiFi?**
- HP dan komputer harus di WiFi yang sama

---

## Error: Metro Bundler Failed

### Solusi Complete Reset:

```bash
# Stop all processes (Ctrl+C)

# Delete caches
rm -rf node_modules/.cache
rm -rf .expo

# Restart
npx expo start --clear
```

---

## Error: Navigation "Home" not found

### Solusi:
Sudah fixed dengan bottom tabs. Pastikan:

1. App.js menggunakan MainTabs
2. OnboardingScreen navigate ke "Login" bukan "Home"
3. Auth flow: Onboarding → Login → Main (Tabs)

---

## Package Version Compatibility

**Working Versions:**

```json
{
  "@react-navigation/native": "^7.0.14",
  "@react-navigation/native-stack": "^7.2.0",
  "@react-navigation/bottom-tabs": "^7.1.0",
  "axios": "^1.7.0",
  "@react-native-async-storage/async-storage": "^3.1.1",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "~54.0.0"
}
```

---

## Complete Clean Install

Jika semua cara gagal:

```bash
# 1. Stop expo (Ctrl+C)

# 2. Delete everything
rm -rf node_modules
rm -rf .expo
rm -rf node_modules/.cache
rm package-lock.json

# 3. Fresh install
npm install

# 4. Start with clear cache
npx expo start --clear

# 5. If still failing, restart computer
```

---

## Windows PowerShell Commands

Gunakan ini jika command bash tidak work:

```powershell
# Delete node_modules
Remove-Item -Recurse -Force node_modules

# Delete .expo
Remove-Item -Recurse -Force .expo

# Delete cache
Remove-Item -Recurse -Force node_modules\.cache

# Install
npm install

# Start
npx expo start --clear
```

---

## Debug Tips

### 1. Check Dependencies Installed

```bash
npm list axios
npm list @react-navigation/bottom-tabs
npm list @react-navigation/native
```

### 2. Check Node/NPM Version

```bash
node --version  # Should be >= 16
npm --version   # Should be >= 8
```

### 3. Update NPM

```bash
npm install -g npm@latest
```

### 4. Check Metro Bundler Logs

Lihat di terminal yang running `expo start`. Cari error messages.

### 5. Check Device Logs

**Android:**
```bash
adb logcat | grep ReactNativeJS
```

**iOS:**
```bash
xcrun simctl spawn booted log stream --level debug | grep React
```

---

## Common Command Reference

```bash
# Start app
npm start
npx expo start

# Start with clear cache
npx expo start --clear

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Install package
npm install <package-name>

# Uninstall package
npm uninstall <package-name>

# Update all packages
npm update

# Check outdated packages
npm outdated

# Audit security
npm audit
npm audit fix
```

---

## Emergency: Reset Everything

```bash
cd mobile

# Nuclear option - delete everything
rm -rf node_modules
rm -rf .expo
rm -rf .expo-shared
rm -rf android/.gradle
rm -rf ios/Pods
rm -rf ios/build
rm package-lock.json

# Fresh start
npm install
npx expo start --clear
```

---

## Still Not Working?

1. Check you're in the right directory: `cd mobile`
2. Backend is running: `cd backend && npm start`
3. Node version: `node --version` (>= 16)
4. NPM version: `npm --version` (>= 8)
5. Expo CLI: `npm install -g expo-cli`
6. Clear everything and reinstall
7. Restart computer
8. Check firewall/antivirus

---

## Working Setup Checklist

- [ ] Node.js >= 16 installed
- [ ] NPM >= 8 installed
- [ ] Backend running on port 5000
- [ ] All packages installed (`npm install`)
- [ ] API_BASE configured correctly
- [ ] Cache cleared (`--clear`)
- [ ] Device/emulator ready
- [ ] WiFi connected (same network)

---

## Quick Test

After fixing, test dengan:

```bash
# 1. Start backend
cd backend
npm start

# 2. Start mobile (new terminal)
cd mobile
npx expo start --clear

# 3. Open on device
# Tekan 'a' untuk Android
# atau scan QR code
```

App harus:
- ✅ Open tanpa crash
- ✅ Show onboarding screen
- ✅ Navigate ke login
- ✅ Login berhasil → show tabs
- ✅ Tabs bisa di-tap

---

Happy debugging! 🐛🔧
