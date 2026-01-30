/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                clipto: {
                    primary: '#FF6B35',      // Spec Brand Primary
                    primaryDark: '#E85A29',  // Spec Brand Dark
                    primaryLight: '#FFA726', // Spec Brand Light
                    background: '#212121',   // Keep dark background base
                    surface: '#303030',      // Spec Dark Theme BG
                    surfaceLight: '#424242', // Elevated
                    divider: '#616161',      // Spec Grey 700
                    text: '#FFFFFF',
                    textSecondary: '#E0E0E0', // Spec Grey 300
                    textMuted: '#9E9E9E',     // Spec Grey 500
                    error: '#F44336',        // Spec Error
                    success: '#4CAF50',      // Spec Success
                    attention: '#FF9800',    // Spec Warning
                }
            },
            fontFamily: {
                sans: ['Roboto', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['Source Code Pro', 'Consolas', 'monospace'],
            },
            fontSize: {
                'title': ['18px', { lineHeight: '1.3', fontWeight: '500' }],
                'content': ['16px', { lineHeight: '1.5' }],
                'metadata': ['12px', { lineHeight: '1.4' }],
            },
            boxShadow: {
                'clipto': '0 2px 4px rgba(0, 0, 0, 0.3)',
                'clipto-lg': '0 8px 16px rgba(0, 0, 0, 0.4)',
                'fab': '0 6px 10px rgba(0, 0, 0, 0.3), 0 2px 3px rgba(0, 0, 0, 0.2)',
            },
            animation: {
                'drawer-slide-in': 'drawerSlideIn 0.3s ease-out',
                'drawer-slide-out': 'drawerSlideOut 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
                'fab-scale': 'fabScale 0.15s ease-out',
            },
            keyframes: {
                drawerSlideIn: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0)' },
                },
                drawerSlideOut: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fabScale: {
                    '0%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)' },
                },
            },
            borderRadius: {
                'clipto': '12px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
