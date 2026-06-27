/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#0a0a14',
          900: '#0f1219',
          800: '#151b2a',
          700: '#1a2333',
          600: '#2d3a4f',
          500: '#3d4a5c',
        },
        gold: {
          700: '#b8860b',
          600: '#d4af37',
          500: '#e6c75d',
          400: '#f0d86a',
          300: '#f5e6a0',
          100: '#fef3c7',
        },
        emerald: {
          100: '#d1fae5',
          600: '#10b981',
          700: '#059669',
        },
        amber: {
          100: '#fef3c7',
          600: '#f59e0b',
        },
        red: {
          100: '#fee2e2',
          600: '#ef4444',
          700: '#dc2626',
        },
        blue: {
          600: '#3b82f6',
          700: '#2563eb',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.3' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '2xl': ['1.5rem', { lineHeight: '1.4' }],
        'xl': ['1.25rem', { lineHeight: '1.5' }],
        'lg': ['1.125rem', { lineHeight: '1.6' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'sm': ['0.875rem', { lineHeight: '1.5' }],
        'xs': ['0.75rem', { lineHeight: '1.5' }],
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
        '5xl': '8rem',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glow-midnight': '0 0 20px rgba(10, 10, 20, 0.2)',
      },
      animation: {
        fadeIn: 'fadeIn 300ms ease-out',
        slideUp: 'slideUp 300ms ease-out',
        slideDown: 'slideDown 300ms ease-out',
        slideInRight: 'slideInRight 300ms ease-out',
        slideOutRight: 'slideOutRight 250ms ease-in',
        scaleIn: 'scaleIn 250ms ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s infinite',
        shake: 'shake 300ms cubic-bezier(0.36, 0, 0.66, 1)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideOutRight: {
          from: { opacity: '1', transform: 'translateX(0)' },
          to: { opacity: '0', transform: 'translateX(20px)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1200px 0' },
          '100%': { backgroundPosition: '1200px 0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
      transitionTimingFunction: {
        'ease-out-cubic': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-cubic': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-in-out-cubic': 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      scale: {
        '102': '1.02',
      },
      ringOffsetColor: {
        DEFAULT: '#ffffff',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f0d86a 100%)',
        'gradient-midnight': 'linear-gradient(135deg, #0a0a14 0%, #1a2333 100%)',
        'gradient-subtle': 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, transparent 100%)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '20px',
      },
    },
  },
  plugins: [],
};
