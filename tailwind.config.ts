/** @type {import('tailwindcss').Config} */
import { type Config } from 'tailwindcss';

const backgroundColors = {
   neutral: {
      DEFAULT: 'hsl(var(--color-bg-neutral) / <alpha-value>)',
      inverted: 'hsl(var(--color-bg-neutral-inverted) / <alpha-value>)',
   },
};

const borderColors = {
   bold: 'hsl(var(--color-border-bold) / <alpha-value>)',
};

const textColors = {
   copy: 'hsl(var(--color-text-copy) / <alpha-value>)',
};

export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   darkMode: 'class',
   theme: {
      extend: {
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
};
