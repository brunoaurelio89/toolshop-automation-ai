# Métricas de uso de IA

Registro de **quanto a IA acerta e onde ela erra** ao gerar casos de teste e código neste projeto. Cada PR que usa IA ganha uma linha na tabela de registro. Os números são copiados da seção **"Uso de IA"** do PR.

Estes dados alimentam a etapa **E9 – Métricas e resultados** e a seção de resultados do README.

## Como preencher

1. Ao abrir um PR que usou IA, preencha a seção "Uso de IA" do modelo de PR.
2. Logo depois do merge, copie os números para uma nova linha da tabela de registro.
3. Classifique cada erro da IA com um dos **códigos de erro** abaixo, para que os erros possam ser contados no fim do projeto.

**Definições:**

| Coluna | O que contar |
|---|---|
| Gerados | Casos de teste ou trechos de código entregues pela IA |
| Sem mudança | Usados exatamente como a IA gerou |
| Corrigidos | Usados depois de alguma correção sua |
| Descartados | Não usados |

A soma de **Sem mudança + Corrigidos + Descartados** deve ser igual a **Gerados**.

## Códigos de erro da IA

| Código | Erro | Exemplo |
|---|---|---|
| SEL | Seletor frágil | CSS por classe ou posição na lista, em vez de `getByRole`/`getByTestId` |
| LIM | Valor-limite esquecido | Testou CVV com 3 dígitos, mas não com 2 e 5 |
| PAR | Partição esquecida | Não testou nome com acento no titular do cartão |
| NEG | Cenário negativo faltando | Só o caminho feliz do pagamento |
| REG | Regra inventada | Assumiu uma regra de negócio que não existe na aplicação |
| ASS | Asserção fraca ou ausente | Teste sem `expect`, ou que valida só que a página abriu |
| ESP | Espera fixa | Uso de `waitForTimeout` |
| ARQ | Fora da arquitetura | Seletor dentro do teste ou asserção dentro do Page Object |
| API | Código inválido | Método ou opção que não existe no Playwright |
| OUT | Outro | Descrever na coluna de erros |

## Registro por PR

| Data | PR | Etapa | Ferramenta | Gerados | Sem mudança | Corrigidos | Descartados | Erros (códigos) | Observação |
|---|---|---|---|---|---|---|---|---|---|
| 2026-11-27 | #11 feat/e3-setup-playwright | E3 | Claude Code | 8 | 5 | 3 | 0 | OUT, OUT, OUT | Sem mudança: LoginPage, AccountPage, fixture, `env.ts`, `playwright.config.ts`. Corrigidos: 2 testes (tag `@RN02` no login válido; negativo: o plano usava a conta real com senha errada (CT-04) até 26/11 às 20h51, corrigido para e-mail inexistente antes da branch; teste ligado ao CT-05) e regra de lint (`test.skip` só com condição). Nenhum erro SEL ou ARQ |
| 2026-11-28 | #13 fix/e3-docs-review | E3 | Claude Code | 4 | 4 | 0 | 0 | — | Revisão da E3 contra o Notion: 3 correções de docs (`arquitetura.md` e `e3-setup-playwright.md`) e remoção de 2 dependências não usadas. Uma das correções foi revista depois: a nova descrição do CT-04 ignorou o histórico de versões do plano no Notion (ver `e3-setup-playwright.md`) |

## Resumo por etapa

Preencher ao concluir cada etapa. **Aproveitamento** = Sem mudança ÷ Gerados.

| Etapa | Ferramenta | Gerados | Sem mudança | Corrigidos | Descartados | Aproveitamento | Erro mais comum |
|---|---|---|---|---|---|---|---|
| E3 – Setup e smoke de login | Claude Code | 12 | 9 | 3 | 0 | 75% | OUT |
| E5 – Cenários | | | | | | | |
| E7a – Login e catálogo | | | | | | | |
| E7b – Carrinho e checkout | | | | | | | |

## Bugs encontrados com ajuda da IA

Contar as issues com **"Como foi encontrado: Caso de teste sugerido por IA"**.

| Etapa | Bugs encontrados no total | Sugeridos por IA | Issues |
|---|---|---|---|
| E8 – Execução | | | |

## Conclusões

Preencher na E9:

- Aproveitamento geral da IA:
- Erros mais frequentes:
- Comparação entre ferramentas (IA gratuita x Claude Code):
- O que a revisão humana pegou que a IA não pegou:
