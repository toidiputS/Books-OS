
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Shelf = { id: string; title: string; bookIds: string[]; towerIndex?: number };
export type BookLite = {
  id: string;
  title: string;
  spineColor?: string;
  spineLetter?: string;
  author?: string;
  summary?: string;
  isLocked?: boolean;
  toolGlowColor?: string; // Source tool color from archive commits
  chapters?: ArchiveChapter[];
};

export type ArchiveChapter = {
  id: string;
  type: string; // title-page | text | numbered-list | quote | grid-fields | stats
  title?: string;
  subtitle?: string;
  body?: string;
  items?: string[];
  fields?: Record<string, string>;
  style?: string; // e.g. 'amber' for warnings
};

export type BookLocationState = 'shelf' | 'flying' | 'held';

// --- TOWER DEFINITIONS ---

export const TOWER_DEFS = [
  { key: 'JAN', label: 'January', subtitle: 'The Beginning', index: 1 },
  { key: 'FEB', label: 'February', subtitle: 'The Pulse', index: 2 },
  { key: 'MAR', label: 'March', subtitle: 'The Awakening', index: 3 },
  { key: 'APR', label: 'April', subtitle: 'The Bloom', index: 4 },
  { key: 'MAY', label: 'May', subtitle: 'The Expansion', index: 5 },
  { key: 'JUN', label: 'June', subtitle: 'The Ascent', index: 6 },
  { key: 'JUL', label: 'July', subtitle: 'The Peak', index: 7 },
  { key: 'AUG', label: 'August', subtitle: 'The Harvest', index: 8 },
  { key: 'SEP', label: 'September', subtitle: 'The Reflection', index: 9 },
  { key: 'OCT', label: 'October', subtitle: 'The Turn', index: 10 },
  { key: 'NOV', label: 'November', subtitle: 'The Forge', index: 11 },
  { key: 'DEC', label: 'December', subtitle: 'The Close', index: 12 },
  { key: 'NEXUS', label: 'The Nexus', subtitle: 'The Tool Archive', index: 13 },
  { key: 'BEFORE', label: 'The Before', subtitle: 'The Origin', index: 14 },
] as const;

export type TowerDef = typeof TOWER_DEFS[number];

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const SHELVES_PER_TOWER = 30;
const BASE_YEAR = 2026;

const COLOR_VOL = '#8B0000';
const COLOR_ART = '#006400';
const COLOR_SUM = '#00008B';
const COLOR_COMP = '#DAA520';

const BOOK_CONFIG = [
  { title: "Week 1 Volume", desc: "7 Daily Logs + Weekly Summary", color: COLOR_VOL },
  { title: "Week 1 Artifacts", desc: "Committed deliverables", color: COLOR_ART },
  { title: "Week 2 Volume", desc: "7 Daily Logs + Weekly Summary", color: COLOR_VOL },
  { title: "Week 2 Artifacts", desc: "Committed deliverables", color: COLOR_ART },
  { title: "Week 3 Volume", desc: "7 Daily Logs + Weekly Summary", color: COLOR_VOL },
  { title: "Week 3 Artifacts", desc: "Committed deliverables", color: COLOR_ART },
  { title: "Week 4 Volume", desc: "7 Daily Logs + Weekly Summary", color: COLOR_VOL },
  { title: "Week 4 Artifacts", desc: "Committed deliverables", color: COLOR_ART },
  { title: "Monthly Summary", desc: "Strategic rollup & Metrics", color: COLOR_SUM },
  { title: "Monthly Compilation", desc: "All artifacts compiled", color: COLOR_COMP },
];

type LibraryState = {
  libraryCardName: string | null;
  setLibraryCard: (name: string) => void;

  books: Record<string, BookLite>;
  shelves: Record<string, Shelf>;
  bookStates: Record<string, BookLocationState>;
  selectedBookId: string | null;
  floatHistory: string[];

  unlockedShelves: Record<string, boolean>;

  // Pending arrival animations (processed on next archive entry)
  pendingArrivals: { shelfId: string; bookId: string; toolName: string }[];

  upsertBook: (b: Partial<BookLite> & { id: string }) => void;
  addToShelf: (shelfId: string, bookId: string) => void;
  initTowers: () => void;
  select: (bookId: string | null) => void;

  setBookState: (bookId: string, state: BookLocationState) => void;
  floatBook: (bookId: string) => void;
  summonBook: () => void;
  returnBookToShelf: (bookId: string) => void;
  unlockShelf: (shelfId: string) => void;
  isShelfUnlocked: (shelfId: string) => boolean;
  getMaxFloating: () => number;
  queueArrival: (arrival: { shelfId: string; bookId: string; toolName: string }) => void;
  consumeArrivals: () => { shelfId: string; bookId: string; toolName: string }[];
  clearLibrary: () => void;
};

function makeShelfId(towerKey: string, level: number): string {
  const lvl = level.toString().padStart(2, '0');
  if (towerKey === 'NEXUS' || towerKey === 'BEFORE') {
    return `TOWER-${towerKey}-SHELF-${lvl}`;
  }
  const year = BASE_YEAR + (level - 1);
  return `TOWER-${towerKey}-YEAR-${year}`;
}

function makeShelfTitle(towerKey: string, level: number): string {
  const tower = TOWER_DEFS.find(t => t.key === towerKey);
  if (!tower) return `Shelf ${level}`;
  if (towerKey === 'NEXUS') return `The Nexus — Shelf ${level}`;
  if (towerKey === 'BEFORE') return `The Before — Shelf ${level}`;
  const year = BASE_YEAR + (level - 1);
  return `${tower.label} ${year}`;
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      libraryCardName: null,
      setLibraryCard: (name) => set({ libraryCardName: name }),

      books: {},
      shelves: {},
      bookStates: {},
      selectedBookId: null,
      floatHistory: [],
      unlockedShelves: {},
      pendingArrivals: [],

      upsertBook: (b) =>
        set((s) => ({
          books: { ...s.books, [b.id]: { ...s.books[b.id], ...b } as BookLite },
        })),

      addToShelf: (shelfId, bookId) =>
        set((s) => ({
          shelves: {
            ...s.shelves,
            [shelfId]: {
              ...s.shelves[shelfId],
              bookIds: Array.from(
                new Set([...(s.shelves[shelfId]?.bookIds ?? []), bookId])
              ),
            },
          },
          bookStates: { ...s.bookStates, [bookId]: 'shelf' }
        })),

      initTowers: () => set((s) => {
        const newBooks: Record<string, BookLite> = {};
        const newShelves: Record<string, Shelf> = {};
        const newStates: Record<string, BookLocationState> = {};

        for (const tower of TOWER_DEFS) {
          for (let level = 1; level <= SHELVES_PER_TOWER; level++) {
            const shelfId = makeShelfId(tower.key, level);
            const shelfTitle = makeShelfTitle(tower.key, level);
            const bookIds: string[] = [];

            for (let i = 0; i < 10; i++) {
              const letter = LETTERS[i];
              const bookId = `unit-${shelfId}-${letter}`;

              let title: string;
              let summary: string;
              let spineColor: string;

              if (tower.key === 'NEXUS') {
                title = `${tower.label} • Shelf ${level} • Book ${letter}`;
                summary = tower.subtitle;
                spineColor = '#B8860B'; // Rich gold for Nexus
              } else if (tower.key === 'BEFORE') {
                title = `${tower.label} • Shelf ${level} • Book ${letter}`;
                summary = tower.subtitle;
                spineColor = '#6B0F1A'; // Deep burgundy for Before
              } else {
                const year = BASE_YEAR + (level - 1);
                const config = BOOK_CONFIG[i];
                title = `${tower.label} ${year} • ${config.title}`;
                summary = config.desc;
                spineColor = config.color;
              }

              newBooks[bookId] = {
                id: bookId,
                title,
                spineLetter: letter,
                spineColor,
                author: 'ONE',
                summary,
                isLocked: false,
              };
              bookIds.push(bookId);
              newStates[bookId] = 'shelf';
            }

            newShelves[shelfId] = { id: shelfId, title: shelfTitle, bookIds, towerIndex: TOWER_DEFS.indexOf(tower) };
          }
        }

        // Auto-unlock: February tower first shelf + Nexus first shelf
        const unlocked: Record<string, boolean> = { ...s.unlockedShelves };
        unlocked[makeShelfId('FEB', 1)] = true;
        unlocked[makeShelfId('NEXUS', 1)] = true;

        return {
          books: newBooks,
          shelves: newShelves,
          bookStates: newStates,
          unlockedShelves: unlocked,
        };
      }),

      select: (bookId) => set({ selectedBookId: bookId }),

      setBookState: (bookId, state) => set(s => {
        const updates: Partial<LibraryState> = {
          bookStates: { ...s.bookStates, [bookId]: state }
        };
        if (state === 'flying') {
          updates.floatHistory = [bookId, ...s.floatHistory.filter(id => id !== bookId)];
        }
        return updates;
      }),

      floatBook: (bookId) => {
        const s = get();
        const flyingCount = Object.values(s.bookStates).filter(st => st === 'flying').length;
        const maxFloating = s.getMaxFloating();
        if (flyingCount >= maxFloating) return;

        set(state => ({
          bookStates: { ...state.bookStates, [bookId]: 'flying' },
          floatHistory: [bookId, ...state.floatHistory.filter(id => id !== bookId)]
        }));
      },

      returnBookToShelf: (bookId) => {
        set(s => ({
          bookStates: { ...s.bookStates, [bookId]: 'shelf' },
          floatHistory: s.floatHistory.filter(id => id !== bookId),
        }));
      },

      summonBook: () => {
        const s = get();
        const targetId = s.floatHistory.find(id => {
          const st = s.bookStates[id];
          return st === 'flying' || st === 'held';
        });

        if (targetId) {
          const currentState = s.bookStates[targetId];
          if (currentState === 'held') {
            s.returnBookToShelf(targetId);
          } else {
            set(state => ({
              bookStates: { ...state.bookStates, [targetId]: 'held' }
            }));
          }
        }
      },

      unlockShelf: (shelfId) => {
        set(s => ({
          unlockedShelves: { ...s.unlockedShelves, [shelfId]: true }
        }));
      },

      isShelfUnlocked: (shelfId) => {
        return !!get().unlockedShelves[shelfId];
      },

      getMaxFloating: () => {
        const s = get();
        const unlockedCount = Object.keys(s.unlockedShelves).length;
        return Math.max(unlockedCount * 10, 1);
      },

      queueArrival: (arrival) => {
        set(s => ({
          pendingArrivals: [...s.pendingArrivals, arrival]
        }));
      },

      consumeArrivals: () => {
        const arrivals = get().pendingArrivals;
        set({ pendingArrivals: [] });
        return arrivals;
      },

      clearLibrary: () => set({
        books: {},
        shelves: {},
        selectedBookId: null,
        bookStates: {},
        libraryCardName: null,
        floatHistory: [],
        unlockedShelves: {},
        pendingArrivals: [],
      }),
    }),
    {
      name: 'books-os:library-v7',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
