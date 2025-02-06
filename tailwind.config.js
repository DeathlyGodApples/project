/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
        },
        secondary: {
          50: 'rgb(var(--secondary-50) / <alpha-value>)',
          100: 'rgb(var(--secondary-100) / <alpha-value>)',
          200: 'rgb(var(--secondary-200) / <alpha-value>)',
          300: 'rgb(var(--secondary-300) / <alpha-value>)',
          400: 'rgb(var(--secondary-400) / <alpha-value>)',
          500: 'rgb(var(--secondary-500) / <alpha-value>)',
          600: 'rgb(var(--secondary-600) / <alpha-value>)',
          700: 'rgb(var(--secondary-700) / <alpha-value>)',
          800: 'rgb(var(--secondary-800) / <alpha-value>)',
          900: 'rgb(var(--secondary-900) / <alpha-value>)',
        },
        neutral: {
          50: 'rgb(var(--neutral-50) / <alpha-value>)',
          100: 'rgb(var(--neutral-100) / <alpha-value>)',
          200: 'rgb(var(--neutral-200) / <alpha-value>)',
          300: 'rgb(var(--neutral-300) / <alpha-value>)',
          400: 'rgb(var(--neutral-400) / <alpha-value>)',
          500: 'rgb(var(--neutral-500) / <alpha-value>)',
          600: 'rgb(var(--neutral-600) / <alpha-value>)',
          700: 'rgb(var(--neutral-700) / <alpha-value>)',
          800: 'rgb(var(--neutral-800) / <alpha-value>)',
          900: 'rgb(var(--neutral-900) / <alpha-value>)',
        },
        accent: {
          success: 'rgb(var(--accent-success) / <alpha-value>)',
          warning: 'rgb(var(--accent-warning) / <alpha-value>)',
          error: 'rgb(var(--accent-error) / <alpha-value>)',
          info: 'rgb(var(--accent-info) / <alpha-value>)',
        },
      },
      boxShadow: {
        'neumorph': '6px 6px 12px rgb(var(--shadow-colored) / 0.1), -4px -4px 12px rgb(var(--shadow-light) / 0.8)',
        'neumorph-lg': '8px 8px 16px rgb(var(--shadow-colored) / 0.12), -6px -6px 16px rgb(var(--shadow-light) / 0.9)',
        'neumorph-sm': '4px 4px 8px rgb(var(--shadow-colored) / 0.1), -2px -2px 8px rgb(var(--shadow-light) / 0.8)',
        'neumorph-inset': 'inset 6px 6px 12px rgb(var(--shadow-colored) / 0.1), inset -4px -4px 12px rgb(var(--shadow-light) / 0.8)',
        'neumorph-sm-inset': 'inset 4px 4px 8px rgb(var(--shadow-colored) / 0.1), inset -2px -2px 8px rgb(var(--shadow-light) / 0.8)',
      },
      backgroundImage: {
        'gradient-matte': 'linear-gradient(145deg, rgb(var(--bg-gradient-start)), rgb(var(--bg-gradient-end)))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('tailwind-scrollbar'),
  ],
}