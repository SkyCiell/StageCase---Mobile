# StageCase Mobile — React Native App

> **"Every Stage Begins Here."**  
> Mobile companion app for **StageCase** — the official concert ticket booking platform for the Indonesian band **Crayon Case**.

---

## 📱 Overview

StageCase Mobile is a cross-platform mobile application built with **React Native** and **Expo**. It lets fans browse upcoming Crayon Case concerts, book tickets, and manage their orders — all from their phone.

---

## 🎨 Visual Identity

Dark, premium, and minimalist — inspired by the elegance of Crayon Case's aesthetic.

| Token | Value | Role |
|---|---|---|
| Background | `#151617` | Primary dark backdrop |
| Surface | `#1E2022` | Cards & panels |
| Accent | `#2D6F73` | Primary brand jade |
| Gold | `#B89B5E` | VVIP highlights & prices |
| Text | `#EEE9DF` | Primary ivory text |

---

## 🛠 Tech Stack

| Tech | Purpose |
|---|---|
| React Native | Cross-platform mobile framework |
| Expo | Development & build toolchain |
| React Navigation | Stack & tab navigation |
| Reanimated | Smooth animations |
| Axios | API communication with StageCase backend |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- [Expo Go](https://expo.dev/go) app installed on your phone **or** an Android/iOS emulator

### Installation

```bash
# Clone the repo
git clone https://github.com/SkyCiell/StageCase---Mobile.git
cd StageCase---Mobile

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Then:
- Press `a` → Android emulator
- Press `i` → iOS simulator
- Scan the QR code with **Expo Go** on your phone

---

## 🔗 Backend API

This app connects to the StageCase backend API.  
Make sure the backend is running at `http://localhost:5000` (or update the base URL in `src/services/`).

> Main repo: [github.com/SkyCiell/StageCase](https://github.com/SkyCiell/StageCase)

---

## 📁 Project Structure

```
StageCase---Mobile/
├── src/
│   ├── components/      # Reusable UI components
│   ├── navigation/      # Stack & tab navigators
│   ├── screens/         # App screens (Home, Concerts, Booking, Profile)
│   ├── services/        # API client & endpoint wrappers
│   ├── utils/           # Theme, formatters & helpers
│   └── assets/          # Images & fonts
├── App.js               # Root component
├── app.json             # Expo config
└── package.json
```

---

## ✨ Features

- 🎟 Browse upcoming Crayon Case concerts
- 💳 Book tickets (Regular, VIP, VVIP)
- 📲 View e-ticket with QR code
- 👤 User profile & booking history
- 🔐 JWT-based authentication

---

© 2024 StageCase. All rights reserved.
