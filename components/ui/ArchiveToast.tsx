
import React, { useEffect, useState } from 'react';

interface Toast {
    id: number;
    message: string;
}

let toastId = 0;
const listeners: Set<(toast: Toast) => void> = new Set();

// Call this from anywhere to show a toast
export function showToast(message: string) {
    const toast: Toast = { id: ++toastId, message };
    listeners.forEach(fn => fn(toast));
}

export function ArchiveToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        const handler = (toast: Toast) => {
            setToasts(prev => [...prev, toast]);
            // Auto-dismiss after 5s
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toast.id));
            }, 5000);
        };

        listeners.add(handler);
        return () => { listeners.delete(handler); };
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-3 pointer-events-none">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="pointer-events-auto px-8 py-4 bg-black/95 border border-[#D4AF37]/40 backdrop-blur-lg shadow-[0_0_40px_rgba(212,175,55,0.15)] animate-fade-in"
                    style={{ animation: 'fadeInUp 0.4s ease-out' }}
                >
                    <p className="font-mono text-xs text-[#D4AF37] tracking-wide leading-relaxed text-center max-w-md">
                        {toast.message}
                    </p>
                </div>
            ))}

            <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </div>
    );
}
