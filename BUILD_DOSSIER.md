# 📚 Books OS v1.1 — Full Build Dossier

> **Snapshot date:** 2026-03-28 · **Branch:** `main` · **Working tree:** Clean
> **Remote:** [github.com/toidiputS/Books-OS](https://github.com/toidiputS/Books-OS.git)
> **License:** MIT · **Copyright:** IT'S LLC

---

## 1. Executive Summary

**Books OS** is a fully client-side, 3D spatial-knowledge PWA — the **Younique Archive** — rendered with WebGL. The environment is a dark, cathedral-like hall with **14 obsidian towers** arranged in a ring, each rising from a **gold-engraved base** atop a **dark-stained walnut floor**. Users navigate using first-person WASD controls (desktop) or on-screen d-pad (mobile). At the heart of the ring, a large transparent **Y-A Logo** is etched into the wood.

The archive holds **4,200 books** across 14 towers × 30 shelves × 10 books per shelf. At the center of the ring sits a **display pillar** crowned with *"The Youniverse"* — the user's living archive book. Books can be pulled from shelves, floated into a vortex, summoned, and opened to reveal rich chapter-based content overlays.

An **Archive Receiver** system listens for incoming artifacts via `localStorage`, automatically placing content into the correct tower, shelf, and book slot based on timestamp.

**Entry Flow:** Books OS employs a frictionless, email-only "Open Door Policy." Users enter via a sleek, minimalist landing page with just a thin white line and an `@` placeholder. There are no password requirements, leveraging a Product-Led Growth (PLG) and deferred authentication strategy. Access to specific content within the portal is gated downstream by token systems and external purchase tiers.

**Tagline:** *"No Hero. No Guru. Just a New You."*  
**Nickname:** *Master Nexus • Portals OS • The Youniverse*

---

## 2. The PortalsOS Architecture & The Flow

**The Youniverse (PortalsOS / itsyouonline.com):** The Alpha and the Omega. The event horizon and the singularity. The beginning and the end. All interactions enter here. From this absolute center, the **Oracle** diagnoses and orchestrates the entire system.

**Books OS** (this build) serves as the permanent, read-only memory bank of the broader Youniverse. It is the final destination in the execution lifecycle. The relationships between these core systems are governed by **The Flow**:

1. **Oracle (The Orchestrator)**: The executive intelligence that orchestrates the execution lifecycle. When a user provides intent, Oracle maps the request, selects the appropriate **Nexus Agent** (which are independent PWAs), and opens them directly inside the PortalsOS environment in their own windows, orchestrating all ensuing handoffs.
2. **NotNotes (The Compiler)**: NotNotes acts as the compiler. It actively collects all the raw deliverables produced by agents during a session and processes them to deliver the final, compiled artifact.
3. **The Commit Contract**: The explicit action of the human manually committing a Nexus agent's deliverable into NotNotes.
4. **Books OS (The Younique Archives)**: This application. The final, permanent 14-tower archive where compiled artifacts from NotNotes are stored as immutable canon.

> **The Humanot Protocol:** All communication and handoffs between NotNotes, Oracle, the Agents, and the Human are governed by **Humanot**—a specific language and protocol created to ensure clear, constrained, and explicit agent behavior. All handoffs happen transparently, much like a conversation.

---

## 3. Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------| 
| **Framework** | React + TypeScript | 18.3.1 / ~5.8.2 |
| **3D Engine** | Three.js via `@react-three/fiber` + `@react-three/drei` | 0.169.0 / 8.17.10 / 9.117.3 |
| **State** | Zustand (with `persist` middleware → localStorage) | ^5.0.9 |
| **Validation** | Zod | 3.23.8 |
| **Styling** | Tailwind CSS (PostCSS plugin) | ^3.4.1 |
| **Build & Deploy**| Vite (with manualChunks for 3D slicing) + Vercel | ^5.4.2 |
| **IDs** | `uuid` | 9.0.1 |
| **Fonts** | EB Garamond, Cinzel, Inter (Google Fonts CDN) | — |
| **PWA** | manifest.json + sw.js (properly scoped in /public) | — |
| **Audio** | Web Speech API (`speechSynthesis`) | — |

---

## 4. Repository Structure

```
books-os-v1.1/
├── index.html              ← Entry point, loads fonts, CSS, sets #000 default background
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
│       └── LandingPage.tsx     ← Frictionless email-only entry gateway
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
├── services/               ← Utility wrappers
├── utils/                  ← Shared constants
│
├── public/                 ← Static assets + Service Worker scripts
│   ├── sw.js               ← Service Worker (Network-first HTML, cache-first assets)
│   └── assets/             ← Fonts, logo.svg, y-a-logo.svg
├── tailwind.config.js      ← Custom colors (paper, ink, wood), fonts, animation
├── postcss.config.js       ← PostCSS with Tailwind + Autoprefixer
├── vite.config.ts          ← manualChunks configured to separate ThreeJS dependencies
└── .env.local              ← Environment overrides
```

---

## 5. Architecture Deep-Dive

### 5.1 State Architecture (3 Zustand Stores)

| Store | Persist Key | Purpose | Key State |
|-------|------------|---------|-----------|
| `useLibrary` | `books-os:library-v7` | All book/shelf/tower data | `books`, `shelves`, `bookStates`, `unlockedShelves`, `pendingArrivals` |
| `useSystem` | `books-os:system-v5` | Settings, auth, perf | `theme`, `keys` (KeyMap), `user`, `lightingLevel`, `cameraSpeed` |
| `useUI` | *(not persisted)* | Ephemeral UI toggles | `view`, `isCatalogOpen`, `isSettingsOpen` |

### 5.2 14-Tower Structure

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

### 5.3 Archive Receiver

`archiveReceiver.ts` listens for `younique_archive_commit` in localStorage. It maps incoming artifacts generated by **NotNotes** into proper positions within the Towers by using precise timestamp extraction to calculate month, year, and week slot. 

### 5.4 Performance Optimizations

- **Vite `manualChunks` strategy**: Separated `@react-three` and `three` out of the main bundle to guarantee sub-500kB core chunks for Vercel deployment.
- **Shared geometries**: Pre-allocated structures `sharedBoxGeo`, `sharedPageGeo`.
- **Procedural textures**: Rendered natively rather than fetched, saving bandwidth and stopping 404 errors (e.g. solid dark material for floors rather than heavy bitmaps). 
- **Deterministic RNG**: (mulberry32) for shelf layout — no re-renders on remount.
- **Progressive loading**: Shelves batch in 42 at a time.

---

## 6. Features Inventory

| Feature | Status | Notes |
|---------|--------|-------|
| 14-Tower Younique Archive | ✅ Live | 4,200 books, gold-engraved bases |
| Archive Receiver | ✅ Live | Extends The Youniverse memory horizontally |
| Open-Door Authentication | ✅ Live | Minimalist email capture overriding Supabase passwords |
| 3D Library Navigation (WASD + Mouse) | ✅ Live | Pointer lock, configurable speed |
| Middle-Click Cursor Unlock | ✅ Live | Alternative to ESC |
| Book Vortex & Summoning | ✅ Live | Smooth parabolic flight arcs |
| Premium Book Spines | ✅ Live | Gold foil strip, bottom trim, embossed letter |
| Catalog Search | ✅ Live | Filter by title/author |
| Service Worker / PWA | ✅ Live | Correctly scoped at root relying on Vercel deployment |

---

## 7. Design System

| Token | Value | Usage |
|-------|-------|-------|
| **Background** | `#030303` | Scene background + fog |
| **Floor** | `#0f0f13` | Solid dark material replacing missing heavy textures. Crisp anisotropic logo filtering. |
| **Tower bases** | `#0a0a0a` | Obsidian blocks, metalness 0.85 |
| **Gold** | `#D4AF37` | Engravings, labels, accents |
| **Dark Gold** | `#B8860B` | Subtitles, Nexus book color, foil strips |

---

## 8. Git History (Latest)

| Date | Focus | Message |
|------|-------|---------|
| `2026-03-28` | **Product Led Growth Upgrade** | Refactored LandingPage for frictionless Open Door policy. Removed Supabase password gates. Added slim white line layout. |
| `2026-03-28` | **Vercel Polish & PWA Stability** | Fixed manualChunks breaking 500kB warning, properly scoped sw.js, disabled missing `floor.png` dependency and fixed Logo additive blending. |
| `2026-02` | **14-Tower Expansion** | Built gold accents, middle-click unlock, archive receiver, toast system, premium book spines. |

---

## 9. Observations & Opportunities

| Area | Observation | Severity |
|------|-------------|----------|
| **No tests** | Zero test files, no test runner, no CI pipeline | ⚠️ High |
| **Deferred Authentication / Paywall** | Entry is open, but token systems + Supabase Magic Link auth are required *downstream* so purchases are secured. | 🔥 Critical Next Phase |
| **Zod types** | 5 schema modules defined but never fully consumed by stores/components | ⚠️ Medium |
| **Service Worker** | Live and caching correctly against Vercel public dir | ✅ Fixed |
| **Performance** | Build fits under chunks and visually stable on all renders | ✅ Fixed |
