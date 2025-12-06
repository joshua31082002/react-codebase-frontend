import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

import eslintParser from '@typescript-eslint/parser';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginTS from '@typescript-eslint/eslint-plugin';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
  globalIgnores(['./dist**/*', './build**/*', './node_modules/*', '.env**', 'package**.json']),
  {
    files: ['**/*.{ts,tsx,js}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: eslintParser,
    },
    plugins: {
      react: eslintPluginReact,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
      '@typescript-eslint': eslintPluginTS,
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      'no-unused-vars': 'error',
      'prettier/prettier': 'error',
      'no-console': ['error', { allow: ['error'] }],
      'unused-imports/no-unused-imports': 'error',
    },
  },
]);
