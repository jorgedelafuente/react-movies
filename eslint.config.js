import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import pluginQuery from '@tanstack/eslint-plugin-query';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
   // Ignore patterns
   {
      ignores: [
         'dist',
         'node_modules',
         'coverage',
         '*.config.js',
         '*.config.ts',
         'src/routeTree.gen.ts',
      ],
   },

   // Base JavaScript recommended rules
   js.configs.recommended,

   // TypeScript recommended rules
   ...tseslint.configs.recommended,

   // React, TypeScript, and accessibility configuration
   {
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
         parserOptions: {
            ecmaFeatures: {
               jsx: true,
            },
         },
      },
      plugins: {
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
         'jsx-a11y': jsxA11y,
         '@tanstack/query': pluginQuery,
         'simple-import-sort': simpleImportSort,
      },
      rules: {
         // Import order
         'simple-import-sort/imports': 'error',
         'simple-import-sort/exports': 'error',

         // React Hooks rules
         'react-hooks/rules-of-hooks': 'error',
         'react-hooks/exhaustive-deps': 'warn',

         // React Refresh rules
         'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
         ],

         // Accessibility rules (axe-core style)
         'jsx-a11y/alt-text': 'error',
         'jsx-a11y/anchor-has-content': 'error',
         'jsx-a11y/anchor-is-valid': 'error',
         'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
         'jsx-a11y/aria-props': 'error',
         'jsx-a11y/aria-proptypes': 'error',
         'jsx-a11y/aria-role': 'error',
         'jsx-a11y/aria-unsupported-elements': 'error',
         'jsx-a11y/click-events-have-key-events': 'warn',
         'jsx-a11y/heading-has-content': 'error',
         'jsx-a11y/html-has-lang': 'error',
         'jsx-a11y/iframe-has-title': 'error',
         'jsx-a11y/img-redundant-alt': 'error',
         'jsx-a11y/interactive-supports-focus': 'warn',
         'jsx-a11y/label-has-associated-control': 'error',
         'jsx-a11y/media-has-caption': 'warn',
         'jsx-a11y/mouse-events-have-key-events': 'warn',
         'jsx-a11y/no-access-key': 'error',
         'jsx-a11y/no-autofocus': 'warn',
         'jsx-a11y/no-distracting-elements': 'error',
         'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
         'jsx-a11y/no-noninteractive-element-interactions': 'warn',
         'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
         'jsx-a11y/no-noninteractive-tabindex': 'warn',
         'jsx-a11y/no-redundant-roles': 'error',
         'jsx-a11y/no-static-element-interactions': 'warn',
         'jsx-a11y/role-has-required-aria-props': 'error',
         'jsx-a11y/role-supports-aria-props': 'error',
         'jsx-a11y/scope': 'error',
         'jsx-a11y/tabindex-no-positive': 'warn',

         // TanStack Query rules
         '@tanstack/query/exhaustive-deps': 'error',

         // TypeScript specific overrides
         '@typescript-eslint/no-unused-vars': [
            'warn',
            {
               argsIgnorePattern: '^_',
               varsIgnorePattern: '^_',
               caughtErrorsIgnorePattern: '^_',
            },
         ],
         '@typescript-eslint/no-explicit-any': 'warn',
         '@typescript-eslint/no-unused-expressions': [
            'error',
            {
               allowShortCircuit: true,
               allowTernary: true,
            },
         ],
      },
   },

   // Node.js scripts
   {
      files: ['scripts/**/*.mjs'],
      languageOptions: {
         globals: globals.node,
      },
   },

   // Prettier config (must be last to override conflicting rules)
   eslintConfigPrettier
);
