
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Shelf = { id: string; title: string; bookIds: string[] };
export type BookLite = {
  id: string;
  title: string;
  spineColor?: string;
  spineLetter?: string; // New property for spine display
  author?: string;
  summary?: string;
  isLocked?: boolean;
};

export type BookLocationState = 'shelf' | 'flying' | 'held';

type LibraryState = {
  // Auth
  libraryCardName: string | null;
  setLibraryCard: (name: string) => void;

  books: Record<string, BookLite>;
  shelves: Record<string, Shelf>;
  bookStates: Record<string, BookLocationState>;
  flyingTimers: Record<string, number>;
  selectedBookId: string | null;
  lastFloatedBookId: string | null; // Track the last book that floated

  upsertBook: (b: BookLite) => void;
  addToShelf: (shelfId: string, bookId: string) => void;
  initShelves: (titles: string[]) => void;
  seedSpecs: () => void;
  select: (bookId: string | null) => void;

  setBookState: (bookId: string, state: BookLocationState) => void;
  floatBook: (bookId: string) => void;
  summonBook: () => void;
  returnBookToShelf: (bookId: string) => void;
  clearLibrary: () => void;
};

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      libraryCardName: null,
      setLibraryCard: (name) => set({ libraryCardName: name }),

      books: {},
      shelves: {},
      bookStates: {},
      flyingTimers: {},
      selectedBookId: null,
      lastFloatedBookId: null,

      upsertBook: (b) =>
        set((s) => ({
          books: { ...s.books, [b.id]: { ...s.books[b.id], ...b } },
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

      initShelves: (titles) =>
        set((s) => {
          const newShelves = { ...s.shelves };
          titles.forEach(title => {
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            if (!newShelves[id]) {
              newShelves[id] = { id, title, bookIds: [] };
            }
          });
          return { shelves: newShelves };
        }),

      seedSpecs: () => set((s) => {
        const newBooks = { ...s.books };
        const newShelves = { ...s.shelves };
        const newStates = { ...s.bookStates };

        const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

        // v5 Canon Colors
        const COLOR_VOL = '#8B0000'; // Dark Red for Volumes
        const COLOR_ART = '#006400'; // Dark Green for Artifacts
        const COLOR_SUM = '#00008B'; // Dark Blue for Summary
        const COLOR_COMP = '#DAA520'; // Goldenrod for Compilation

        // Map index to book type configuration
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
          { title: "Monthly Compilation", desc: "All artifacts compiled by NotNotes", color: COLOR_COMP },
        ];

        // Populate the first 28 shelves (covering roughly 2 years of stacks)
        const shelfIdsToSeed = Object.keys(newShelves).slice(0, 28);

        shelfIdsToSeed.forEach((shelfId) => {
          const newIds = [];
          // Parse shelf ID for better titles (STACK-JAN-LVL-01)
          const parts = shelfId.split('-');
          const month = parts[1] || 'UNK';
          const level = parts[3] || '00';
          const year = 2025 + parseInt(level); // Assuming LVL 01 = 2026

          for (let i = 0; i < 10; i++) {
            const letter = LETTERS[i];
            const bookId = `unit-${shelfId}-${letter}`;
            const config = BOOK_CONFIG[i];

            // v5 Canon Metadata
            const title = `${month} ${year} • ${config.title}`;
            const summary = config.desc;

            if (!newBooks[bookId]) {
              newBooks[bookId] = {
                id: bookId,
                title,
                spineLetter: letter,
                spineColor: config.color,
                author: 'ONE',
                summary,
                isLocked: false
              };
            }
            newIds.push(bookId);
            if (!newStates[bookId]) newStates[bookId] = 'shelf';
          }
          newShelves[shelfId].bookIds = newIds;
        });

        return { books: newBooks, shelves: newShelves, bookStates: newStates };
      }),

      select: (bookId) => set({ selectedBookId: bookId }),

      setBookState: (bookId, state) => set(s => {
        const updates: Partial<LibraryState> = {
          bookStates: { ...s.bookStates, [bookId]: state }
        };
        if (state === 'flying') {
          // Update last floated when it enters flying state
          updates.lastFloatedBookId = bookId;
        }
        return updates;
      }),

      floatBook: (bookId) => {
        const now = Date.now();
        const duration = 20000 + Math.random() * 10000;

        set(s => ({
          bookStates: { ...s.bookStates, [bookId]: 'flying' },
          flyingTimers: { ...s.flyingTimers, [bookId]: now + duration },
          lastFloatedBookId: bookId
        }));
      },

      returnBookToShelf: (bookId) => {
        set(s => {
          const newTimers = { ...s.flyingTimers };
          delete newTimers[bookId];
          return {
            bookStates: { ...s.bookStates, [bookId]: 'shelf' },
            flyingTimers: newTimers
          };
        });
      },

      summonBook: () => {
        const s = get();
        const targetId = s.lastFloatedBookId;

        if (targetId) {
          const currentState = s.bookStates[targetId];

          if (currentState === 'held') {
            // Toggle: Return to Shelf
            s.returnBookToShelf(targetId);
          } else {
            // Toggle: Summon (from shelf or flying)
            set(state => ({
              bookStates: { ...state.bookStates, [targetId]: 'held' }
            }));
          }
        }
      },

      clearLibrary: () => set({ books: {}, shelves: {}, selectedBookId: null, bookStates: {}, flyingTimers: {}, libraryCardName: null, lastFloatedBookId: null }),
    }),
    {
      name: 'books-os:library-v4',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
