import type { Config } from 'tailwindcss'

// La Crème brand palette – high contrast and legibility
const colors = {
  primary: {
    DEFAULT: '#282E52',      // deep indigo for primary elements
    contrast: '#FFFFFF',      // white text on primary
    light: '#49508a',         // lighter shade for hover states
  },
  secondary: {
    DEFAULT: '#E4B363',       // warm sand tone for accents
    contrast: '#1F253D',      // dark text on secondary
    light: '#F1CD94',         // lighter secondary
  },
  background: {
    DEFAULT: '#F9FAFB',      // very light grey background
    dark: '#F3F4F6',         // slightly darker for alternating rows
  },
  neutral: {
    700: '#374151',          // dark text
    500: '#6B7280',          // medium text
    300: '#D1D5DB',          // light borders
  },
} as const

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        background: colors.background,
        neutral: colors.neutral,
      },
      borderRadius: {
        lg: '12px',
        md: '10px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config