import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const backgroundColors = {
   neutral: {
      DEFAULT: 'hsl(var(--color-bg-neutral) / <alpha-value>)',
      inverted: 'hsl(var(--color-bg-neutral-inverted) / <alpha-value>)',
   },
   subtle: 'hsl(var(--color-bg-subtle) / <alpha-value>)',
   accent: 'hsl(var(--color-accent) / <alpha-value>)',
};

const borderColors = {
   bold: 'hsl(var(--color-border-bold) / <alpha-value>)',
   copy: 'hsl(var(--color-text-copy) / <alpha-value>)',
   accent: 'hsl(var(--color-accent) / <alpha-value>)',
};

const textColors = {
   copy: 'hsl(var(--color-text-copy) / <alpha-value>)',
   accent: 'hsl(var(--color-accent) / <alpha-value>)',
};

/**
 * Typography
 *
 * Two self-hosted variable fonts (loaded in src/styles/index.css):
 *  - `font-sans`    → body copy, UI controls, tables      (default: Inter)
 *  - `font-display` → headings, titles, navigation        (default: Outfit)
 *
 * The actual family names live in the `--font-sans` / `--font-display` CSS
 * variables declared in src/styles/global.css. Change them there to re-skin the
 * whole app.
 *
 * The `display-*` sizes are fluid (clamp) so headings scale smoothly between
 * mobile and desktop without per-breakpoint overrides. Each entry bundles
 * line-height and letter-spacing so a single `text-display-md` class gives a
 * fully tuned heading.
 */
const fontFamily = {
   sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
   display: ['var(--font-display)', ...defaultTheme.fontFamily.sans],
};

/*
 * The UI uses exactly three weights. Defining them here (not under `extend`)
 * removes every other `font-*` weight utility, so `font-bold` or `font-light`
 * compile to nothing and the Prettier plugin leaves them unsorted as a tell.
 */
const fontWeight = {
   normal: '400',
   medium: '500',
   semibold: '600',
};

const fontSize = {
   'display-xl': [
      'clamp(2.25rem, 1.75rem + 2vw, 3.5rem)',
      { lineHeight: '1.05', letterSpacing: '-0.025em' },
   ],
   'display-lg': [
      'clamp(1.875rem, 1.5rem + 1.25vw, 2.5rem)',
      { lineHeight: '1.1', letterSpacing: '-0.02em' },
   ],
   'display-md': [
      'clamp(1.5rem, 1.25rem + 0.75vw, 1.875rem)',
      { lineHeight: '1.15', letterSpacing: '-0.02em' },
   ],
   'display-sm': [
      'clamp(1.25rem, 1.125rem + 0.5vw, 1.5rem)',
      { lineHeight: '1.2', letterSpacing: '-0.01em' },
   ],
   'display-xs': ['1.125rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
} satisfies Record<
   string,
   [string, { lineHeight: string; letterSpacing: string }]
>;

export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   darkMode: 'class',
   theme: {
      // Replaces the defaults: no `font-serif`, `font-mono` or extra weights.
      fontFamily,
      fontWeight,
      extend: {
         fontSize,
         colors: {
            'primary-background-color': 'var(--primary-background-color)',
            'secondary-background-color': 'var(--secondary-background-color)',
            'tertiary-background-color': 'var(--tertiary-background-color)',
         },
         // Background concerns
         backgroundColor: backgroundColors,
         gradientColorStops: backgroundColors,
         // ...
         // Border concerns
         borderColor: borderColors,
         stroke: borderColors,
         outlineColor: borderColors,
         ringColor: borderColors,
         // ...
         textColor: textColors,
         fill: textColors,
         // ...
      },
   },
   plugins: [],
} satisfies Config;
