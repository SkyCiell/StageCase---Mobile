# 🔧 Navigation Error Fixed

## Error yang Diperbaiki

```
ERROR  The action 'REPLACE' with payload {"name":"Home"} was not handled by any navigator.
```

---

## ✅ Solusi yang Diterapkan

### 1. **Install Bottom Tabs Navigator**

```bash
npm install @react-navigation/bottom-tabs
```

### 2. **Buat MainTabs Navigator**

File: `src/navigation/MainTabs.jsx`

Bottom tab navigator dengan 4 tabs:
- 🏠 Home
- 🎤 Concerts
- 🎟️ My Tickets
- 👤 Profile

### 3. **Update App.js Structure**

**Before (❌ Error):**
```javascript
// Conditional rendering di navigator
{!isLoggedIn ? (
  <Stack.Screen name="Home" ... />
) : (
  <Stack.Screen name="Login" ... />
)}
```

**After (✅ Fixed):**
```javascript
// Separate stacks
{!isLoggedIn ? (
  // Auth Stack
  <Stack.Screen name="Login" ... />
) : (
  // Main App with Tabs
  <Stack.Screen name="Main" component={MainTabs} />
)}
```

### 4. **Update OnboardingScreen**

**Before:**
```javascript
navigation.replace('Home'); // ❌ Error: Home tidak ada di auth stack
```

**After:**
```javascript
navigation.navigate('Login'); // ✅ Navigate ke Login screen
```

---

## 📱 New Navigation Structure

```
App
├── Auth Stack (tidak login)
│   ├── Onboarding
│   ├── Login
│   └── Register
│
└── Main Stack (sudah login)
    └── Main (Bottom Tabs)
        ├── HomeTab
        ├── Concerts
        ├── MyTickets
        └── Profile
```

---

## 🎯 Cara Kerja Baru

### Flow Authentication:

1. **Pertama kali buka app:**
   - `AuthContext` check token di AsyncStorage
   - Jika `isLoading = true` → show nothing
   - Jika tidak ada token → redirect ke `Onboarding`
   - Jika ada token valid → redirect ke `Main` (tabs)

2. **User di Onboarding:**
   - Swipe atau tap "Get Started"
   - Navigate ke `Login`

3. **User login berhasil:**
   - Token disimpan di AsyncStorage
   - `isLoggedIn = true`
   - App auto-switch ke `Main` stack dengan tabs

4. **User logout:**
   - Token dihapus
   - `isLoggedIn = false`
   - App auto-switch ke `Onboarding`

### Bottom Tab Navigation:

User bisa tap icon di bottom bar untuk pindah screen:
- **Home**: Lihat featured concerts & quick actions
- **Concerts**: Browse semua concert
- **My Tickets**: Lihat tickets yang sudah dibeli
- **Profile**: Account info & logout

---

## 🎨 Features Bottom Tabs

### Custom Tab Bar
- Custom icons dengan emoji
- Active state indicator (background highlight)
- Smooth animations
- Consistent design dengan theme app

### Styling
```javascript
// Active tab
backgroundColor: jade (blue)
scale: 1.1

// Inactive tab
color: textSecondary (gray)
```

---

## 🔧 Troubleshooting

### Jika masih error "Home not found":

1. **Clear cache:**
```bash
npx expo start --clear
```

2. **Restart app completely:**
```bash
# Stop expo (Ctrl+C)
npx expo start
```

3. **Check navigation names:**
```javascript
// ✅ Correct
navigation.navigate('Login')
navigation.navigate('Main')

// ❌ Wrong (Home tidak ada di root stack)
navigation.navigate('Home')
```

4. **Use HomeTab inside tabs:**
```javascript
// Dari screen lain ke home via tabs
navigation.navigate('Main', {
  screen: 'HomeTab'
});
```

---

## 📝 Update Screens

### ProfileScreen

Added:
- `useAuth()` hook untuk get user data
- Logout button dengan confirmation dialog
- User info display (name, email, phone)
- Menu items dengan stats

```javascript
const { user, logout } = useAuth();

const handleLogout = () => {
  Alert.alert('Logout', 'Yakin?', [
    { text: 'Batal' },
    { text: 'Logout', onPress: () => logout() }
  ]);
};
```

---

## ✅ Testing Checklist

- [ ] App tidak crash saat dibuka
- [ ] Onboarding → Login navigation works
- [ ] Login berhasil → redirect ke tabs
- [ ] Bottom tabs bisa di-tap dan switch screen
- [ ] Logout → redirect ke onboarding
- [ ] Pull to refresh di HomeScreen works
- [ ] Back button tidak exit app (Android)

---

## 🚀 Run App

```bash
cd mobile
npx expo start
```

Tekan `a` untuk Android atau scan QR untuk device fisik.

---

## 📦 Dependencies Added

```json
{
  "@react-navigation/bottom-tabs": "^7.2.1"
}
```

Total packages sekarang:
- axios
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs ← NEW
- @react-native-async-storage/async-storage
- react-native-screens
- react-native-safe-area-context

---

## 🎉 Done!

Navigation error sudah fixed! Sekarang app punya:
- ✅ Proper auth flow
- ✅ Bottom tab navigation
- ✅ Smooth transitions
- ✅ Logout functionality
- ✅ User profile dengan data real

Happy coding! 🚀
