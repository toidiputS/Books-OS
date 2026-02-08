/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
                rajdhani: ['Rajdhani', 'sans-serif'],
            },
            colors: {
                vattles: {
                    bg: '#0D0B14',
                    card: '#14111F',
                    purple: '#D455F1',
                    teal: '#44E4D3',
                    yellow: '#F0E54D',
                    blue: '#4685E5',
                }
            },
            animation: {
                'spin-slow': 'spin 12s linear infinite',
                'shimmer': 'shimmer 2s infinite',
                'flicker': 'flicker 3s infinite',
            },
            keyframes: {
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                flicker: {
                    '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
                    '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
                }
            }
        },
    },
    plugins: [],
}
