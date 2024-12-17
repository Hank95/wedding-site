/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			sage: {
  				'100': '#f1f4ed',
  				'200': '#e3e9db',
  				'300': '#d5deca',
  				'400': '#c7d3b8',
  				'500': '#b9c8a6',
  				'600': '#9aad85',
  				'700': '#7c9264',
  				'800': '#5d7743',
  				'900': '#3f5c22'
  			},
  			ivory: {
  				'100': '#fefef9',
  				'200': '#fdfdf3',
  				'300': '#fcfced',
  				'400': '#fbfbe7',
  				'500': '#fafae1',
  				'600': '#f8f8d1',
  				'700': '#f6f6c1',
  				'800': '#f4f4b1',
  				'900': '#f2f2a1'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			serif: [
  				'Cormorant Garamond',
  				'serif'
  			],
  			display: [
  				'Playfair Display',
  				'serif'
  			],
  			script: [
  				'Pinyon Script',
  				'cursive'
  			],
  			formal: [
  				'Cormorant Garamond',
  				'serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    tailwindcssAnimate,
  ],
}

