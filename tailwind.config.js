/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'var(--bg-primary)',
                foreground: 'var(--text-primary)',
                muted: 'var(--bg-muted)',
                'muted-foreground': 'var(--text-muted)',
                border: 'var(--border-color)',
                accent: {
                    DEFAULT: 'var(--accent-color)',
                    foreground: 'var(--accent-foreground)',
                },
                // Preserving original palette for specific uses
                'deep-midnight-blue': '#0B1220',
                'indigo-ink': '#0E2651',
                'soft-ice': '#F6F8FB',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'fade-up': 'fadeUp 0.7s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
