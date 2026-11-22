import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'allure-results/',
      'allure-report/',
      'playwright/.auth/',
    ],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**'],
  },
  prettierRecommended, // Prettier como regra de lint + desativa regras conflitantes
]);
