# Toolshop Automation AI

Automação de testes E2E da loja [Toolshop](https://practicesoftwaretesting.com) com **Playwright + TypeScript**, usando **IA generativa** para apoiar o design dos cenários e o código dos testes, sempre com revisão humana.

O foco é o **domínio de pagamento**: carrinho, checkout e as 5 formas de pagamento da loja, testados com técnicas do ISTQB CTFL (partição de equivalência, valor-limite, tabela de decisão e transição de estados).

> **Sobre a aplicação testada:** o Toolshop é um projeto da [Testsmith](https://github.com/testsmith-io/practice-software-testing) criado para praticar testes de software. O código da aplicação **não faz parte** deste repositório. Aqui estão apenas os meus testes, documentação e análises.

## Objetivos

- Construir uma suíte de testes automatizados com arquitetura em camadas, CI/CD e relatórios.
- Medir na prática **onde a IA acerta e onde erra** ao gerar casos e código de teste.
- Rodar a mesma suíte na versão normal e na [versão com bugs propositais](https://with-bugs.practicesoftwaretesting.com) do Toolshop e comparar os resultados.

## Roteiro

| Etapa | Descrição                                        | Status |
| ----- | ------------------------------------------------ | ------ |
| E0    | [Exploração da aplicação](docs/e0-exploracao.md) | ✅     |
| E1    | Repositório e fluxo de trabalho                  | ⏳     |
| E2    | Arquitetura                                      | ⏳     |
| E3    | Instalação do Playwright e primeiro teste        | ⏳     |
| E4    | CI/CD com GitHub Actions + relatório Allure      | ⏳     |
| E5    | Cenários de teste com IA                         | ⏳     |
| E6    | Plano de testes                                  | ⏳     |
| E7    | Automação: login, catálogo, carrinho e checkout  | ⏳     |
| E8    | Execução: versão normal x versão com bugs        | ⏳     |
| E9    | Métricas e resultados                            | ⏳     |

## Fluxo de trabalho

O projeto segue o **GitHub Flow**: a `main` é protegida e toda mudança entra por Pull Request, com squash merge.

```mermaid
gitGraph
  commit id: "docs: README inicial"
  branch feature/e3-setup-playwright
  commit id: "feat: instala playwright"
  commit id: "test: smoke de login"
  checkout main
  merge feature/e3-setup-playwright id: "squash"
```

**Branches:** `tipo/etapa-descricao`

| Tipo    | Uso                      | Exemplo                       |
| ------- | ------------------------ | ----------------------------- |
| `feat/` | Estrutura e configuração | `feature/e3-setup-playwright` |
| `test/` | Novos testes             | `test/e7b-checkout-cartao`    |
| `fix/`  | Correção de teste        | `fix/login-seletor-instavel`  |
| `ci/`   | Pipeline e relatórios    | `ci/e4-github-actions`        |
| `docs/` | Documentação             | `docs/e6-plano-de-testes`     |

**Commits:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/), com o tipo e a descrição em inglês. Exemplos: `feat: create page object for checkout`, `test: add scenarios CVV`, `ci: run smoke tests all PR`.

**Pull Requests:** todo PR usa o [modelo do projeto](.github\pull_request_template.md), que inclui a seção **"Uso de IA"**: o que foi gerado por IA e o que foi revisado ou corrigido.

**Defeitos:** registrados como [issues](.github\issue_template\bug_report.yml) com o modelo de bug report, separando **severidade** (impacto) de **prioridade** (urgência).

## Autor

Bruno Aurelio, Analista de Automação - QA - Testes · [LinkedIn](https://www.linkedin.com/in/brunoaurelio)
