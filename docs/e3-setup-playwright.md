# E3 – Instalação do Playwright e primeiro teste

Como o projeto foi preparado para rodar testes e qual foi o primeiro teste automatizado: o **smoke de login**. A estrutura segue a [arquitetura da E2](arquitetura.md).

## Resultado

| Item                 | Resultado                                                                          |
| -------------------- | ---------------------------------------------------------------------------------- |
| `npm run test:smoke` | **2 de 2 passando** em 10,7 s (chromium), contra o Toolshop público, em 26/11/2026 |
| `npm run lint`       | 0 erros e 0 avisos                                                                 |
| Regras 1 e 2 da E2   | Garantidas pelo ESLint: 3 violações de teste plantadas, 3 erros apontados          |
| Tempo da etapa       | 11 minutos entre criar a branch (21h13) e o commit com os testes passando (21h24)  |
| Pull Request         | [#11](https://github.com/brunoaurelio89/toolshop-automation-ai/pull/11)            |

## O que foi instalado

| Pacote                                  | Para quê                                                    |
| --------------------------------------- | ----------------------------------------------------------- |
| `@playwright/test`                      | Framework de testes E2E (só o chromium é usado)             |
| `dotenv`                                | Lê o `.env` com o ambiente e as credenciais                 |
| `cross-env`                             | Define `TEST_ENV` no script `test:bugs` em qualquer sistema |
| ESLint, Prettier e plugin do Playwright | Padrão de código e regras da arquitetura (instalados na E1) |

## Ambientes

O ambiente é escolhido por `TEST_ENV` e resolvido em [src/config/env.ts](../src/config/env.ts). Um valor inválido para a execução com uma mensagem clara, em vez de rodar contra a URL errada.

| `TEST_ENV`        | UI                                              | API                                                 |
| ----------------- | ----------------------------------------------- | --------------------------------------------------- |
| `normal` (padrão) | `https://practicesoftwaretesting.com`           | `https://api.practicesoftwaretesting.com`           |
| `with-bugs`       | `https://with-bugs.practicesoftwaretesting.com` | `https://api-with-bugs.practicesoftwaretesting.com` |

As credenciais (`USER_EMAIL`, `USER_PASSWORD`) ficam no `.env`, que está no `.gitignore`. O repositório só tem o [.env.example](../.env.example), sem dados reais.

## Configuração do Playwright

Principais pontos do [playwright.config.ts](../playwright.config.ts):

| Opção                            | Valor                                   | Motivo                                                           |
| -------------------------------- | --------------------------------------- | ---------------------------------------------------------------- |
| `baseURL`                        | URL da UI do ambiente                   | Os Page Objects navegam com caminhos relativos                   |
| `testIdAttribute`                | `data-test`                             | O Toolshop usa `data-test` em quase todos os elementos (E0)      |
| `projects`                       | só chromium                             | O foco é o comportamento da loja, não a compatibilidade          |
| `workers`                        | 2                                       | O site é público e compartilhado                                 |
| `retries`                        | 2 no CI, 0 local                        | Falha local aparece na hora; no CI absorve instabilidade da rede |
| `trace` / `screenshot` / `video` | na 1ª retentativa / na falha / na falha | Evidência para analisar as falhas (E8)                           |
| `reporter`                       | `list` + `html`                         | Saída no terminal e relatório navegável                          |

## Estrutura criada

```
src/
├── config/env.ts         → ambiente e credenciais
├── pages/
│   ├── LoginPage.ts      → acessar() e logar(); locators dentro do login-form
│   └── AccountPage.ts    → título da área do cliente
├── fixtures/index.ts     → loginPage e accountPage prontos para o teste
├── components/           → vazio (.gitkeep), recebe o PaymentForm na E7
├── api/                  → vazio (.gitkeep)
└── data/                 → vazio (.gitkeep)
tests/
└── e2e/login/login.spec.ts
```

O `tests/example.spec.ts` gerado pelo instalador foi removido.

## Primeiro teste: smoke de login

| Caso (E5) | Regra | Cenário                      | Verificação                                     | Tags                      |
| --------- | ----- | ---------------------------- | ----------------------------------------------- | ------------------------- |
| CT-01     | RN01  | Login com a conta de teste   | Vai para `/account` com o título "My account"   | `@smoke` `@RN01` `@CT-01` |
| CT-05     | RN02  | Login com e-mail inexistente | "Invalid email or password" e continua no login | `@smoke` `@RN02` `@CT-05` |

**Por que o CT-05 e não o CT-04:** o CT-04 usa um e-mail cadastrado com senha errada. Pela RN27, 3 senhas erradas bloqueiam a conta para sempre. Rodar o CT-04 com a conta de teste a bloquearia na terceira execução e derrubaria toda a suíte. O CT-05 valida a mesma mensagem genérica sem esse risco. O CT-04 fica para quando existir uma conta descartável, criada pela API (E7).

Sem `USER_EMAIL` e `USER_PASSWORD` definidos, o CT-01 aparece como _skipped_ em vez de falhar. Isso vale para o CI até os GitHub Secrets entrarem na E4.

## Regras da arquitetura no lint

As regras 1 e 2 da E2 deixaram de depender só da revisão: o [eslint.config.mjs](../eslint.config.mjs) aponta erro quando elas são quebradas.

| Regra                             | Onde vale                           | Como o ESLint verifica                                        |
| --------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| 1. O teste não usa seletor        | `tests/e2e/**`                      | `no-restricted-syntax` proíbe `locator()`, `getBy*()` e `$()` |
| 2. O Page Object não faz asserção | `src/pages/**`, `src/components/**` | `no-restricted-imports` proíbe importar `expect`              |
| `test.skip` só com condição       | `tests/**`                          | `playwright/no-skipped-test` com `allowConditional`           |

Para conferir, foram criados arquivos temporários com 2 seletores dentro de um teste e um `expect` dentro de um Page Object. O lint apontou os 3 erros, e os arquivos foram apagados.

## Diferenças em relação ao plano

| Planejado                            | Feito                                           | Motivo                                                  |
| ------------------------------------ | ----------------------------------------------- | ------------------------------------------------------- |
| Branch `feature/e3-setup-playwright` | `feat/e3-setup-playwright`                      | Padrão de branches do README (E1)                       |
| LoginPage a partir do codegen        | LoginPage a partir do mapa de `data-test` da E0 | Os seletores já estavam levantados e confirmados        |
| Teste "senha inválida" (CT-04)       | CT-05 com e-mail inexistente                    | Evitar o bloqueio permanente da RN27                    |
| URLs só da UI no config              | UI e API por ambiente em `src/config/env.ts`    | Prepara o cliente de API (E2) sem mudar o config depois |
| Verificar só a URL depois do login   | URL + título "My account"                       | O resultado esperado do CT-01 inclui o título           |

## Uso de IA

Todo o código desta etapa foi gerado pelo Claude Code e revisado contra as regras da E2. Nenhum erro de seletor frágil (SEL) ou de arquitetura (ARQ) apareceu. As correções foram:

| O que a IA fez                                                                                       | Correção                                                                        | Código ([metricas-ia.md](metricas-ia.md)) |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------- |
| Marcou o login válido com `@RN01 @RN02`                                                              | Trocado por `@RN01 @CT-01`, conferindo o `tesCases.md`                          | OUT                                       |
| O plano chamava o negativo de "senha inválida" (CT-04), embora o dado já fosse um e-mail inexistente | Renomeado e ligado ao CT-05 (e-mail inexistente), que é o caso que o dado cobre | OUT (caso de teste errado)                |
| O plugin do Playwright avisou sobre o `test.skip` das credenciais                                    | Liberado só o skip com condição, sem desligar a regra                           | OUT                                       |

## Pendências para as próximas etapas

- **Conta de teste própria:** o `.env` local usa por enquanto a conta demo pública `customer2`, que é compartilhada. Trocar antes da E7, quando os testes começarem a mexer em carrinho e pedidos.
- **E4:** credenciais nos GitHub Secrets, smoke no PR e só chromium no workflow (hoje o [playwright.yml](../.github/workflows/playwright.yml) ainda instala todos os navegadores).
- **E7a:** login uma vez com sessão salva (`tests/setup/auth.setup.ts`).
- **Formatação:** 6 arquivos que já estavam na `main` não passam no `prettier --check` (ex.: `playwright.yml`, `metricas-ia.md`). Corrigir num PR `fix/` separado.

Para instalar e rodar, veja a seção **Como rodar (E3)** do [README](../README.md#como-rodar-e3).
