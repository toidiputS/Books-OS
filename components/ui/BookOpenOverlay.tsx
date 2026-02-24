import React, { useState } from 'react';
import { BookLite } from '../../stores/library';

type Props = {
    book: BookLite;
    onClose: () => void;
};

type ChapterContent = {
    id: string;
    title: string;
    subtitle: string;
    page: string;
};

// Colors based on Spec
const COLORS = {
    bg: '#121212',
    text: '#F5F5DC', // Cream/Beige
    accent: '#D4AF37', // Gold
    dim: 'rgba(245, 245, 220, 0.4)',
    border: 'rgba(212, 175, 55, 0.2)'
};

// Generic placeholder chapters for every book
const PLACEHOLDER_CHAPTERS: ChapterContent[] = [
    { id: '1', title: 'CHAPTER\nONE', subtitle: 'Chapter I', page: '01' },
    { id: '2', title: 'CHAPTER\nTWO', subtitle: 'Chapter II', page: '03' },
    { id: '3', title: 'CHAPTER\nTHREE', subtitle: 'Chapter III', page: '05' },
    { id: '4', title: 'CHAPTER\nFOUR', subtitle: 'Chapter IV', page: '07' },
];

export const BookOpenOverlay = ({ book, onClose }: Props) => {
    const chapters = PLACEHOLDER_CHAPTERS;
    const [activeChapterId, setActiveChapterId] = useState<string | null>('1');
    const activeChapter = chapters.find(c => c.id === activeChapterId);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8 bg-black/95 backdrop-blur-md animate-fade-in"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Main Container */}
            <div className="relative w-full max-w-[1200px] aspect-[1.6/1] flex shadow-2xl rounded-sm overflow-hidden border border-[#222]">

                {/* Background Grid Pattern */}
                <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Spine Shadow */}
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-32 bg-gradient-to-r from-black/0 via-black/80 to-black/0 pointer-events-none z-30"></div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-[#111] z-30"></div>

                {/* LEFT PAGE - Cover / Title Area */}
                <div className="w-1/2 relative bg-[#121212] flex flex-col items-center justify-center p-12 border-r border-[#1a1a1a]">
                    <div className="w-full max-w-[400px] border border-[#F5F5DC]/20 h-full p-8 flex flex-col items-center justify-center relative">
                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#D4AF37]"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[#D4AF37]"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[#D4AF37]"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#D4AF37]"></div>

                        {activeChapter ? (
                            <div className="text-center animate-fade-in w-full">
                                {/* Book identity header */}
                                <p className="font-mono text-[9px] tracking-[0.4em] text-[#D4AF37]/60 mb-4 uppercase">{book.spineLetter ? `BOOK ${book.spineLetter}` : ''}</p>
                                <p className="font-serif italic text-sm text-[#888] mb-8 max-w-[280px] mx-auto leading-relaxed">{book.title}</p>

                                <p className="font-mono text-[10px] tracking-[0.3em] text-[#666] mb-8 uppercase">{activeChapter.subtitle}</p>
                                <h1 className="font-serif text-5xl md:text-6xl text-[#D4AF37] mb-8 whitespace-pre-line leading-tight">
                                    {activeChapter.title}
                                </h1>

                                <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto mb-8"></div>

                                <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] font-mono text-[#333]">
                                    {activeChapter.page}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center">
                                <p className="font-mono text-[9px] tracking-[0.4em] text-[#D4AF37]/60 mb-6 uppercase">{book.spineLetter ? `BOOK ${book.spineLetter}` : ''}</p>
                                <h1 className="font-serif text-6xl text-[#D4AF37] mb-4">INDEX</h1>
                                <div className="w-12 h-px bg-[#D4AF37] mx-auto mb-6"></div>
                                <p className="font-serif italic text-sm text-[#888] max-w-[260px] mx-auto leading-relaxed">{book.title}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PAGE - Content Area */}
                <div className="w-1/2 relative bg-[#121212] p-12 overflow-y-auto custom-scrollbar">
                    <div className="w-full max-w-[420px] mx-auto h-full flex flex-col">

                        <div className="flex-1 mt-8">
                            {activeChapter ? (
                                <div className="animate-fade-in flex flex-col items-center justify-center h-full text-center">
                                    {/* Decorative icon */}
                                    <span className="material-symbols-outlined text-[#D4AF37]/20 mb-8" style={{ fontSize: '64px' }}>auto_stories</span>

                                    {/* Placeholder message */}
                                    <p className="font-serif italic text-xl text-[#F5F5DC]/70 mb-3 max-w-[320px] leading-relaxed">
                                        This chapter is being prepared.
                                    </p>
                                    <p className="font-serif italic text-sm text-[#F5F5DC]/30 mb-8">
                                        Check back soon.
                                    </p>

                                    {/* Decorative divider */}
                                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent mb-8"></div>

                                    {/* Book type badge */}
                                    {book.summary && (
                                        <div className="border border-[#333] px-4 py-2 rounded-sm">
                                            <p className="font-mono text-[9px] tracking-[0.3em] text-[#444] uppercase">{book.summary}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <nav className="space-y-8 mt-12">
                                    {chapters.map((chapter) => (
                                        <button
                                            key={chapter.id}
                                            onClick={() => setActiveChapterId(chapter.id)}
                                            className="w-full text-left group border-b border-[#222] pb-4 hover:border-[#D4AF37] transition-colors"
                                        >
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="font-serif text-xl text-[#F5F5DC] group-hover:text-[#D4AF37] transition-colors">
                                                    {chapter.title.replace('\n', ' ')}
                                                </span>
                                                <span className="font-mono text-xs text-[#444]">{chapter.page}</span>
                                            </div>
                                            <span className="font-mono text-[10px] tracking-widest text-[#666] uppercase">{chapter.subtitle}</span>
                                        </button>
                                    ))}
                                </nav>
                            )}
                        </div>

                        {/* Action Bar */}
                        <div className="mt-12 pt-6 border-t border-[#222] flex justify-between items-center">
                            <div className="font-mono text-[9px] tracking-widest text-[#444] uppercase">
                                {activeChapter ? `CONFIG SCHEMA: V2.1` : `TERMINAL: 0X4F2A`}
                            </div>
                        </div>

                        {/* Page Number */}
                        <div className="text-right mt-4 text-[10px] font-mono text-[#333]">
                            {activeChapter ? (parseInt(activeChapter.page) + 1).toString().padStart(3, '0') : '000'}
                        </div>
                    </div>
                </div>

                {/* Global Controls */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#444] hover:text-[#D4AF37] transition-colors z-50"
                >
                    <span className="material-symbols-outlined text-3xl">close</span>
                </button>

                {/* Back Button (Only if deep) */}
                {activeChapter && (
                    <button
                        onClick={() => setActiveChapterId(null)} // Go to Index
                        className="absolute top-6 left-6 text-[#444] hover:text-[#D4AF37] transition-colors z-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span className="font-mono text-[10px] tracking-widest uppercase">Index</span>
                    </button>
                )}

                {/* Navigation Arrows */}
                {activeChapter && (
                    <>
                        <button
                            onClick={() => {
                                const idx = chapters.findIndex(c => c.id === activeChapterId);
                                if (idx > 0) setActiveChapterId(chapters[idx - 1].id);
                            }}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#D4AF37] transition-colors ${activeChapterId === '1' ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <span className="material-symbols-outlined text-4xl">chevron_left</span>
                        </button>
                        <button
                            onClick={() => {
                                const idx = chapters.findIndex(c => c.id === activeChapterId);
                                if (idx < chapters.length - 1) setActiveChapterId(chapters[idx + 1].id);
                            }}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#333] hover:text-[#D4AF37] transition-colors ${activeChapterId === '4' ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            <span className="material-symbols-outlined text-4xl">chevron_right</span>
                        </button>
                    </>
                )}

            </div>

            {/* Books OS Footer */}
            <div className="fixed bottom-0 left-0 w-full p-4 border-t border-[#222] bg-black text-[#444] font-mono text-[10px] tracking-[0.2em] flex justify-between z-40">
                <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#222]"></div>
                    SYSTEM ONLINE
                </div>
                <div>COPYRIGHT 2024 BOOKS OS</div>
            </div>
        </div>
    );
};