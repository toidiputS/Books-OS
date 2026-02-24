# 📚 Books OS v1.1 — Full Build Dossier

> **Snapshot date:** 2026-02-24 · **Branch:** `main` · **Working tree:** Clean
> **Remote:** [github.com/toidiputS/Books-OS](https://github.com/toidiputS/Books-OS.git)
> **License:** MIT · **Copyright:** IT'S LLC

---

## 1. Executive Summary

**Books OS** is a fully client-side, 3D spatial-knowledge PWA — the **Younique Archive** — rendered with WebGL. The environment is a dark, cathedral-like hall with **14 obsidian towers** arranged in a ring, each rising from a **gold-engraved base** atop a **dark-stained walnut floor**. Users navigate using first-person WASD controls (desktop) or on-screen d-pad (mobile). At the heart of the ring, a large transparent **Y-A Logo** is etched into the wood.

The archive holds **4,200 books** across 14 towers × 30 shelves × 10 books per shelf. At the center of the ring sits a **display pillar** crowned with *"The Youniverse"* — the user's living archive book. Books can be pulled from shelves, floated into a vortex, summoned, and opened to reveal rich chapter-based content overlays.

An **Archive Receiver** system listens for incoming artifacts via `localStorage`, automatically placing content into the correct tower, shelf, and book slot based on timestamp.

**Tagline:** *"No Hero. No Guru. Just a New You."*  
**Nickname:** *Master Nexus • Portals OS • The Youniverse*

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------| 
| **Framework** | React + TypeScript | 18.3.1 / ~5.8.2 |
| **3D Engine** | Three.js via `@react-three/fiber` + `@react-three/drei` | 0.169.0 / 8.17.10 / 9.117.3 |
| **State** | Zustand (with `persist` middleware → localStorage) | ^5.0.9 |
| **Validation** | Zod | 3.23.8 |
| **Styling** | Tailwind CSS (PostCSS plugin) | ^3.4.1 |
| **Build** | Vite | ^5.4.2 |
| **IDs** | `uuid` | 9.0.1 |
| **Fonts** | EB Garamond, Cinzel, Inter (Google Fonts CDN) | — |
| **PWA** | manifest.json + sw.js (Service Worker) | — |
| **Audio** | Web Speech API (`speechSynthesis`) | — |

---

## 3. Repository Structure

```
books-os-v1.1/
├── index.html              ← Entry point, loads fonts, CSS, mounts #root
├── index.tsx               ← React DOM bootstrap (StrictMode)
├── index.css               ← Tailwind directives + custom scrollbar/paper utilities
├── App.tsx                 ← Main application shell (~510 lines)
│
├── components/
│   ├── 3d/
│   │   ├── Scene.tsx       ← Canvas, 14-tower ring, vortex, player controller (~580 lines)
│   │   ├── BookSpine3D.tsx ← Individual 3D book w/ gold foil strips + embossed letters (~260 lines)
│   │   ├── Shelf.tsx       ← Shelf row with deterministic RNG layout + gold year labels (~165 lines)
│   │   ├── Desk.tsx        ← Center display pillar + "The Youniverse" book (~160 lines)
│   │   └── PerfBudget.tsx  ← FPS/frame-time counter component
│   └── ui/
│       ├── BookOpenOverlay.tsx ← Chapter-based book reader (~210 lines)
│       ├── ArchiveToast.tsx    ← Gold-bordered toast notifications (~60 lines)
│       ├── Catalog.tsx         ← Search/filter modal for all books (~95 lines)
│       └── LandingPage.tsx     ← Entry gate with name/email + SpeechSynthesis (~127 lines)
│
├── stores/
│   ├── library.ts          ← 14-tower library, 4,200 books, archive chapters (~315 lines)
│   ├── archiveReceiver.ts  ← localStorage listener + payload processor (~160 lines)
│   ├── system.ts           ← Theme, keybindings, perf, auth profile (~84 lines)
│   └── ui.ts               ← View state, modal toggles (~37 lines)
│
├── types/                  ← Zod schemas (runtime-validated domain models)
│   ├── catalog.ts, content.ts, discovery.ts, library.ts, social.ts
│
├── services/
│   └── validation.ts       ← Generic safeParse<T> wrapper for Zod
│
├── utils/
│   └── z.ts                ← Shared Zod primitives (zId, zSlug, zUrl, etc.)
│
├── public/assets/          ← Static assets (logo.svg, y-a-logo.svg, icons)
├── sw.js                   ← Service Worker (Network-first HTML, cache-first assets)
├── manifest.json           ← PWA manifest (Stand-alone, custom branding)
├── tailwind.config.js      ← Custom colors (paper, ink, wood), fonts, animation
├── postcss.config.js       ← PostCSS with Tailwind + Autoprefixer
├── vite.config.ts          ← Dev server on :3000, env injection, path aliases
├── tsconfig.json           ← ES2022, bundler resolution
└── .env.local              ← GEMINI_API_KEY=PLACEHOLDER_API_KEY
```

**Total source files:** ~23 (excluding config/meta)  
**Total application code:** ~123 KB across 23 TS/TSX files

---

## 4. Architecture Deep-Dive

### 4.1 State Architecture (3 Zustand Stores)

| Store | Persist Key | Purpose | Key State |
|-------|------------|---------|-----------|
| `useLibrary` | `books-os:library-v7` | All book/shelf/tower data & interactions | `books`, `shelves`, `bookStates`, `unlockedShelves`, `pendingArrivals` |
| `useSystem` | `books-os:system-v5` | Settings, auth, perf | `theme`, `keys` (KeyMap), `user`, `lightingLevel`, `cameraSpeed` |
| `useUI` | *(not persisted)* | Ephemeral UI toggles | `view`, `isCatalogOpen`, `isSettingsOpen` |

### 4.2 14-Tower Structure

| Tower | Key | Label | Subtitle | Books |
|-------|-----|-------|----------|-------|
| 1 | JAN | January | The Beginning | 300 |
| 2 | FEB | February | The Pulse | 300 |
| 3 | MAR | March | The Awakening | 300 |
| 4 | APR | April | The Bloom | 300 |
| 5 | MAY | May | The Expansion | 300 |
| 6 | JUN | June | The Ascent | 300 |
| 7 | JUL | July | The Peak | 300 |
| 8 | AUG | August | The Harvest | 300 |
| 9 | SEP | September | The Reflection | 300 |
| 10 | OCT | October | The Turn | 300 |
| 11 | NOV | November | The Forge | 300 |
| 12 | DEC | December | The Close | 300 |
| 13 | NEXUS | The Nexus | The Tool Archive | 300 |
| 14 | BEFORE | The Before | The Origin | 300 |

**Total: 14 × 30 × 10 = 4,200 books**

- Monthly towers: Shelves labeled by year (2026–2055)
- Nexus/Before: Shelves labeled numerically (SHELF 1–30)
- February shelf 1 + Nexus shelf 1 auto-unlocked on initialization
- Nexus books: Rich gold `#B8860B`
- Before books: Deep burgundy `#6B0F1A`
- Monthly books: Color-coded by slot (dark red, dark green, dark blue, goldenrod)

### 4.3 Book Lifecycle

- All 4,200 books begin greyed-out and locked
- Unlocked shelf books show their spine color + gold foil strips + embossed letter
- Any held book opens the `BookOpenOverlay` (no A–J filter)
- States: `shelf → flying → held → BookOpenOverlay`

### 4.4 Archive Receiver

`archiveReceiver.ts` listens for `younique_archive_commit` in localStorage:

| Step | Action |
|------|--------|
| 1 | Parse JSON payload from localStorage |
| 2 | Resolve timestamp → tower (month) + shelf (year) + book slot (week 1–4) |
| 3 | Map slides → chapters (cover→title-page, bullets→numbered-list, etc.) |
| 4 | Upsert book: append chapters (dedupe by deckId), set Goldenrod `#B8860B` |
| 5 | Store `who.color` as `toolGlowColor` on the book |
| 6 | Unlock the target shelf |
| 7 | Queue arrival animation |
| 8 | Clear localStorage key |
| 9 | Toast notification: "A new artifact has arrived from [tool]..." |

### 4.5 3D Scene Composition

| Component | Responsibility |
|-----------|---------------|
| **Scene3D** | `<Canvas>` with fog, dark walnut wood floor (+ Y-A logo), lowered lighting, 14-tower ring |
| **PlayerController** | WASD + pointer lock, touch, wheel zoom, **middle-click to unlock cursor** |
| **MainContent** | Renders 14 TowerBase blocks + 420 shelves stacked vertically per tower |
| **TowerBase** | Obsidian block with gold-engraved tower number, label, divider, subtitle |
| **VortexManager** | Animates flying books in orbital paths, manages auto-return timers |
| **HeldBookManager** | Attaches "held" books to camera position |
| **BookSpine3D** | Book mesh with leather texture, **gold foil strip**, **bottom trim**, embossed letter |
| **Shelf** | 10-slot shelf with obsidian board, gold year labels, deterministic RNG layout |
| **Desk** | Center display pillar + "The Youniverse" book (+ Logo emblem) + gold nameplate |

### 4.6 Performance Optimizations

- **Shared geometries** pre-allocated: `sharedBoxGeo`, `sharedPageGeo`, `sharedEmptyMat`
- **Procedural leather texture** generated once via `CanvasTexture` and cached
- **Deterministic RNG** (mulberry32) for shelf layout — no re-renders on remount
- **Shallow selectors** via `useShallow()` — shelves only re-render when their own books change state
- **Progressive loading** — shelves batch in 42 at a time to avoid frame drops on the 420 shelf load
- **`PerfBudget`** component reports real-time FPS/frame time

---

## 5. Features Inventory

| Feature | Status | Notes |
|---------|--------|-------|
| 14-Tower Younique Archive | ✅ Live | 4,200 books, gold-engraved bases |
| Archive Receiver | ✅ Live | localStorage listener, auto-placement by timestamp |
| Toast Notifications | ✅ Live | Gold-bordered, auto-dismiss, global `showToast()` |
| Display Pillar + "The Youniverse" | ✅ Live | Center of ring, gold accents, spotlight |
| 3D Library Navigation (WASD + Mouse) | ✅ Live | Pointer lock, configurable speed |
| Middle-Click Cursor Unlock | ✅ Live | Alternative to ESC |
| Mobile Touch Controls | ✅ Live | D-pad + action buttons |
| Book Vortex (floating books) | ✅ Live | 20–30s flight, auto-return |
| Book Summoning (Tab) | ✅ Live | Toggle held/returned |
| Book Reader Overlay | ✅ Live | All books open with `BookOpenOverlay` |
| Premium Book Spines | ✅ Live | Gold foil strip, bottom trim, embossed letter |
| Catalog Search | ✅ Live | Filter by title/author |
| Landing Page + Speech Greeting | ✅ Live | Web Speech API |
| Auth (Library Card) | ✅ Live | Name persisted to localStorage |
| Settings Menu | ✅ Live | Keybindings, camera speed, lighting, theme, clear data |
| Service Worker / PWA | ✅ Live | Network-first for HTML, custom icons (192, 512, SVG) |
| Gemini API Integration | 🔲 Placeholder | Key defined but no calls made |
| Zod Domain Models | ✅ Defined | 5 schema modules, not yet consumed by UI |

---

## 6. Design System

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#030303` | Scene background + fog |
| **Floor** | `#1e110a` | Dark walnut wood with procedural grain, knots, and Y-A Logo |
| **Tower bases** | `#0a0a0a` | Obsidian blocks, metalness 0.85 |
| **Shelf boards** | `#0a0a0a` | Obsidian boards, metalness 0.85 |
| **Gold** | `#D4AF37` | Engravings, labels, accents |
| **Dark Gold** | `#B8860B` | Subtitles, Nexus book color, foil strips |
| **Book overlay** | `bg: #121212, text: #F5F5DC, accent: #D4AF37` | Dark UI with gold accents |
| **Pillar** | `#0e0e0e` column, `#0a0a0a` base | Center display |
| **Ambient light** | `#fff5e6`, warm | Lowered intensity for moody atmosphere |

**Typography:** EB Garamond (serif body), Cinzel (display headers), Inter (sans UI)

---

## 7. Git History (Latest)

| Commit | Message |
|--------|---------|
| `ac4b1f2` | **Final Polish: Dark walnut floor, Y-A floor logo, Youniverse book emblem, PWA icon/SW fixes** |
| `09b9e63` | **14-Tower Younique Archive: gold accents, middle-click unlock, archive receiver, toast system, premium book spines** |
| `fbba215` | Update attribution to It's LLC |
| `f244389` | Add MIT License and update package.json |
| `cd7b9cf` | Update README with premium project documentation |
| `7abc1e6` | Performance optimizations and stability fixes for 2,400+ books |
| `b615f66` | Fix Tailwind production issue and React 19 consistency |
| `63f1bb2` | Sync local changes with GitHub |

> **Note:** Earlier commits reference a "Vattle Arena" codebase — the repo was repurposed. The current Books OS code was established around commit `63f1bb2` onward.

---

## 8. Environment & Configuration

| File | Purpose |
|------|---------|
| `vite.config.ts` | Dev server on port 3000, HMR, file polling, Gemini key injection |
| `tsconfig.json` | ES2022, bundler resolution, `@/*` path alias |
| `tailwind.config.js` | Custom colors, fonts, `fadeIn` animation |
| `postcss.config.js` | Tailwind + Autoprefixer |
| `manifest.json` | PWA: standalone, black theme, vite.svg icon |
| `.env.local` | `GEMINI_API_KEY=PLACEHOLDER_API_KEY` |

---

## 9. Observations & Opportunities

| Area | Observation | Severity |
|------|-------------|----------|
| **No tests** | Zero test files, no test runner, no CI pipeline | ⚠️ High |
| **Service Worker** | Fully enabled with network-first strategy for index.html | ✅ Fixed |
| **BookOpenOverlay** | Currently shows placeholder chapters — awaiting archive content | Info |
| **Archive Receiver** | Ready for NotNotes integration via `younique_archive_commit` key | Info |
| **Gemini API** | Key placeholder exists but zero calls made | Info |
| **Zod types** | 5 schema modules defined but never imported by stores/components | ⚠️ Medium |
| **PWA icon** | Custom branding integrated (logo.svg, 192, 512) | ✅ Fixed |
| **No routing** | Single-page with view state toggle (`desk` / `stacks`) | Info |
