import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {colors: {
        brand: {
          primary: '#19A99A',
          secondary: '#44D7A8',
          dark: '#069494',
          light: '#68D7A8',
          coral: '#FF7782',
          'coral-light': '#FFD3AC',
        },
        medical: {
          white: '#FAFBFC',
          gray: '#F0F4F8',
          text: '#1A202C',
          'text-secondary': '#4A5568',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
} satisfies Config;

