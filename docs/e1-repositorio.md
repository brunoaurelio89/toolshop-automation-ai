# E1 – Repositório e fluxo de trabalho

Como o repositório está organizado e quais regras toda mudança segue até chegar na `main`.

## Repositório

- Público no GitHub, com `main` como branch padrão.
- `.gitattributes` força final de linha LF em qualquer sistema operacional (o Prettier espera `lf`).
- ESLint e Prettier configurados (`npm run lint` e `npm run format`). Detalhes em [Instalacoes.md](Instalacoes.md).
- Primeiro workflow de CI em [.github/workflows/playwright.yml](../.github/workflows/playwright.yml). O pipeline completo fica para o E4.

## Estratégia de branches

O projeto segue o **GitHub Flow**:

1. Crie uma branch a partir da `main`.
2. Faça os commits.
3. Abra um Pull Request usando o modelo do projeto.
4. Faça o merge com **squash**: cada PR vira um único commit na `main`.

**Nome da branch:** `tipo/etapa-descricao` (ex.: `feat/e3-setup-playwright`). Quando a mudança não for de uma etapa específica, use a branch geral do tipo, que já existe (ex.: `docs/general`).

| Tipo        | Uso                              |
| ----------- | -------------------------------- |
| `feat/`     | Estrutura e configuração         |
| `test/`     | Novos testes                     |
| `fix/`      | Correção de teste ou código      |
| `refactor/` | Melhoria sem mudar comportamento |
| `ci/`       | Pipeline e relatórios            |
| `docs/`     | Documentação                     |

**Commits e títulos de PR:** [Conventional Commits](https://www.conventionalcommits.org/pt-br/), com o tipo e a descrição em inglês (ex.: `test: add scenarios CVV`).

## Regras aplicadas no GitHub

| Regra                               | Configuração                 |
| ----------------------------------- | ---------------------------- |
| Merge na `main` só por Pull Request | Proteção de branch na `main` |
| Push forçado e exclusão da `main`   | Bloqueados                   |
| Forma de merge                      | Somente squash merge         |
| Branch do PR depois do merge        | Apagada automaticamente      |

## Modelos

- **Pull Request:** [pull_request_template.md](../.github/pull_request_template.md). Inclui a seção obrigatória **"Uso de IA"**, que registra o que a IA gerou, o que foi usado, corrigido ou descartado, e alimenta o [metricas-ia.md](metricas-ia.md). O checklist é agrupado por tipo de mudança.
- **Bug report:** [bug_report.yml](../.github/ISSUE_TEMPLATE/bug_report.yml). Registra o ambiente (normal, with-bugs ou local), a funcionalidade, a forma de pagamento, os passos e esperado x obtido. Separa **severidade** (impacto) de **prioridade** (urgência) e registra a origem do defeito, incluindo "caso de teste sugerido por IA".

## Histórico

- Os PRs #1 a #5 entraram com merge commit, antes das regras acima serem aplicadas no GitHub. A partir do #6, os merges são feitos com squash.
- Os PRs #2 e #3 têm títulos fora do padrão Conventional Commits (`Feat/install`, `Docs/readme`). Eles ficaram como estão e servem de registro.
