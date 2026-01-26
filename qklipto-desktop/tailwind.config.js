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
                    primary: '#f9aa33',      // Amber accent (from Android colorAccent)
                    primaryDark: '#c17c00',  // Darker amber
                    primaryLight: '#ffdd6d', // Lighter amber
                    background: '#212121',   // Main background (colorPrimaryInverse)
                    surface: '#2E3032',      // Card background (colorPrimary)
                    surfaceLight: '#494B4C', // Elevated surfaces (colorPrimaryLight)
                    divider: '#424242',      // Dividers
                    text: '#ffffff',
                    textSecondary: '#b3b3b3',
                    textMuted: '#757575',
                    error: '#ee494c',        // colorNegative
                    success: '#49b483',      // colorPositive
                    attention: '#FFC400',    // colorAttention
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
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
    plugins: [],
}
