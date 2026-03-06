import React, { useState, useMemo, useCallback } from 'react';
import { CANON_BOOKS } from '../../data/canon';
import type { CanonBook, CanonChapter, CanonPage } from '../../types/canon';
import { useUI } from '../../stores/ui';
import { useLibrary, BookLite } from '../../stores/library';

/* ─── colour tokens ─── */
const GOLD = '#d4a843';
const BG_DARK = '#0e0c0a';
const BG_PAGE = '#1c1814';
const BORDER = '#2a231a';

/* ─── roman numeral labels ─── */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

type Tab = 'canon' | 'archive';

type CanonView =
    | { level: 'books' }
    | { level: 'chapters'; book: CanonBook }
    | { level: 'page'; book: CanonBook; chapter: CanonChapter; pageIdx: number };

export const CanonViewer: React.FC = () => {
    const setCanonOpen = useUI(s => s.setCanonOpen);
    const books = useLibrary(s => s.books);
    const select = useLibrary(s => s.select);

    const [tab, setTab] = useState<Tab>('canon');
    const [view, setView] = useState<CanonView>({ level: 'books' });
    const [search, setSearch] = useState('');

    /* ─── Canon nav ─── */
    const pages = useMemo(() => {
        if (view.level === 'page') return view.chapter.pages;
        return [] as CanonPage[];
    }, [view]);

    const currentPage = view.level === 'page' ? pages[view.pageIdx] : null;

    const goBooks = useCallback(() => setView({ level: 'books' }), []);
    const goChapters = useCallback((b: CanonBook) => setView({ level: 'chapters', book: b }), []);
    const goPage = useCallback(
        (b: CanonBook, ch: CanonChapter, idx: number) => setView({ level: 'page', book: b, chapter: ch, pageIdx: idx }),
        [],
    );
    const prevPage = useCallback(() => {
        if (view.level === 'page' && view.pageIdx > 0) setView({ ...view, pageIdx: view.pageIdx - 1 });
    }, [view]);
    const nextPage = useCallback(() => {
        if (view.level === 'page' && view.pageIdx < pages.length - 1) setView({ ...view, pageIdx: view.pageIdx + 1 });
    }, [view, pages.length]);

    /* ─── Archive search & Grouping ─── */
    const monthData = useMemo(() => {
        const all = Object.values(books) as BookLite[];
        const filtered = !search.trim() ? all : all.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || (b.author || '').toLowerCase().includes(search.toLowerCase()));

        // Group by Month Key (first part of ID before the dash for original IDs, or first part of new IDs)
        // New ID format: JAN-26-A
        const grouped: Record<string, BookLite[]> = {};
        const MONTH_KEYS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'NEXUS', 'BEFORE'];

        filtered.forEach(b => {
            const parts = b.id.split('-');
            const monthKey = parts[0]; // For JAN-26-A, it's JAN. For unit-TOWER-JAN-YEAR-2026-A, it's unit (oops)
            // Let's be smart about detecting tower key
            let key = 'OTHER';
            if (MONTH_KEYS.includes(monthKey)) key = monthKey;
            else if (b.id.includes('JAN')) key = 'JAN';
            else if (b.id.includes('FEB')) key = 'FEB';
            else if (b.id.includes('MAR')) key = 'MAR';
            else if (b.id.includes('APR')) key = 'APR';
            else if (b.id.includes('MAY')) key = 'MAY';
            else if (b.id.includes('JUN')) key = 'JUN';
            else if (b.id.includes('JUL')) key = 'JUL';
            else if (b.id.includes('AUG')) key = 'AUG';
            else if (b.id.includes('SEP')) key = 'SEP';
            else if (b.id.includes('OCT')) key = 'OCT';
            else if (b.id.includes('NOV')) key = 'NOV';
            else if (b.id.includes('DEC')) key = 'DEC';
            else if (b.id.includes('NEXUS')) key = 'NEXUS';
            else if (b.id.includes('BEFORE')) key = 'BEFORE';

            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(b);
        });

        // Sort books within each group (by ID which usually contains year/letter)
        Object.keys(grouped).forEach(k => {
            grouped[k].sort((a, b) => a.id.localeCompare(b.id));
        });

        return { grouped, total: filtered.length };
    }, [books, search]);

    const scrollToMonth = (month: string) => {
        const el = document.getElementById(`month-section-${month}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const close = useCallback(() => setCanonOpen(false), [setCanonOpen]);

    const handleRetrieve = useCallback((bookId: string) => {
        select(bookId);
        setCanonOpen(false);
    }, [select, setCanonOpen]);

    /* ─── format content ─── */
    const formatContent = (raw: string) =>
        raw.split('\n').map((line, i) => (
            <React.Fragment key={i}>
                {line}
                {i < raw.split('\n').length - 1 && <br />}
            </React.Fragment>
        ));

    /* ─── render ─── */
    return (
        <div style={S.overlay} onClick={close}>
            <div style={S.container} onClick={e => e.stopPropagation()}>
                {/* ─── HEADER BAR ─── */}
                <div style={S.header}>
                    {tab === 'canon' && view.level !== 'books' && (
                        <button
                            style={S.backBtn}
                            onClick={() => {
                                if (view.level === 'page') goChapters(view.book);
                                else goBooks();
                            }}
                        >
                            ◂ Back
                        </button>
                    )}
                    {(tab === 'archive' || (tab === 'canon' && view.level === 'books')) && <div style={{ width: 60 }} />}
                    <span style={S.headerTitle}>THE YOUNIVERSE</span>
                    <button style={S.closeBtn} onClick={close}>✕</button>
                </div>

                {/* ─── TAB BAR ─── */}
                <div style={S.tabBar}>
                    <button
                        style={{ ...S.tab, ...(tab === 'canon' ? S.tabActive : {}) }}
                        onClick={() => setTab('canon')}
                    >
                        CANON
                    </button>
                    <button
                        style={{ ...S.tab, ...(tab === 'archive' ? S.tabActive : {}) }}
                        onClick={() => setTab('archive')}
                    >
                        ARCHIVE INDEX
                    </button>
                </div>

                {/* ─── BODY ─── */}
                <div style={S.bookBody}>
                    {tab === 'canon' && (
                        <>
                            {/* SPINE */}
                            <div style={S.spine} />

                            {/* LEFT PAGE */}
                            <div style={S.leftPage}>
                                {view.level === 'books' && (
                                    <div style={S.leftInner}>
                                        <div style={S.emblem}>✦</div>
                                        <h1 style={S.bigTitle}>THE<br />YOUNIVERSE<br />CANON</h1>
                                        <div style={S.divider} />
                                        <p style={S.subtitle}>11 BOOKS · THE LIVING ARCHIVE</p>
                                    </div>
                                )}
                                {view.level === 'chapters' && (
                                    <div style={S.leftInner}>
                                        <p style={S.leftLabel}>BOOK {view.book.number}</p>
                                        <h2 style={S.leftHeading}>{view.book.subtitle}</h2>
                                        <div style={S.divider} />
                                        <p style={S.leftCaption}>{view.book.chapters.length} chapter{view.book.chapters.length !== 1 ? 's' : ''}</p>
                                    </div>
                                )}
                                {view.level === 'page' && currentPage && (
                                    <div style={S.leftInner}>
                                        <p style={S.leftLabel}>BOOK {view.book.number} · CH. {view.chapter.number}</p>
                                        <h2 style={S.leftHeading}>{view.chapter.title}</h2>
                                        <div style={S.divider} />
                                        <p style={S.leftCaption}>§ {currentPage.number}</p>
                                        <h3 style={S.pageTitle}>{currentPage.title}</h3>
                                    </div>
                                )}
                            </div>

                            {/* RIGHT PAGE */}
                            <div style={S.rightPage}>
                                {view.level === 'books' && (
                                    <div style={S.scrollArea}>
                                        {CANON_BOOKS.map((book, i) => (
                                            <button
                                                key={book.id}
                                                style={S.bookRow}
                                                onClick={() => goChapters(book)}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.08)'; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                            >
                                                <span style={S.roman}>{ROMAN[i]}</span>
                                                <span style={S.bookLabel}>{book.subtitle}</span>
                                                <span style={S.chevron}>›</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {view.level === 'chapters' && (
                                    <div style={S.scrollArea}>
                                        {view.book.chapters.map(ch => (
                                            <button
                                                key={ch.id}
                                                style={S.chapterRow}
                                                onClick={() => goPage(view.book, ch, 0)}
                                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.08)'; }}
                                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                            >
                                                <span style={S.chapterNum}>CH. {ch.number}</span>
                                                <span style={S.chapterTitle}>{ch.title}</span>
                                                <span style={S.chapterPages}>{ch.pages.length}p</span>
                                                <span style={S.chevron}>›</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {view.level === 'page' && currentPage && (
                                    <div style={S.scrollArea}>
                                        <div style={S.pageContent}>{formatContent(currentPage.content)}</div>
                                        <div style={S.pageNav}>
                                            <button style={{ ...S.pageNavBtn, opacity: view.pageIdx === 0 ? 0.3 : 1 }} disabled={view.pageIdx === 0} onClick={prevPage}>◂ Prev</button>
                                            <span style={S.pageIndicator}>{view.pageIdx + 1} / {pages.length}</span>
                                            <button style={{ ...S.pageNavBtn, opacity: view.pageIdx >= pages.length - 1 ? 0.3 : 1 }} disabled={view.pageIdx >= pages.length - 1} onClick={nextPage}>Next ▸</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* ─── ARCHIVE TAB ─── */}
                    {tab === 'archive' && (
                        <div style={S.archiveWrap}>
                            {/* Month Jump Bar */}
                            <div style={S.jumpBar}>
                                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'NEXUS', 'BEFORE'].map(m => (
                                    <button
                                        key={m}
                                        style={{ ...S.jumpBtn, opacity: monthData.grouped[m] ? 1 : 0.2 }}
                                        onClick={() => scrollToMonth(m)}
                                        disabled={!monthData.grouped[m]}
                                    >
                                        {m.slice(0, 3)}
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div style={S.searchBar}>
                                <input
                                    type="text"
                                    placeholder="Search archive..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={S.searchInput}
                                />
                            </div>

                            {/* Results table */}
                            <div style={S.archiveScroll}>
                                {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'NEXUS', 'BEFORE'].map(m => {
                                    const items = monthData.grouped[m];
                                    if (!items) return null;

                                    return (
                                        <div key={m} id={`month-section-${m}`}>
                                            <div style={S.monthHeader}>{m === 'NEXUS' || m === 'BEFORE' ? m : `${m} ARCHIVE`}</div>
                                            <div style={S.tableHeader}>
                                                <span style={{ ...S.tableCell, width: '30%', color: GOLD }}>ID</span>
                                                <span style={{ ...S.tableCell, flex: 1, color: GOLD }}>TITLE</span>
                                                <span style={{ ...S.tableCell, width: 80, color: GOLD }}>AUTHOR</span>
                                                <span style={{ ...S.tableCell, width: 80, textAlign: 'right' as const, color: GOLD }}>ACTION</span>
                                            </div>

                                            {items.map(book => (
                                                <div
                                                    key={book.id}
                                                    style={S.tableRow}
                                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,168,67,0.06)'; }}
                                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                                                >
                                                    <span style={{ ...S.tableCell, width: '30%', color: '#665f55', fontSize: 11 }}>{book.id}</span>
                                                    <span style={{ ...S.tableCell, flex: 1, color: '#e8dcc8', fontWeight: 600 }}>{book.title}</span>
                                                    <span style={{ ...S.tableCell, width: 80, color: '#8a8070', fontSize: 12 }}>{book.author || 'ONE'}</span>
                                                    <span style={{ ...S.tableCell, width: 80, textAlign: 'right' as const }}>
                                                        <button style={S.retrieveBtn} onClick={() => handleRetrieve(book.id)}>RETRIEVE</button>
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}

                                {monthData.total === 0 && (
                                    <div style={{ padding: '40px 0', textAlign: 'center' as const, color: '#665f55', fontStyle: 'italic', fontSize: 13 }}>
                                        No records found matching query sequence.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ─── FOOTER ─── */}
                <div style={S.footer}>
                    <span style={{ color: '#665f55', fontSize: 11 }}>
                        {tab === 'canon' ? 'THE YOUNIVERSE CANON · READ ONLY' : `ARCHIVE INDEX · ${monthData.total} RECORDS`}
                    </span>
                </div>
            </div>
        </div>
    );
};

/* ────────────────────── STYLES ────────────────────── */
const S: Record<string, React.CSSProperties> = {
    overlay: {
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
    },
    container: {
        width: '90vw',
        maxWidth: 1100,
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        background: BG_DARK,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 32px 100px rgba(0,0,0,0.8), 0 0 1px rgba(212,168,67,0.3)',
    },

    /* header */
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(28,24,20,0.6)',
    },
    headerTitle: {
        color: GOLD,
        fontSize: 14,
        letterSpacing: 4,
        fontWeight: 600,
        flex: 1,
        textAlign: 'center' as const,
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: GOLD,
        cursor: 'pointer',
        fontSize: 13,
        letterSpacing: 1,
        padding: '4px 12px',
        borderRadius: 4,
        minWidth: 60,
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#665f55',
        cursor: 'pointer',
        fontSize: 18,
        padding: '4px 8px',
    },

    /* tabs */
    tabBar: {
        display: 'flex',
        borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(20,17,14,0.8)',
    },
    tab: {
        flex: 1,
        padding: '10px 0',
        border: 'none',
        background: 'transparent',
        color: '#665f55',
        fontSize: 11,
        letterSpacing: 3,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'color 0.2s, border-color 0.2s',
        borderBottom: '2px solid transparent',
    },
    tabActive: {
        color: GOLD,
        borderBottom: `2px solid ${GOLD}`,
    },

    /* book body */
    bookBody: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
    },
    spine: {
        width: 6,
        background: `linear-gradient(180deg, ${GOLD}22, ${GOLD}88, ${GOLD}22)`,
        flexShrink: 0,
    },

    /* left page */
    leftPage: {
        width: '40%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        background: BG_PAGE,
        borderRight: `1px solid ${BORDER}`,
    },
    leftInner: { textAlign: 'center' as const },
    emblem: { color: GOLD, fontSize: 48, marginBottom: 24, opacity: 0.6 },
    bigTitle: { color: GOLD, fontSize: 28, fontWeight: 700, letterSpacing: 6, lineHeight: 1.4, margin: 0 },
    divider: { width: 60, height: 1, background: GOLD, margin: '20px auto', opacity: 0.4 },
    subtitle: { color: '#8a8070', fontSize: 11, letterSpacing: 3, margin: 0 },
    leftLabel: { color: GOLD, fontSize: 11, letterSpacing: 4, margin: '0 0 12px 0', opacity: 0.7 },
    leftHeading: { color: '#e8dcc8', fontSize: 22, fontWeight: 600, margin: 0, lineHeight: 1.3 },
    leftCaption: { color: '#8a8070', fontSize: 12, letterSpacing: 2, margin: 0 },
    pageTitle: { color: GOLD, fontSize: 16, fontWeight: 500, marginTop: 12 },

    /* right page */
    rightPage: { flex: 1, display: 'flex', flexDirection: 'column', background: BG_PAGE, overflow: 'hidden' },
    scrollArea: { flex: 1, overflowY: 'auto' as const, padding: '24px 32px' },

    /* book list */
    bookRow: {
        display: 'flex', alignItems: 'center', width: '100%', padding: '14px 16px',
        border: 'none', borderBottom: `1px solid ${BORDER}`, background: 'transparent',
        cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left' as const,
    },
    roman: { color: GOLD, fontSize: 16, fontWeight: 700, width: 44, flexShrink: 0, letterSpacing: 2 },
    bookLabel: { color: '#d4cfc8', fontSize: 14, flex: 1, letterSpacing: 1 },
    chevron: { color: GOLD, fontSize: 18, opacity: 0.5, marginLeft: 8 },

    /* chapter list */
    chapterRow: {
        display: 'flex', alignItems: 'center', width: '100%', padding: '12px 16px',
        border: 'none', borderBottom: `1px solid ${BORDER}`, background: 'transparent',
        cursor: 'pointer', transition: 'background 0.15s', textAlign: 'left' as const, gap: 12,
    },
    chapterNum: { color: GOLD, fontSize: 11, fontWeight: 600, width: 52, flexShrink: 0, letterSpacing: 1, opacity: 0.7 },
    chapterTitle: { color: '#d4cfc8', fontSize: 14, flex: 1 },
    chapterPages: { color: '#665f55', fontSize: 11, marginRight: 4 },

    /* page content */
    pageContent: { color: '#c8c0b4', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-wrap' as const, letterSpacing: 0.2 },
    pageNav: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 0 8px', borderTop: `1px solid ${BORDER}`, marginTop: 24,
    },
    pageNavBtn: {
        background: 'none', border: `1px solid ${BORDER}`, color: GOLD,
        cursor: 'pointer', fontSize: 12, padding: '6px 16px', borderRadius: 4, letterSpacing: 1,
    },
    pageIndicator: { color: '#665f55', fontSize: 12 },

    /* ─── ARCHIVE TAB ─── */
    archiveWrap: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    searchBar: {
        padding: '16px 24px',
        borderBottom: `1px solid ${BORDER}`,
        background: BG_PAGE,
    },
    searchInput: {
        width: '100%',
        background: 'rgba(0,0,0,0.4)',
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        padding: '10px 16px',
        color: '#e8dcc8',
        fontSize: 13,
        fontFamily: 'monospace',
        letterSpacing: 0.5,
        outline: 'none',
    },
    archiveScroll: {
        flex: 1,
        overflowY: 'auto' as const,
        padding: '0 24px',
    },
    tableHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: `2px solid ${BORDER}`,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 2,
        fontFamily: 'monospace',
    },
    tableRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: `1px solid ${BORDER}`,
        transition: 'background 0.15s',
        fontFamily: 'monospace',
        fontSize: 13,
    },
    tableCell: {
        padding: '0 8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap' as const,
    },
    /* Jump Bar */
    jumpBar: {
        display: 'flex',
        gap: 2,
        padding: '8px 24px',
        borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(20,17,14,0.4)',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    jumpBtn: {
        background: 'none',
        border: 'none',
        color: GOLD,
        fontSize: 10,
        fontWeight: 600,
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: 2,
        fontFamily: 'monospace',
    },
    monthHeader: {
        padding: '24px 0 8px',
        fontSize: 14,
        fontWeight: 800,
        color: GOLD,
        letterSpacing: 4,
        borderBottom: `1px solid ${BORDER}`,
        marginTop: 12,
        fontFamily: 'monospace',
    },
    retrieveBtn: {
        background: GOLD,
        color: BG_DARK,
        border: 'none',
        padding: '4px 12px',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1,
        borderRadius: 2,
        cursor: 'pointer',
        fontFamily: 'monospace',
    },

    /* footer */
    footer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '10px 0',
        borderTop: `1px solid ${BORDER}`,
        background: 'rgba(28,24,20,0.4)',
    },
};
