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
        background: '#09090B', // Zinc 950 canvas
        card: {
          DEFAULT: '#121215', // Elevated card surface
          hover: '#18181C',
          subtle: '#0F0F12',
        },
        border: {
          DEFAULT: '#27272A', // Zinc 800 subtle hairline
          subtle: '#1F1F23',
          bright: '#3F3F46',
        },
        foreground: {
          DEFAULT: '#FAFAFA', // Primary text
          muted: '#A1A1AA', // Muted text (Zinc 400)
          subtle: '#71717A', // Extra muted (Zinc 500)
        },
        // Strict Semantic Accents ONLY
        emerald: {
          DEFAULT: '#10B981', // Racing Emerald
          muted: 'rgba(16, 185, 129, 0.12)',
          border: 'rgba(16, 185, 129, 0.25)',
        },
        amber: {
          DEFAULT: '#F59E0B', // Shop Warning Amber
          muted: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.25)',
        },
        guardsRed: {
          DEFAULT: '#EF4444', // Guards Red
          muted: 'rgba(239, 68, 68, 0.12)',
          border: 'rgba(239, 68, 68, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        hairline: '0 0 0 1px #27272A',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.5)',
        popover: '0 8px 32px -4px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}
