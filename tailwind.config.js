/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pd-bg': '#f6f8fb',
        'pd-surface': '#ffffff',
        'pd-border': '#e6eaf1',
        'pd-text': '#0f172a',
        'pd-muted': '#6b7280',
        'pd-primary': '#2563eb',
        'pd-success': '#22c55e',
        'pd-warning': '#f59e0b',
        'pd-danger': '#ef4444',
      },
      fontFamily: {
        'inter': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Apple Color Emoji', 'Segoe UI Emoji'],
      },
    },
  },
  plugins: [],
}
