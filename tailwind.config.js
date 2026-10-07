/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#F4F6F9', dark: '#121826' },
        sheet: { DEFAULT: '#FFFFFF', dark: '#1A2233' },
        ink: { DEFAULT: '#1B2540', soft: '#4A5573', dark: '#E4E9F2', darksoft: '#9AA5BD' },
        pen: { DEFAULT: '#2F5D9A', dark: '#7FA8E0' },
        done: { DEFAULT: '#2E7D5B', dark: '#5CC296' },
        marker: '#FFE27A',
        rule: { DEFAULT: '#DCE2EC', dark: '#2A3550' },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'Cambria', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      maxWidth: { read: '42rem' },
    },
  },
  plugins: [],
};
