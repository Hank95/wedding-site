/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          100: '#f1f4ed',
          200: '#e3e9db',
          300: '#d5deca',
          400: '#c7d3b8',
          500: '#b9c8a6',
          600: '#9aad85',
          700: '#7c9264',
          800: '#5d7743',
          900: '#3f5c22',
        },
        ivory: {
          100: '#fefef9',
          200: '#fdfdf3',
          300: '#fcfced',
          400: '#fbfbe7',
          500: '#fafae1',
          600: '#f8f8d1',
          700: '#f6f6c1',
          800: '#f4f4b1',
          900: '#f2f2a1',
        },
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'display': ['Playfair Display', 'serif'],
        'script': ['Pinyon Script', 'cursive'],
        'formal': ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}

