import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom color palette
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-code': 'var(--bg-code)',
        'bg-hover': 'var(--bg-hover)',
        
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-code': 'var(--text-code)',
        
        'accent-cyan': 'var(--accent-cyan)',
        'accent-green': 'var(--accent-green)',
        'accent-purple': 'var(--accent-purple)',
        'accent-orange': 'var(--accent-orange)',
        'accent-red': '#ff0033',
        'accent-blue': '#00b4d8',
        
        'link': 'var(--link-color)',
        'link-hover': 'var(--link-hover)',
        'border': 'var(--border-color)',
        'selection-bg': 'var(--selection-bg)',
        'selection-text': 'var(--selection-text)',
        
        'muted': 'rgb(161 161 170 / <alpha-value>)',
        'dim': 'rgb(113 113 122 / <alpha-value>)',
      },
      
      // Font scale setup
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.75rem' }],
        'lg': ['1.125rem', { lineHeight: '1.875rem' }],
        'xl': ['1.25rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
      },
      
      // Spacing system
      spacing: {
        '0': '0px',
        'px': '1px',
        '0.5': '0.125rem',
        '1': '0.25rem',
        '1.5': '0.375rem',
        '2': '0.5rem',
        '2.5': '0.625rem',
        '3': '0.75rem',
        '3.5': '0.875rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '14': '3.5rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '28': '7rem',
        '32': '8rem',
        '36': '9rem',
        '40': '10rem',
        '44': '11rem',
        '48': '12rem',
        '52': '13rem',
        '56': '14rem',
        '60': '15rem',
        '64': '16rem',
        '72': '18rem',
        '80': '20rem',
        '96': '24rem',
      },
      
      // Breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      
      // Typography plugin customization
      typography: ({ theme }: any) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.text-primary'),
            '--tw-prose-headings': theme('colors.text-primary'),
            '--tw-prose-lead': theme('colors.text-secondary'),
            '--tw-prose-links': theme('colors.link'),
            '--tw-prose-bold': theme('colors.text-primary'),
            '--tw-prose-counters': theme('colors.text-secondary'),
            '--tw-prose-bullets': theme('colors.text-secondary'),
            '--tw-prose-hr': theme('colors.border'),
            '--tw-prose-quotes': theme('colors.text-secondary'),
            '--tw-prose-quote-borders': theme('colors.accent-purple'),
            '--tw-prose-captions': theme('colors.text-tertiary'),
            '--tw-prose-code': theme('colors.text-code'),
            '--tw-prose-pre-code': theme('colors.text-primary'),
            '--tw-prose-pre-bg': theme('colors.bg-code'),
            '--tw-prose-th-borders': theme('colors.border'),
            '--tw-prose-td-borders': theme('colors.border'),
            
            // Base styles
            color: 'var(--tw-prose-body)',
            maxWidth: '65ch',
            
            // Links
            'a': {
              color: 'var(--tw-prose-links)',
              textDecoration: 'underline',
              fontWeight: '400',
              '&:hover': {
                color: theme('colors.link-hover'),
                textShadow: '0 0 8px rgba(0, 255, 255, 0.5)',
              },
            },
            
            // Code blocks
            'pre': {
              backgroundColor: 'var(--tw-prose-pre-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '0.5rem',
            },
            
            'code': {
              backgroundColor: theme('colors.bg-code'),
              padding: '0.125em 0.375em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
            },
            
            // Blockquotes
            'blockquote': {
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              borderLeftWidth: '0.25rem',
              fontStyle: 'normal',
              color: 'var(--tw-prose-quotes)',
              quotes: 'none',
            },
            
            // Headings
            'h1, h2, h3, h4': {
              color: 'var(--tw-prose-headings)',
              fontWeight: '500',
            },
            
            // Tables
            'thead': {
              borderBottomColor: 'var(--tw-prose-th-borders)',
            },
            'tbody tr': {
              borderBottomColor: 'var(--tw-prose-td-borders)',
            },
          },
        },
        
        // Dark mode (already in dark theme by default)
        invert: {
          css: {
            // We're already in dark mode, so no need for invert
          },
        },
      }),
      
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-noto-sans-kr)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'Courier New', 'monospace'],
      },
      
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'glitch': 'glitch 0.3s ease-in-out',
        'blink': 'blink 1s infinite',
      },
      
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'glitch': {
          '0%, 100%': { textShadow: '0 0 2px var(--accent-cyan)' },
          '25%': { textShadow: '-1px 0 2px var(--accent-purple), 1px 0 2px var(--accent-green)' },
          '50%': { textShadow: '1px 0 2px var(--accent-cyan), -1px 0 2px var(--accent-orange)' },
          '75%': { textShadow: '0 0 2px var(--accent-green)' },
        },
        'blink': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config;