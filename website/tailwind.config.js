/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      '3xl': '1724px',
      ...defaultTheme.screens,

    },
    extend: {
      colors: {
        'nav': '#2F2F2F',
        'cta': '#3E9CEA'
      },
      transitionDuration: {
        '2000': '2000ms',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      },
      backgroundColor: {

        smallNav: "#343333",
        nav: '#2F2F2F',
      },
      textColor: {
        'cta-button': '#36ADE6',
        'PricingColorSecoundy': '#2F2F2F',
      },
      borderColor: {
        'nav-button': '#454545',
        DashboardNav: '#424242'
      },
      ringColor: {
        'box-button': '#4A82EF',
        
      },
    },
  },
  plugins: [
  ],
}

