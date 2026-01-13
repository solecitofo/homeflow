/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta HomeFlow
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8B7FC8', // Púrpura suave principal
          600: '#7c6fb5',
          700: '#6d5fa0',
          800: '#5e4f8b',
          900: '#4f3f76',
        },
        sage: {
          50: '#f6f9f3',
          100: '#e8f2e1',
          200: '#d4e7c7',
          300: '#bbd9a8',
          400: '#A8C686', // Verde sage principal
          500: '#92b76d',
          600: '#7da157',
          700: '#688a45',
          800: '#537338',
          900: '#3e5c2b',
        },
        empathy: {
          50: '#eff8fb',
          100: '#d9eef5',
          200: '#b8dfe9',
          300: '#92cedd',
          400: '#7EB5D6', // Azul empático principal
          500: '#6ba3c3',
          600: '#5890af',
          700: '#467d9b',
          800: '#356a87',
          900: '#255773',
        },
        warm: {
          50: '#fef9e7',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#F4D35E', // Amarillo cálido principal
          500: '#e8c04e',
          600: '#dbad3e',
          700: '#ce9a2e',
          800: '#c1871e',
          900: '#b4740e',
        },
        coral: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#FA8F85', // Coral suave principal
          500: '#e87c72',
          600: '#d6695f',
          700: '#c4564c',
          800: '#b24339',
          900: '#a03026',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [],
}