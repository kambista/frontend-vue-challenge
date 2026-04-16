/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        kambista: {
          navy:     '#111760',
          'navy-mid': '#0E1358',
          'navy-dark': '#0A0E4A',
          teal:     '#4EC9C0',
          'teal-hover': '#3ABFB7',
          'teal-active': '#2DAAA2',
          'teal-muted': '#A7E4E0',
          bg:       '#F0F2F5',
          'blue-info-bg': '#EEF6FF',
          'blue-info-text': '#1D4ED8',
          'blue-info-icon': '#3B82F6',
        },
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
