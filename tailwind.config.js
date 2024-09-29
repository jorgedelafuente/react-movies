/** @type {import('tailwindcss').Config} */
export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
      extend: {
         colors: {
            'primary-background-color': 'var(--primary-background-color)',
            'secondary-background-color': 'var(--secondary-background-color)',
         },
      },
   },
   plugins: [],
};
