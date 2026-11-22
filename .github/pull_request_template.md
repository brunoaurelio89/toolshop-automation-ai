<!--
Instruções para quem preenche este PR (pessoa ou IA, como o Claude):
- Preencha todas as seções. Se uma não se aplicar, escreva "Não se aplica".
- Escreva em inglês, de forma objetiva.
- Título do PR no padrão Conventional Commits: tipo: descrição (ex.: test: adiciona cenários de CVV no checkout).
- Nunca inclua senhas, tokens, e-mails reais ou dados reais de cartão.
- A seção "Uso de IA" é obrigatória: ela alimenta o arquivo docs/metricas-ia.md.
-->

## Resumo

<!-- O que muda e por quê, em 1 a 3 linhas. -->

## Etapa do cronograma

<!-- Ex.: E3 – Instalar o Playwright · E7b – Pagamentos · Extra – Allure -->

## Tipo de mudança

- [ ] `feat` – estrutura nova (page object, fixture, componente, utilitário)
- [ ] `test` – testes novos ou alterados
- [ ] `fix` – correção de teste ou código
- [ ] `refactor` – melhoria sem mudar comportamento
- [ ] `ci` – pipeline e relatórios
- [ ] `docs` – documentação

## O que foi feito

<!-- Lista dos arquivos ou partes principais alterados. -->

-
-

## Cobertura de testes

<!-- Preencher quando o PR adiciona ou altera testes. -->

| Funcionalidade               | Técnica de teste           | Casos adicionados | Risco coberto (plano de testes) |
| ---------------------------- | -------------------------- | ----------------- | ------------------------------- |
| <!-- Ex.: Checkout – CVV --> | <!-- Ex.: Valor-limite --> | <!-- Ex.: 4 -->   | <!-- Ex.: R1 -->                |

## Como testar

<!-- Comandos e passos para validar localmente. -->

```bash
npx playwright test caminho/do/teste
```

## Evidências

<!-- Resultado da execução local, prints ou link do relatório do CI. -->

## Uso de IA

<!-- Obrigatório. Se não usou IA neste PR, marque "Não usei IA" e pule o resto da seção. -->

- [ ] Não usei IA neste PR

**Ferramenta:** <!-- Ex.: Claude (gratuito), Claude Code, codegen + Claude -->

**O que a IA gerou:**
<!-- Ex.: rascunho do CheckoutPage a partir do codegen; 8 casos de teste a partir do Gherkin. -->

| Casos/trechos gerados | Usados sem mudança | Corrigidos | Descartados |
| --------------------- | ------------------ | ---------- | ----------- |
|                       |                    |            |             |

**Principais erros da IA e como foram corrigidos:**
<!-- Ex.: usou seletor CSS por classe → trocado por getByTestId; esqueceu o limite de 4 dígitos do CVV → caso adicionado. -->

-

## Issues relacionadas

<!-- Ex.: Closes #12 (fecha a issue ao fazer o merge) · Relacionado a #8 -->

## Checklist

- [ ] Título e commits no padrão Conventional Commits
- [ ] Branch no padrão `tipo/etapa-descricao`
- [ ] Testes passando localmente (`npm test` ou `npm run test:smoke`)
- [ ] Lint e formatação sem erros (`npm run lint` e `npm run format`)
- [ ] Segue as regras da arquitetura (teste sem seletor; Page Object sem asserção)
- [ ] Nenhum `waitForTimeout` no código
- [ ] Sem dados sensíveis (senhas, tokens, e-mails reais, dados reais de cartão)
- [ ] `docs/metricas-ia.md` atualizado (se usou IA)
- [ ] README atualizado, se necessário
