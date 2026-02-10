/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./App.tsx",
        "./index.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                paper: '#fdfaf1',
                ink: '#2d2926',
                'ink-light': '#5a544f',
                'surface-dark': '#1a1817',
                wood: '#5c4033',
            },
            fontFamily: {
                serif: ['"EB Garamond"', 'serif'],
                display: ['"Cinzel"', 'serif'],
                sans: ['"Inter"', 'sans-serif'],
            },
            screens: {
                'xs': '480px',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    },
    plugins: [],
}
