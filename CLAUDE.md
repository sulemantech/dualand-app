# DuaLand App — Project Reference

> **Note:** The project contains two folder structures. The `src/` directory is an **abandoned prototype** (old React Navigation stack design). The **active codebase** uses Expo Router and lives in `app/`, `components/`, `hooks/`, `lib/`, `constants/`, `config/`, `stores/`, `styles/`, `navigation/`.

---

## Overview

**DuaLand** is a kid-friendly Islamic Duas learning and memorization app built with React Native (Expo). Users browse 43 duas across 32 categories, listen to complete and word-by-word audio recitations, and track memorization progress.

- **Repo:** https://github.com/sulemantech/dualand-app
- **Version:** 1.0.0 (active development — pre-release)
- **Platforms:** iOS, Android (Web via Expo, not primary)
- **App name:** `dualand-expo` (package.json)

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Expo (managed workflow) | ~54.0.25 |
| Runtime | React Native | 0.81.5 |
| Language | TypeScript | ~5.9.2 |
| Routing | Expo Router (file-based) | ~6.0.15 |
| Navigation | React Navigation | ^7.x |
| Audio | expo-av | ~16.0.7 |
| Database | expo-sqlite | ~16.0.9 |
| Animations | react-native-reanimated | ~4.1.1 |
| Gradients | expo-linear-gradient | ~15.0.7 |
| Gestures | react-native-gesture-handler | ~2.28.0 |
| Storage | expo-secure-store | ~15.0.7 |
| Icons | @expo/vector-icons | ^15.0.3 |
| SVG | react-native-svg | 15.12.1 |

---

## Project Structure (Active Codebase)

```
dualand-app/
├── app/                           # Expo Router screens
│   ├── _layout.tsx                # Root layout: ErrorBoundary + LoadingScreen + Stack
│   ├── (tabs)/
│   │   ├── _layout.tsx            # Tab navigator (5 animated tabs)
│   │   ├── index.tsx              # Home: category grid with search
│   │   ├── tracker.tsx            # Tracker: memorization progress
│   │   ├── settings.tsx           # Settings: voice/audio options
│   │   ├── info.tsx               # Learn: app features info
│   │   └── share.tsx              # Share: sharing features
│   ├── dua-detail.tsx             # Dua audio screen (modal)
│   ├── allduas-detail.tsx         # All duas detail view
│   ├── dua-tracker.tsx            # Dua tracker screen
│   └── modal.tsx                  # Modal screen
├── components/
│   ├── audio/                     # AudioPlayer, AdvancedAudioPlayer, WordHighlighter, etc.
│   ├── common/                    # Button, Card, LoadingSpinner, ProgressRing, ScreenWrapper
│   ├── navigation/                # SwipeGesture, TabBar
│   └── ui/                        # CategoryCard, DuaListItem, FilterTabs, Header,
│                                  # BouncingButton, CombinedDuaDisplay, FloatingParticles,
│                                  # MashaAllahCelebration, RepeatBadge, SwipeNavigation,
│                                  # WordByWordDisplay
├── hooks/
│   ├── useAudioPlayer.ts          # Audio playback hook (expo-av)
│   ├── useDuaNavigation.ts        # Prev/next dua navigation
│   ├── useDuaPlayer.ts            # Dua-specific playback logic
│   ├── useAppState.ts
│   ├── useDebounce.ts
│   └── useSwipeGesture.ts
├── lib/
│   ├── audio/
│   │   ├── useCustomAudioPlayer.ts  # Custom audio player hook (277 lines)
│   │   ├── audioUtils.ts
│   │   └── playbackManager.ts
│   └── data/
│       └── duas.ts                  # ★ PRIMARY DATA SOURCE (1122 lines)
│                                    #   43 duas, 32 categories, 170+ word audio pairs
│                                    #   All with Arabic text, translation, references, audio paths
├── assets/
│   ├── audio/
│   │   ├── complete/              # 32 complete dua MP3 files (dua01–dua32)
│   │   └── word-by-word/          # 200+ word audio MP3s + 33 category title audios
│   ├── images/                    # 33 dua card images (card1-33, dua_2 through dua_33)
│   ├── btns/                      # Button PNGs (play, pause, next, etc.)
│   └── svg/                       # SVG button icons
├── constants/
│   ├── AppTheme.ts
│   └── Colors.ts
├── config/
│   ├── appConfig.ts
│   └── audioConfig.ts
└── types/
    └── types.tsx
```

> **Ignored / Abandoned:** `src/` — old prototype structure, not used by the running app.

---

## Navigation Flow

```
app/_layout.tsx (Root Stack)
  └─ (tabs) — Tab Navigator (5 tabs)
       ├── Home (index.tsx)       — Category grid + search
       ├── Tracker (tracker.tsx)  — Progress dashboard
       ├── Learn (info.tsx)       — App info/features
       ├── Share (share.tsx)      — Sharing
       └── Settings (settings.tsx)— Audio/voice settings
  └─ dua-detail (modal)           — Dua playback screen
  └─ allduas-detail               — All duas view
  └─ dua-tracker                  — Dua tracker
```

**Route to detail:** Home → tap category → shows dua list → tap dua → `dua-detail` (modal, with swipe gesture to dismiss).

---

## Data Layer

**Single source of truth:** [`lib/data/duas.ts`](lib/data/duas.ts) — pure in-memory TypeScript data (no SQLite used by the active app).

### Content Summary
| Item | Count |
|---|---|
| Categories | 32 |
| Total duas | 43 |
| Complete audio files | 32 MP3s (dua01–dua32) |
| Word-by-word audio | 200+ MP3s |
| Category title audios | 33 MP3s |
| Card images | 33 PNGs |
| Word audio pairs | 170 entries |

### Dua data fields per record
`id`, `category_id`, `title`, `arabic_text`, `translation`, `transliteration?`, `reference`, `is_favorited`, `memorization_status`, `image_path`, `audio_full`, `audio_word_by_word?`, `order_index`, `urdu?`, `hinditranslation?`, `textheading?`, `steps?`, `titleAudioResId?`

### Helper exports from `duas.ts`
- `getAllCategories()`, `getCategoryById(id)`
- `getAllDuas()`, `getDuasByCategory(categoryId)`, `getDuaById(id)`
- `getFavoriteDuas()`, `searchDuas(query)`
- `getWordAudioPairsByDua(duaId)`, `getDuasCount()`

> **Note:** `memorization_status` and `is_favorited` are hardcoded in the data file. There is no persistence layer — changes made in the app are lost on restart unless `expo-sqlite` or `expo-secure-store` is wired up.

---

## Screens Status

| Screen | File | Status |
|---|---|---|
| Home | `app/(tabs)/index.tsx` | ✅ Full category grid, search, animated UI |
| Tracker | `app/(tabs)/tracker.tsx` | ✅ Progress view, list/compact modes |
| Settings | `app/(tabs)/settings.tsx` | ✅ Voice options, switches — UI done |
| Info/Learn | `app/(tabs)/info.tsx` | ✅ App features showcase |
| Share | `app/(tabs)/share.tsx` | ✅ Share screen UI |
| Dua Detail | `app/dua-detail.tsx` | ✅ Audio playback, word-by-word, swipe nav |
| All Duas | `app/allduas-detail.tsx` | ⚠️ Unknown — needs verification |
| Dua Tracker | `app/dua-tracker.tsx` | ⚠️ Unknown — needs verification |

### `dua-detail.tsx` features (last updated in recent commits):
- Complete Dua and Word-by-Word tabs
- Audio playback with play/pause, replay, seek
- Swipe left/right navigation between duas
- Prev/Next buttons
- Favorite toggle
- Memorization status update
- MashaAllah celebration animation
- RepeatBadge component
- CombinedDuaDisplay component

---

## Audio Architecture

**Library:** `expo-av` (not `expo-audio`)

**Hooks:**
- `hooks/useAudioPlayer.ts` — wraps expo-av, exposes play/pause/seek/rate
- `hooks/useDuaPlayer.ts` — dua-specific player (complete + word-by-word)
- `lib/audio/useCustomAudioPlayer.ts` — enhanced custom player (277 lines)

**Playback rates:** 0.5, 0.75, 1.0, 1.25, 1.5, 2.0x (from `config/audioConfig.ts`)

**Audio files** are bundled as static `require()` calls in `lib/data/duas.ts` — no network/streaming.

---

## Tab Bar

The tab bar (`app/(tabs)/_layout.tsx`) is a heavily animated, kid-friendly custom component:
- 5 tabs: Tracker 📊, Learn 📚, Home 🏠 (floating center), Share 🌟, Settings ⚙️
- Animated: scale, bounce, glow, float, gradient, star indicators
- Purple/yellow/teal theme (`#7E57C2` primary)
- Uses `expo-linear-gradient` for gradient effects
- iOS/Android safe area aware

---

## App Initialization (`app/_layout.tsx`)

1. 1-second loading splash
2. Wraps entire app in `ErrorBoundary` (class component)
3. Expo Router `Stack` with `(tabs)` and `dua-detail` as modal

> **Unlike the abandoned `App.tsx`** (which had the scope bug), the Expo Router layout has no initialization bugs.

---

## Known Gaps / Items to Verify

### Data Persistence
- **No persistence for user state** — `memorization_status` and `is_favorited` are hardcoded in `duas.ts`. Changes are not saved between sessions.
- `expo-sqlite` and `expo-secure-store` are installed but their usage in the active codebase is unverified.

### Incomplete Content
- **Missing word-by-word audio** for duas 23 and 27 (no `audio_word_by_word` field set, some dua33 audio has gap at file `dua33_part01_audio07.mp3`)
- **No Urdu/Hindi translations** — fields exist in the type definition but no data populated

### Screens to Verify
- `app/allduas-detail.tsx` — not read; purpose and completion unknown
- `app/dua-tracker.tsx` — not read; likely the per-dua tracking screen

### Settings
- Voice options UI is built but unclear if selected voice is actually applied to audio playback

### Testing
- Only 1 test file: `components/__tests__/StyledText-test.js` (boilerplate Expo test)
- No integration or audio tests

### CI/CD
- No CI/CD pipeline configured
- `package.json` has `expo run:android` / `expo run:ios` (local native builds) but no EAS Build config

---

## Scripts

```bash
expo start              # Start dev server
expo run:android        # Local Android build
expo run:ios            # Local iOS build
expo start --web        # Web
```

---

## Release Readiness

**Status: Approaching MVP — significant features are working, but user state persistence is missing**

### What's working
- ✅ 43 duas with full Arabic text, translations, references
- ✅ 32 complete audio files, 200+ word-by-word audio files — all bundled
- ✅ 32 category images + dua card images
- ✅ 5-tab navigation with polished animations
- ✅ Home screen with category grid and search
- ✅ Tracker/progress screen
- ✅ Dua detail screen with audio player + word-by-word mode
- ✅ Error boundary in root layout
- ✅ MashaAllah celebration, bouncing buttons, floating particles — UX polish

### Blockers before release
- [ ] **Persist memorization status and favorites** — currently lost on app restart
- [ ] **Verify Settings screen actually changes audio playback** (voice/rate selection)
- [ ] **Verify `allduas-detail.tsx` and `dua-tracker.tsx`** — read and test these screens
- [ ] **Fill missing word-by-word audio** for duas 23, 27
- [ ] **Test on real device** — both iOS and Android
- [ ] **Configure EAS Build** for app store submission

### Nice-to-have before release
- [ ] Add Urdu/Hindi translations to duas data
- [ ] Add proper Jest tests (beyond boilerplate)
- [ ] Add a README.md
- [ ] Set up EAS Update for OTA updates post-launch
