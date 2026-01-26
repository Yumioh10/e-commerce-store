/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#44D7A8",
          secondary: "#19A99A",
          dark: "#069494",
          light: "#68D7A8",
          coral: "#FF7782",
          'coral-light': "#FFD3AC",
        },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-up': 'slideUp 0.5s ease-out',
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
    },
  },
},
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
} ;