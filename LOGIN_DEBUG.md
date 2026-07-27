# 🐛 Login Debug Guide

## Tidak Bisa Login? Ikuti Langkah Ini:

---

## 1. 🔍 Gunakan Test Connection Screen

App sekarang akan langsung buka **Test Connection Screen** untuk debug.

### Cara Test:

1. **Buka app** → Otomatis muncul Test Connection screen
2. **Tap "Test Backend"** → Test koneksi ke backend
3. **Lihat hasilnya:**
   - ✅ Green = Success
   - ❌ Red = Error
   - ⏳ Loading
   - ℹ️ Info

### Yang Ditest:

- **Ping**: Apakah backend reachable?
- **Auth Endpoint**: Apakah `/api/auth/login` working?
- **Concerts Endpoint**: Apakah API endpoint lain working?

---

## 2. 📝 Check Backend Logs

Buka terminal backend dan lihat logs:

```bash
cd backend
npm start
```

**Saat login, harus ada log:**
```
POST /api/auth/login 
Email: user@example.com
Password: [hash]
```

**Jika tidak ada log:**
- Backend tidak terima request
- API_BASE salah
- Network error

---

## 3. ⚙️ Check API_BASE

File: `mobile/src/services/api.js`

```javascript
export const API_BASE = 'http://192.168.1.14:5000/api';
```

### Pilih yang sesuai:

#### Android Emulator:
```javascript
export const API_BASE = 'http://10.0.2.2:5000/api';
```

#### HP Fisik:
1. **Cek IP komputer:**
```bash
ipconfig  # Windows
ifconfig  # Mac/Linux
```

2. **Lihat IPv4 Address**, contoh: `192.168.1.14`

3. **Update API_BASE:**
```javascript
export const API_BASE = 'http://192.168.1.14:5000/api';
```

4. **Restart expo:**
```bash
npx expo start --clear
```

---

## 4. 🔐 Test dengan User yang Sudah Ada

### A. Cek User di Database

```bash
# MySQL
mysql -u root -p
USE stagecase_db;
SELECT id, name, email FROM users;
```

### B. Atau Buat User Baru via Backend

```bash
# Postman atau curl
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@test.com",
  "password": "password123"
}
```

### C. Test Login di Mobile

Di **Test Connection Screen**:
1. Edit file `TestConnectionScreen.jsx`
2. Update credentials di function `testLoginWithRealCredentials`:
```javascript
const response = await api.post('/auth/login', {
  email: 'test@test.com',      // Ganti dengan email yang ada
  password: 'password123'      // Ganti dengan password yang benar
});
```
3. Tap "Test Login"

---

## 5. 🔥 Common Issues

### Issue 1: Network Error

**Error:**
```
Error: Network Error
AxiosError: timeout of 10000ms exceeded
```

**Solutions:**

1. **Backend tidak running**
```bash
cd backend
npm start
# Harus lihat: "Server running on port 5000"
```

2. **Firewall blocking**
   - Windows: Allow Node.js di Windows Defender Firewall
   - Mac: System Preferences → Security → Firewall → Allow

3. **HP dan komputer beda WiFi**
   - Pastikan connect ke WiFi yang sama

### Issue 2: 401 Unauthorized

**Error:**
```
status: 401
message: "Invalid credentials"
```

**Solutions:**

1. **Password salah** → Check password di database
2. **Email salah** → Check email case-sensitive
3. **User tidak ada** → Register user baru

### Issue 3: 400 Bad Request

**Error:**
```
status: 400
message: "Validation error"
```

**Solutions:**

1. **Email format salah**
   - Harus valid email: `user@example.com`
   - Tidak boleh kosong

2. **Password terlalu pendek**
   - Backend require minimal 8 karakter
   - Update di `authController.js` jika mau ubah

### Issue 4: 404 Not Found

**Error:**
```
status: 404
message: "Cannot POST /api/auth/login"
```

**Solutions:**

1. **Endpoint salah** di authService.js
2. **Backend routes tidak mounted** → Check `server.js`
3. **API_BASE ada typo**

### Issue 5: Connection Timeout

**Error:**
```
Error: timeout of 10000ms exceeded
```

**Solutions:**

1. **Backend lambat** → Increase timeout:
```javascript
// api.js
const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000, // 30 detik
});
```

2. **Database connection issue** → Check `.env` di backend

---

## 6. 📱 Debug di Device

### View Console Logs

**Android:**
```bash
adb logcat | grep ReactNativeJS
```

**iOS:**
```bash
xcrun simctl spawn booted log stream --level debug | grep React
```

### Atau Debug di Chrome

1. App running
2. Shake device atau press `Cmd+D` (iOS) / `Cmd+M` (Android)
3. Tap "Debug Remote JS"
4. Chrome DevTools → Console

---

## 7. 🧪 Manual Test API

Test backend langsung dengan curl atau Postman:

```bash
# Test backend is up
curl http://localhost:5000/api

# Test register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJ...",
    "user": {
      "id": 1,
      "name": "Test",
      "email": "test@test.com",
      "role": "user"
    }
  }
}
```

---

## 8. 📊 Check Request in Backend

Tambahkan logging di `authController.js`:

```javascript
const login = async (req, res) => {
  try {
    console.log('🔐 Login attempt:', req.body.email);
    
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    console.log('👤 User found:', !!user);
    
    if (!user) return error(res, 'Invalid credentials', 401);

    const isMatch = await user.comparePassword(password);
    
    console.log('🔑 Password match:', isMatch);
    
    // ... rest of code
  } catch (err) {
    console.error('❌ Login error:', err);
    next(err);
  }
};
```

---

## 9. ✅ Checklist Before Testing

- [ ] Backend is running (`npm start`)
- [ ] Database is connected (check backend logs)
- [ ] API_BASE is correct in `api.js`
- [ ] Device/emulator and computer on same WiFi
- [ ] User exists in database
- [ ] Password is correct (8+ characters)
- [ ] Email format is valid
- [ ] No firewall blocking
- [ ] Metro bundler running

---

## 10. 🎯 Step by Step Debug

### Step 1: Test Backend Directly

```bash
curl http://localhost:5000/api
# Should return: {"message":"StageCase API"}
```

✅ If success → Backend is running
❌ If fail → Start backend

### Step 2: Test from Same Network

```bash
# From HP, test dengan browser:
http://192.168.1.14:5000/api
```

✅ If success → Network is OK
❌ If fail → Check WiFi, firewall, or IP

### Step 3: Test Login Endpoint

```bash
curl -X POST http://192.168.1.14:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

✅ If success → Endpoint works
❌ If 401 → Wrong credentials
❌ If 404 → Route not found
❌ If timeout → Network issue

### Step 4: Test in Mobile App

1. Open Test Connection Screen
2. Tap "Test Backend"
3. Read results
4. Check console logs

### Step 5: Try Actual Login

1. Tap "Back" to go to Onboarding
2. Swipe to Login
3. Enter credentials
4. Tap Login
5. Check logs

---

## 11. 🛠 Force Debug Mode

Enable detailed logging in LoginScreen:

```javascript
// LoginScreen.jsx
const handleLogin = async () => {
  console.log('🔐 Starting login...');
  console.log('📧 Email:', email);
  console.log('🔑 Password length:', password.length);
  
  if (!email || !password) {
    console.log('❌ Validation failed');
    return Alert.alert('Error', 'Isi email dan password.');
  }
  
  setLoading(true);
  console.log('📤 Sending login request...');
  
  try {
    const result = await login(email.trim().toLowerCase(), password);
    console.log('✅ Login success!', result);
  } catch (err) {
    console.error('❌ Login error:', err);
    console.error('📦 Error response:', err.response?.data);
    // ... rest
  } finally {
    setLoading(false);
  }
};
```

---

## 12. 📞 Still Not Working?

### Last Resort Checklist:

1. **Restart everything:**
   - Stop backend (Ctrl+C)
   - Stop expo (Ctrl+C)
   - Start backend: `cd backend && npm start`
   - Start expo: `cd mobile && npx expo start --clear`

2. **Try different device:**
   - Android emulator vs physical device
   - Different phone

3. **Check backend .env:**
```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
DATABASE_URL=mysql://root:password@localhost:3306/stagecase_db
```

4. **Reinstall dependencies:**
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Mobile
cd mobile
rm -rf node_modules
npm install
npx expo start --clear
```

---

## 📚 Logs to Check

**Backend logs harus ada:**
```
Server running on port 5000
Database connected successfully
POST /api/auth/login
```

**Mobile logs harus ada:**
```
📤 API Request: POST /auth/login
📦 Request Data: { email: "...", password: "..." }
✅ API Response: 200 /auth/login
📦 Response Data: { success: true, data: {...} }
```

---

Good luck debugging! 🐛🔧
