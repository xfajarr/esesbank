export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Fredoka', 'sans-serif'],
      },
      colors: {
        brand: {
          yellow: '#FFC700',
          blue: '#2E86DE',
          red: '#EE5253',
          green: '#1DD1A1',
          purple: '#8A3DFF',
          dark: '#1E272E',
          navy: '#12172B',
          orange: '#FF9F43',
          'dark-surface': '#1C2631'
        }
      },
      boxShadow: {
        'brawl': '0 6px 0 0 rgba(0, 0, 0, 0.3)',
        'brawl-active': '0 2px 0 0 rgba(0, 0, 0, 0.3)',
        'brawl-thick': '6px 6px 0px 0px #1E272E',
        'brawl-thick-dark': '6px 6px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
      }
    }
  },
  plugins: [],
}
