
import React, { useRef } from 'react';
import { useSystem } from '../../stores/system';

export const MobileControls = () => {
    const keys = useSystem(s => s.keys);

    const triggerKey = (code: string, active: boolean) => {
        const eventType = active ? 'keydown' : 'keyup';
        window.dispatchEvent(new KeyboardEvent(eventType, { code }));
    };

    const handleTouchStart = (code: string) => (e: React.TouchEvent) => {
        e.preventDefault(); // Prevent scroll/zoom
        triggerKey(code, true);
    };

    const handleTouchEnd = (code: string) => (e: React.TouchEvent) => {
        e.preventDefault();
        triggerKey(code, false);
    };

    // Style for glass buttons
    const btnClass = "w-16 h-16 rounded-full bg-neutral-900/50 backdrop-blur-md border border-amber-500/30 active:bg-amber-500/40 active:border-amber-500 flex items-center justify-center text-amber-500/80 font-bold select-none touch-none shadow-lg";

    return (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-end pb-8 px-6">
            <div className="flex justify-between items-end w-full pointer-events-auto">
                {/* D-PAD Area */}
                <div className="grid grid-cols-3 gap-2">
                    <div></div>
                    <button
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.forward)}
                        onTouchEnd={handleTouchEnd(keys.forward)}
                    >▲</button>
                    <div></div>

                    <button
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.left)}
                        onTouchEnd={handleTouchEnd(keys.left)}
                    >◀</button>
                    <button
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.backward)}
                        onTouchEnd={handleTouchEnd(keys.backward)}
                    >▼</button>
                    <button
                        className={btnClass}
                        onTouchStart={handleTouchStart(keys.right)}
                        onTouchEnd={handleTouchEnd(keys.right)}
                    >▶</button>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col gap-4 items-end">
                    <button
                        className={`${btnClass} w-20 h-20 border-amber-400/50 bg-amber-900/20`}
                        onTouchStart={handleTouchStart(keys.interact)}
                        onTouchEnd={handleTouchEnd(keys.interact)}
                    >SPACE</button>
                    <div className="flex gap-2">
                        <button
                            className={btnClass}
                            onTouchStart={handleTouchStart(keys.up)}
                            onTouchEnd={handleTouchEnd(keys.up)}
                        >UP</button>
                        <button
                            className={btnClass}
                            onTouchStart={handleTouchStart(keys.down)}
                            onTouchEnd={handleTouchEnd(keys.down)}
                        >DN</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
