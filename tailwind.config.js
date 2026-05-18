/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        premium: '0 10px 40px -15px rgba(0,0,0,0.20)',
        soft: '0 8px 24px -12px rgba(17,17,17,0.16)'
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.08) 1px, transparent 0)'
      }
    }
  },
  plugins: []
}
