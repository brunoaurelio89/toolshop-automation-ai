# Instalações: Playwright, ESLint e Prettier

Guia de instalação e configuração das ferramentas do projeto **toolshop-automation-ai**.

**Ordem recomendada:**

1. Playwright: cria o `package.json` e a estrutura do projeto.
2. ESLint e Prettier: padrão e formatação do código.
3. VS Code: formatação automática ao salvar.

---

## 1. Playwright

### Instalação

O comando abaixo inicializa um projeto novo ou adiciona o Playwright a um projeto existente.

**npm:**

```bash
npm init playwright@latest
```

Durante a instalação, escolha ou confirme:

| Pergunta | Padrão | Neste projeto |
|---|---|---|
| TypeScript ou JavaScript | TypeScript | **TypeScript** |
| Nome da pasta de testes | `tests` (ou `e2e` se `tests` já existir) | **tests** |
| Adicionar workflow do GitHub Actions | Recomendado para CI | **Sim**: Adiantando a etapa E4 |
| Instalar os navegadores do Playwright | Sim | **Sim** |

O comando pode ser executado de novo depois, sem sobrescrever os testes existentes.

> Também é possível criar e rodar testes pela [extensão do Playwright para VS Code](https://playwright.dev/docs/getting-started-vscode).

### O que é instalado

O Playwright baixa os navegadores necessários e cria esta estrutura:

```
playwright.config.ts         # Configuração dos testes
package.json
package-lock.json            # Ou yarn.lock / pnpm-lock.yaml
tests/
  example.spec.ts            # Teste mínimo de exemplo
```

- O [`playwright.config.ts`](https://playwright.dev/docs/test-configuration) centraliza a configuração: navegadores, timeouts, retries, projetos, relatórios e mais.
- Em projetos existentes, as dependências são adicionadas ao `package.json` atual.
- A pasta `tests/` traz um teste inicial mínimo.

**Neste projeto:** depois da instalação, apague o `tests/example.spec.ts` e a pasta `tests-examples/`, se ela existir.

---

## 2. ESLint e Prettier

### Instalação das dependências

Use o gerenciador de pacotes de sua preferência para instalar as dependências de desenvolvimento.

**npm:**

```bash
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
```

**Neste projeto (TypeScript + Playwright),** instale também os pacotes abaixo:

```bash
npm install --save-dev @eslint/js typescript-eslint eslint-plugin-playwright
```

### Configuração do ESLint

Se ainda não houver um arquivo de configuração, inicialize o ESLint:

```bash
npx eslint --init
```

Depois, edite o arquivo de configuração para incluir o Prettier: `eslint.config.mjs` no formato moderno ou `.eslintrc.json` no formato legado.

**Formato moderno (ESLint Flat Config):**

```js
import prettier from 'eslint-config-prettier';

export default [
  // ... suas outras configurações
  prettier, // Desativa regras de formatação conflitantes
];
```

#### Configuração completa deste projeto (`eslint.config.mjs`)

Junta TypeScript, as regras do Playwright para os testes e o Prettier:

```js
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
```

O `eslint-plugin-prettier/recommended` já inclui o `eslint-config-prettier`. Por isso ele fica **por último** na lista.

### Configuração do Prettier (`.prettierrc`)

Padrão usado nos exemplos de código do projeto:

```json
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}
```

E um `.prettierignore` com as pastas geradas:

```
node_modules/
playwright-report/
test-results/
allure-results/
allure-report/
playwright/.auth/
```

---

## 3. VS Code

Instale as extensões **ESLint** e **Prettier - Code formatter**.

Para o Prettier formatar o código ao salvar, crie ou edite o arquivo `.vscode/settings.json` na raiz do projeto:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

A integração via `eslint-plugin-prettier` e `eslint-config-prettier` impede que o ESLint entre em conflito com as regras de formatação do Prettier: o formato do código passa a ser tratado como uma regra de lint.

---

## 4. Scripts no `package.json`

```json
"scripts": {
  "test": "playwright test",
  "test:smoke": "playwright test --grep @smoke",
  "test:bugs": "cross-env TEST_ENV=with-bugs playwright test",
  "report": "playwright show-report",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

## 5. Verificação

```bash
npx playwright --version
```

```bash
npm run lint
```

```bash
npm run format
```

Se os três comandos rodarem sem erro, as instalações estão prontas.
