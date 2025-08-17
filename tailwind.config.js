/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        premium: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe', 
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'float-slow-offset': 'float 5s ease-in-out 2.5s infinite',
        'float': 'float 4s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'pulse-flow': 'pulse-flow 3s linear infinite',
        'pulse-width': 'pulse-width 3s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float-bounce': 'float-bounce 8s ease-in-out infinite',
        'pulse-float': 'pulse-float 6s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
        'count': 'count 2s ease-out forwards',
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'shimmer-slow': 'shimmer-slow 4s linear infinite',
        'float-particle': 'float-particle 8s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'slide-in-up': 'slide-in-up 0.7s ease-out',
        'slide-in-down': 'slide-in-down 0.7s ease-out',
        'fade-scale': 'fade-scale 0.7s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'pulse-flow': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-width': {
          '0%, 100%': { width: '86%' },
          '50%': { width: '88%' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 0.7 },
          '50%': { opacity: 0.3 },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'float-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: 0.7 },
          '25%': { transform: 'translateY(-15px) scale(1.05)', opacity: 0.9 },
          '50%': { transform: 'translateY(0) scale(1)', opacity: 0.7 },
          '75%': { transform: 'translateY(8px) scale(0.95)', opacity: 0.6 },
        },
        'pulse-float': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: 0.6 },
          '50%': { transform: 'translateY(-10px) scale(1.2)', opacity: 0.9 },
        },
        count: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'gradient-shift': {
          '0%, 100%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'hue-rotate(5deg)'
          },
        },
        'shimmer-slow': {
          '0%': { transform: 'translateX(-100%) skewX(-15deg)' },
          '100%': { transform: 'translateX(200%) skewX(-15deg)' },
        },
        'float-particle': {
          '0%, 100%': { 
            transform: 'translateY(0) translateX(0) scale(1)',
            opacity: 0.2
          },
          '25%': { 
            transform: 'translateY(-20px) translateX(10px) scale(1.1)',
            opacity: 0.4
          },
          '50%': { 
            transform: 'translateY(0) translateX(20px) scale(1)',
            opacity: 0.2
          },
          '75%': { 
            transform: 'translateY(15px) translateX(5px) scale(0.9)',
            opacity: 0.3
          },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(59, 130, 246, 0.3)',
            filter: 'brightness(1)'
          },
          '50%': { 
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.6)',
            filter: 'brightness(1.2)'
          },
        },
        'slide-in-up': {
          '0%': { 
            transform: 'translateY(30px)',
            opacity: 0
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: 1
          },
        },
        'slide-in-down': {
          '0%': { 
            transform: 'translateY(-30px)',
            opacity: 0
          },
          '100%': { 
            transform: 'translateY(0)',
            opacity: 1
          },
        },
        'fade-scale': {
          '0%': { 
            transform: 'scale(0.95)',
            opacity: 0
          },
          '100%': { 
            transform: 'scale(1)',
            opacity: 1
          },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 15px 2px rgba(59, 130, 246, 0.5)',
        'glow-indigo': '0 0 15px 2px rgba(99, 102, 241, 0.5)',
        'glow-purple': '0 0 15px 2px rgba(147, 51, 234, 0.5)',
        'glow': '0 0 25px 5px rgba(59, 130, 246, 0.15)',
        'glow-dark': '0 0 6px rgba(255, 255, 255, 0.15)',
        'glow-amber': '0 0 15px rgba(251, 191, 36, 0.3)',
        'premium': '0 10px 25px -3px rgba(245, 158, 11, 0.18)',
        'premium-sm': '0 4px 12px -2px rgba(245, 158, 11, 0.15)',
        'premium-lg': '0 15px 30px -5px rgba(245, 158, 11, 0.25)',
        'premium-dark': '0 10px 25px -3px rgba(245, 158, 11, 0.25)',
        'premium-dark-lg': '0 15px 35px -5px rgba(245, 158, 11, 0.35)',
        'card': '0 4px 28px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'card-dark': '0 8px 24px rgba(0, 0, 0, 0.2)',
        'card-dark-hover': '0 12px 30px rgba(0, 0, 0, 0.3)',
        'button': '0 2px 10px rgba(14, 165, 233, 0.3)',
        'button-sm': '0 1px 6px rgba(14, 165, 233, 0.2)',
        'button-lg': '0 4px 18px rgba(14, 165, 233, 0.35)',
        'subtle': '0 2px 15px rgba(0, 0, 0, 0.06)',
        'subtle-dark': '0 2px 15px rgba(0, 0, 0, 0.2)',
        'inner-light': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)',
      },
      transitionProperty: {
        'width': 'width',
        'transform': 'transform',
      },
      inset: {
        '1/6': '16.666667%',
        '3/6': '50%',
        '5/6': '83.333333%',
        '0': '0px',  // Add explicit 0 value
        // Add standard values that would normally be included
        'auto': 'auto',
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      perspective: {
        'none': 'none',
        '250': '250px',
        '500': '500px',
        '750': '750px',
        '1000': '1000px',
        '1200': '1200px',
        '1500': '1500px',
      },
      transformOrigin: {
        'center-3d': 'center center -50px',
        'top-3d': 'top center -50px',
        'bottom-3d': 'bottom center -50px',
      },
    },
  },
  plugins: [
    // Use the built-in inset plugin from Tailwind
    require('@tailwindcss/forms'),
  ],
};
