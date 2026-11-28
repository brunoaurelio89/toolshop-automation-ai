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
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // skip só com condição (ex.: sem credenciais no .env); skip fixo continua avisando
      'playwright/no-skipped-test': ['warn', { allowConditional: true }],
    },
  },
  {
    // Regra 1 da arquitetura (E2): o teste não usa seletor; quem conhece a tela é o Page Object
    files: ['tests/e2e/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.property.name=/^(locator|getBy[A-Z]\\w*|\\$\\$?)$/]',
          message: 'Teste não usa seletor: crie o locator no Page Object (regra 1 da E2).',
        },
      ],
    },
  },
  {
    // Regra 2 da arquitetura (E2): o Page Object não faz asserção
    files: ['src/pages/**', 'src/components/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['expect'],
              message: 'Page Object não faz asserção: valide no teste (regra 2 da E2).',
            },
            {
              name: '../fixtures',
              importNames: ['expect'],
              message: 'Page Object não faz asserção: valide no teste (regra 2 da E2).',
            },
          ],
        },
      ],
    },
  },
  prettierRecommended, // Prettier como regra de lint + desativa regras conflitantes
]);
