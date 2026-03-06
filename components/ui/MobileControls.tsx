
import React from 'react';
import { setMoveFlag, type MoveFlags } from '../../stores/moveState';
import { useLibrary } from '../../stores/library';

export const MobileControls = () => {

    const summonBook = useLibrary(s => s.summonBook);
    const bookStates = useLibrary(s => s.bookStates);
    const books = useLibrary(s => s.books);
    const select = useLibrary(s => s.select);
    const libraryCardName = useLibrary(s => s.libraryCardName);

    /* ─── movement touch handlers ─── */
    const handleTouchStart = (flag: keyof MoveFlags) => (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMoveFlag(flag, true);
    };

    const handleTouchEnd = (flag: keyof MoveFlags) => (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMoveFlag(flag, false);
    };

    /* ─── action handlers ─── */
    const handleSummon = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        summonBook();
    };

    const handleInteract = (e: React.TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const heldId = Object.keys(bookStates).find(id => bookStates[id] === 'held');
        if (heldId) {
            const book = books[heldId];
            if (!libraryCardName) {
                alert("ACCESS DENIED: NO LIBRARY CARD.");
            } else if (book && !book.isLocked) {
                select(heldId);
            }
        }
    };

    // Glass button style
    const btn: React.CSSProperties = {
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'rgba(23, 23, 23, 0.5)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(245, 158, 11, 0.8)',
        fontWeight: 700,
        fontSize: 18,
        userSelect: 'none',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        cursor: 'pointer',
    };

    const btnSmall: React.CSSProperties = {
        ...btn,
        width: 52,
        height: 52,
        fontSize: 11,
        fontFamily: 'monospace',
        letterSpacing: 1,
    };

    const btnAction: React.CSSProperties = {
        ...btn,
        width: 72,
        height: 72,
        border: '1px solid rgba(245, 158, 11, 0.5)',
        background: 'rgba(120, 53, 15, 0.2)',
        fontSize: 11,
        fontFamily: 'monospace',
        letterSpacing: 1,
    };

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingBottom: 32,
            paddingLeft: 24,
            paddingRight: 24,
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '100%',
                pointerEvents: 'auto',
            }}>
                {/* D-PAD Area */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                }}>
                    <div></div>
                    <button
                        style={btn}
                        onTouchStart={handleTouchStart('forward')}
                        onTouchEnd={handleTouchEnd('forward')}
                        onTouchCancel={handleTouchEnd('forward')}
                    >▲</button>
                    <div></div>

                    <button
                        style={btn}
                        onTouchStart={handleTouchStart('left')}
                        onTouchEnd={handleTouchEnd('left')}
                        onTouchCancel={handleTouchEnd('left')}
                    >◀</button>
                    <button
                        style={btn}
                        onTouchStart={handleTouchStart('backward')}
                        onTouchEnd={handleTouchEnd('backward')}
                        onTouchCancel={handleTouchEnd('backward')}
                    >▼</button>
                    <button
                        style={btn}
                        onTouchStart={handleTouchStart('right')}
                        onTouchEnd={handleTouchEnd('right')}
                        onTouchCancel={handleTouchEnd('right')}
                    >▶</button>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    alignItems: 'flex-end',
                }}>
                    {/* Interact / Open */}
                    <button
                        style={btnAction}
                        onTouchStart={handleInteract}
                    >OPEN</button>

                    {/* Summon + Up/Down row */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            style={btnSmall}
                            onTouchStart={handleSummon}
                        >GRAB</button>
                        <button
                            style={btnSmall}
                            onTouchStart={handleTouchStart('up')}
                            onTouchEnd={handleTouchEnd('up')}
                            onTouchCancel={handleTouchEnd('up')}
                        >UP</button>
                        <button
                            style={btnSmall}
                            onTouchStart={handleTouchStart('down')}
                            onTouchEnd={handleTouchEnd('down')}
                            onTouchCancel={handleTouchEnd('down')}
                        >DN</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
