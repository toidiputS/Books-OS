
import { useLibrary } from './library';

// --- PAYLOAD SCHEMA ---

interface ArchivePayload {
    deckId: string;
    who: {
        tool: string;
        id: string;
        color: string;
    };
    slides: ArchiveSlide[];
    timestamp: string; // ISO 8601
}

interface ArchiveSlide {
    type: 'cover' | 'statement' | 'bullets' | 'warning' | 'roadmap' | 'chart' | 'comparison' | 'quote';
    title?: string;
    subtitle?: string;
    body?: string;
    items?: string[];
    fields?: Record<string, string>;
    meta?: string;
    phases?: Record<string, string>;
    [key: string]: any;
}

// --- SLIDE → CHAPTER MAPPING ---

function slideToChapter(slide: ArchiveSlide, index: number) {
    const id = `ch-${index}`;

    switch (slide.type) {
        case 'cover':
            return {
                id, type: 'title-page',
                title: slide.title || 'Untitled',
                subtitle: slide.subtitle || '',
                body: slide.meta || '',
            };
        case 'statement':
            return {
                id, type: 'text',
                title: slide.title || '',
                body: slide.body || '',
            };
        case 'bullets':
            return {
                id, type: 'numbered-list',
                title: slide.title || '',
                items: slide.items || [],
            };
        case 'warning':
            return {
                id, type: 'quote',
                title: slide.title || 'Warning',
                body: slide.body || '',
                style: 'amber',
            };
        case 'roadmap':
            return {
                id, type: 'grid-fields',
                title: slide.title || 'Roadmap',
                fields: slide.phases || slide.fields || {},
            };
        case 'chart':
            return {
                id, type: 'stats',
                title: slide.title || 'Metrics',
                fields: slide.fields || {},
            };
        case 'comparison':
            return {
                id, type: 'grid-fields',
                title: slide.title || 'Comparison',
                fields: slide.fields || {},
            };
        case 'quote':
            return {
                id, type: 'quote',
                title: slide.title || '',
                body: slide.body || '',
            };
        default:
            return {
                id, type: 'text',
                title: slide.title || '',
                body: slide.body || JSON.stringify(slide),
            };
    }
}

// --- TIMESTAMP → SHELF/BOOK RESOLVER ---

const MONTH_KEYS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const BASE_YEAR = 2026;

function resolveTarget(timestamp: string) {
    const date = new Date(timestamp);
    const month = date.getMonth(); // 0-indexed
    const year = date.getFullYear();
    const day = date.getDate();

    // Week of month (1-4)
    const weekOfMonth = Math.min(Math.ceil(day / 7), 4);

    const towerKey = MONTH_KEYS[month];
    const yearShort = year.toString().slice(-2);
    const shelfId = `${towerKey}-${yearShort}`;

    // Artifact books are at positions 2, 4, 6, 8 (0-indexed: 1, 3, 5, 7)
    // Week 1 → slot index 1 (B), Week 2 → slot index 3 (D), etc.
    const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const slotIndex = (weekOfMonth * 2) - 1; // Week1→1, Week2→3, Week3→5, Week4→7
    const bookLetter = LETTERS[slotIndex];
    const bookId = `${shelfId}-${bookLetter}`;

    return { towerKey, shelfId, bookId, bookLetter, year, weekOfMonth };
}

// --- PROCESS PAYLOAD ---

function processPayload(raw: string): string | null {
    let payload: ArchivePayload;
    try {
        payload = JSON.parse(raw);
    } catch {
        console.error('[Archive Receiver] Invalid JSON payload');
        return null;
    }

    if (!payload.deckId || !payload.who || !payload.slides || !payload.timestamp) {
        console.error('[Archive Receiver] Malformed payload — missing required fields');
        return null;
    }

    const { shelfId, bookId, weekOfMonth } = resolveTarget(payload.timestamp);
    const store = useLibrary.getState();

    // Map slides to chapters
    const newChapters = payload.slides.map((slide, i) => slideToChapter(slide, i));

    // Get existing book (if it exists in the store)
    const existingBook = store.books[bookId];
    const existingChapters = existingBook?.chapters || [];

    // Append chapters — never duplicate (dedupe by deckId prefix)
    const prefixedChapters = newChapters.map(ch => ({
        ...ch,
        id: `${payload.deckId}-${ch.id}`,
    }));

    const existingIds = new Set(existingChapters.map(c => c.id));
    const merged = [
        ...existingChapters,
        ...prefixedChapters.filter(ch => !existingIds.has(ch.id)),
    ];

    // Upsert book with life
    store.upsertBook({
        id: bookId,
        spineColor: '#B8860B', // Goldenrod — artifact color
        toolGlowColor: payload.who.color,
        chapters: merged,
        title: existingBook?.title || `Week ${weekOfMonth} Artifacts`,
    });

    // Unlock the shelf
    store.unlockShelf(shelfId);

    // Queue arrival animation
    store.queueArrival({
        shelfId,
        bookId,
        toolName: payload.who.tool,
    });

    return payload.who.tool;
}

// --- INIT LISTENER ---

const STORAGE_KEY = 'younique_archive_commit';

export function initArchiveReceiver(onToast: (message: string) => void) {
    // Check on load
    const initial = localStorage.getItem(STORAGE_KEY);
    if (initial) {
        const toolName = processPayload(initial);
        localStorage.removeItem(STORAGE_KEY);
        if (toolName) {
            onToast(`A new artifact has arrived from ${toolName} and found its place in your Archive.`);
        }
    }

    // Listen for cross-tab storage events
    const handler = (e: StorageEvent) => {
        if (e.key !== STORAGE_KEY || !e.newValue) return;

        const toolName = processPayload(e.newValue);
        localStorage.removeItem(STORAGE_KEY);
        if (toolName) {
            onToast(`A new artifact has arrived from ${toolName} and found its place in your Archive.`);
        }
    };

    window.addEventListener('storage', handler);

    // Return cleanup function
    return () => {
        window.removeEventListener('storage', handler);
    };
}
