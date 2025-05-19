/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        coral: '#f47a7a',
        sand: '#f8d1a0',
        lavender: '#d6c5e8',
        mint: '#b7e5d3',
        sky: '#a0c2f8',

        // Base UI colors
        dark: '#1c1c1c',
        light: '#fdf6f0',

        // Gradient colors
        'gradient-start': '#fce8e4',
        'gradient-end': '#e1f3ee',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },

      // Add custom animations
      keyframes: {
        floatCircle: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(5px, -3px) scale(1.02)' },
          '50%': { transform: 'translate(-2px, 5px) scale(0.98)' },
          '75%': { transform: 'translate(-4px, -2px) scale(1.01)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        subtleShake: {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(1px, 1px)' },
          '50%': { transform: 'translate(-1px, 0px)' },
          '75%': { transform: 'translate(0px, -1px)' },
          '100%': { transform: 'translate(0, 0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        float: 'floatCircle 10s ease-in-out infinite',
        'float-delay-0': 'floatCircle 10s ease-in-out infinite',
        'float-delay-1': 'floatCircle 10s ease-in-out infinite -2s',
        'float-delay-2': 'floatCircle 10s ease-in-out infinite -4s',
        'float-delay-3': 'floatCircle 10s ease-in-out infinite -6s',
        'subtle-shake': 'subtleShake 0.5s ease-in-out infinite',
        fadeIn: 'fadeIn 0.5s ease-out',
      },

      // Add blur variations
      blur: {
        xl: '8px',
        '2xl': '16px',
        '3xl': '24px',
      },

      // Add transition durations
      transitionDuration: {
        2000: '2000ms',
        3000: '3000ms',
      },

      // Background image
      backgroundImage: {
        'wendi-gradient':
          'linear-gradient(135deg, var(--tw-colors-gradient-start), var(--tw-colors-gradient-end))',
      },
    },
  },
  plugins: [],
};
