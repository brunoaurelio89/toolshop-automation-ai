# E5 – Casos de teste

Modo: **Completo**. O domínio é financeiro (pagamento), tem faixas numéricas, combinações de condições e um wizard com estados.

## 1. Resumo da base de teste

- **Base de teste:** seção 2 de [`e0-exploracao.md`](e0-exploracao.md) (RN01–RN26), observada no Toolshop v5.0 em 22/11/2026. Não existe User Story formal: as regras foram inferidas da aplicação, então o oráculo é o comportamento e as mensagens observados.
- **Ator:** visitante anônimo, cliente logado ou convidado (guest).
- **Áreas:** Login (RN01–02), Registro (RN03–06), Contato (RN07–08), Produto (RN09–11), Carrinho (RN12–13), Checkout (RN14–16), Pagamento (RN17–25), Catálogo (RN26).
- **"A confirmar":** marca resultados esperados que o E0 não observou. Eles viram regra ou bug depois da primeira execução.

### Pré-condições comuns

| ID   | Pré-condição                                                                                                                                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| PC-1 | Navegador sem sessão (anônimo), na página indicada.                                                                                                                                  |
| PC-2 | Usuário de teste **próprio** cadastrado e logado. Não usar a conta demo compartilhada para pedidos.                                                                                  |
| PC-3 | PC-2 + carrinho com 1 un. de "Combination Pliers" ($14.15) + checkout avançado até o passo 4 (Payment) com endereço válido (ex.: Netherlands, 1234AB, 1, Teststraat, Amsterdam, NH). |

## 2. Técnicas e itens de cobertura

| Técnica                                  | Por que foi usada                                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Partição de equivalência (EP)            | Campos obrigatórios, formatos e listas de opções: login, registro, contato, métodos de pagamento, parcelas.    |
| Análise de valor-limite (BVA), 2 valores | Tamanhos e faixas: senha, mensagem, quantidade, CVV, vale-presente, validade do cartão.                        |
| Tabela de decisão                        | A combinação "método × campos válidos" decide se o pagamento é liberado; quantidade × produtos decide o total. |
| Transição de estado                      | O wizard do checkout e o favoritar dependem do estado (anônimo/logado, passo atual).                           |
| Suposição de erro                        | Complemento obrigatório. Cobre os pontos a confirmar do E0 e entradas atípicas.                                |

### Partição de equivalência (P)

| ID   | Elemento                      | Válida                    | Inválida                                           |
| ---- | ----------------------------- | ------------------------- | -------------------------------------------------- |
| P-01 | Login: campos                 | email e senha preenchidos | email vazio; senha vazia                           |
| P-02 | Login: credencial             | cadastrada                | email não cadastrado; senha errada                 |
| P-03 | Registro: campos obrigatórios | todos preenchidos         | cada um dos 12 vazio                               |
| P-04 | Registro: data de nascimento  | YYYY-MM-DD                | outro formato (DD/MM/YYYY)                         |
| P-05 | Registro: email               | formato válido            | sem @ ou domínio                                   |
| P-06 | Registro: senha               | ≥ 6 caracteres permitidos | < 6; caractere inválido (conjunto não documentado) |
| P-07 | Contato: campos               | todos preenchidos         | cada um dos 5 vazio                                |
| P-08 | Produto: estoque              | em estoque                | sem estoque                                        |
| P-09 | Checkout passo 2              | login; guest              | nenhum dos dois; guest com dado inválido           |
| P-10 | Billing: campos               | todos preenchidos         | cada um dos 6 vazio                                |
| P-11 | Forma de pagamento            | 5 métodos                 | nenhum                                             |
| P-12 | Bank name                     | letras e espaços          | com dígito                                         |
| P-13 | Número do cartão              | 9999-9999-9999-9999       | formato errado ("1")                               |
| P-14 | Validade                      | MM/YYYY                   | outro formato ("1")                                |
| P-15 | Parcelas BNPL                 | 3, 6, 9, 12               | nenhuma                                            |
| P-16 | Busca                         | termo com resultado       | termo sem resultado                                |

### Valor-limite (B), 2 valores

| ID    | Regra                      | Valores                                                   |
| ----- | -------------------------- | --------------------------------------------------------- |
| B-06  | Senha ≥ 6                  | 5 ✗ / 6 ✓                                                 |
| B-08  | Mensagem ≥ 50              | 49 ✗ / 50 ✓                                               |
| B-09  | Quantidade 1–99            | 0 ✗ / 1 ✓ / 99 ✓ / 100 ✗                                  |
| B-21  | Validade no futuro         | mês anterior ✗ / mês atual (a confirmar) / mês seguinte ✓ |
| B-22  | CVV 3–4 dígitos            | 2 ✗ / 3 ✓ / 4 ✓ / 5 ✗                                     |
| B-24a | Vale-presente: número = 16 | 15 ✗ / 16 ✓ / 17 ✗                                        |
| B-24b | Vale-presente: código = 4  | 3 ✗ / 4 ✓ / 5 ✗                                           |

### Tabela de decisão – liberação do pagamento (RN17)

| Condição / Ação               | R1  | R2                   | R3             | R4             |
| ----------------------------- | --- | -------------------- | -------------- | -------------- |
| C1 Método selecionado         | N   | S (Cash on Delivery) | S (com campos) | S (com campos) |
| C2 Campos do método válidos   | –   | – (não tem campos)   | N              | S              |
| A1 "Check payment" habilitado | N   | S                    | N              | S              |
| A2 "Payment was successful"   | N   | S                    | N              | S              |

### Tabela de decisão – total do carrinho (RN13)

| Condição / Ação                 | R1  | R2  | R3  |
| ------------------------------- | --- | --- | --- |
| C1 Itens distintos              | 1   | 1   | 2   |
| C2 Quantidade de algum item > 1 | N   | S   | N   |
| A1 Linha = qtd × unitário       | S   | S   | S   |
| A2 Total = soma das linhas      | S   | S   | S   |

### Transição de estado – checkout (RN14)

Estados: S0 Cart · S1 Sign in · S2 Billing · S3 Payment · S4 Pagamento validado · S5 Pedido confirmado.

| ID   | De → Para | Evento                                 | Válida? |
| ---- | --------- | -------------------------------------- | ------- |
| T-01 | S0 → S1   | `proceed-1` com item no carrinho       | ✓       |
| T-02 | S1 → S2   | `proceed-2` após login ou guest        | ✓       |
| T-03 | S2 → S3   | `proceed-3` com endereço completo      | ✓       |
| T-04 | S3 → S4   | `finish` com pagamento válido          | ✓       |
| T-05 | S4 → S5   | confirmar pedido (oráculo a confirmar) | ✓       |
| T-06 | S1 → S2   | sem login nem guest                    | ✗       |
| T-07 | S2 → S3   | endereço incompleto                    | ✗       |
| T-08 | S3 → S4   | pagamento inválido                     | ✗       |

### Transição de estado – favoritar (RN11)

| ID   | Estado  | Evento            | Resultado                           | Válida? |
| ---- | ------- | ----------------- | ----------------------------------- | ------- |
| T-09 | Anônimo | Add to favourites | toast "Unauthorized...", nada salvo | ✗       |
| T-10 | Logado  | Add to favourites | produto em My favorites             | ✓       |

### Cobertura planejada

| Técnica             | Itens                                       | Cobertura                                           |
| ------------------- | ------------------------------------------- | --------------------------------------------------- |
| EP                  | 16 elementos, partições válidas e inválidas | 100%                                                |
| BVA                 | 21 valores                                  | 100% (mês atual da validade sem resultado esperado) |
| Tabela de decisão   | 7 colunas viáveis                           | 100%                                                |
| Transição de estado | 6 válidas + 4 inválidas                     | 100%                                                |

## 3. Casos de teste

Cada linha é um caso, com passos numerados e o resultado esperado de cada passo. **Variações** são execuções separadas do mesmo caso, com uma partição inválida por vez (ex.: CT-07a, CT-07b...).

Legenda: **Pos** positivo · **Neg** negativo · **Alt** alternativo · **Risco** risco sugerido (vai além da regra observada). **P** = prioridade, de 1 (crítica) a 4 (baixa).

### RN01 / RN02 – Login (PC-1 em `/auth/login`)

| ID    | Técnica (item)              | Tipo | P   | Dados                           | Ação                                                          | Resultado esperado                                           |
| ----- | --------------------------- | ---- | --- | ------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| CT-01 | EP (P-01, P-02 válidas)     | Pos  | 1   | usuário PC-2                    | 1. Preencher email e senha. 2. Clicar Login.                  | 2. Redireciona para `/account` com o título "My account".    |
| CT-02 | EP (P-01 email vazio)       | Neg  | 2   | senha válida                    | 1. Deixar o email vazio e preencher a senha. 2. Clicar Login. | 2. "Email is required"; permanece no login.                  |
| CT-03 | EP (P-01 senha vazia)       | Neg  | 2   | email válido                    | 1. Preencher o email e deixar a senha vazia. 2. Clicar Login. | 2. "Password is required".                                   |
| CT-04 | EP (P-02 senha errada)      | Neg  | 1   | email cadastrado + senha errada | 1. Preencher. 2. Clicar Login.                                | 2. "Invalid email or password", sem dizer qual campo errou.  |
| CT-05 | EP (P-02 email inexistente) | Neg  | 2   | email não cadastrado            | 1. Preencher. 2. Clicar Login.                                | 2. A mesma mensagem do CT-04 (não revela se o email existe). |

### RN03–RN06 – Registro (PC-1 em `/auth/register`)

| ID    | Técnica (item)                    | Tipo  | P   | Dados                                                                                                                  | Ação                                                              | Resultado esperado                                                         |
| ----- | --------------------------------- | ----- | --- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------- |
| CT-06 | EP (P-03 a P-06 válidas)          | Pos   | 1   | dados válidos, email único, senha com 6+ caracteres                                                                    | 1. Preencher todos os campos. 2. Clicar Register.                 | 2. Cadastro concluído (tela seguinte a confirmar).                         |
| CT-07 | EP (P-03, um campo vazio por vez) | Neg   | 2   | **Variações a–l:** nome, sobrenome, data de nascimento, país, CEP, número, rua, cidade, estado, telefone, email, senha | 1. Preencher todos menos o campo da variação. 2. Clicar Register. | 2. Só o `<campo>-error` daquele campo aparece (ex.: "City is required").   |
| CT-08 | EP (P-04 formato)                 | Neg   | 2   | data de nascimento `15/01/1990`                                                                                        | 1. Preencher válido com essa data. 2. Clicar Register.            | 2. "Please enter a valid date in YYYY-MM-DD format."                       |
| CT-09 | EP (P-05)                         | Neg   | 2   | email `abc`                                                                                                            | 1. Preencher válido com esse email. 2. Clicar Register.           | 2. "Email format is invalid".                                              |
| CT-10 | BVA (B-06 = 5)                    | Neg   | 2   | senha com 5 caracteres                                                                                                 | 1. Preencher válido. 2. Clicar Register.                          | 2. "Password must be minimal 6 characters long."                           |
| CT-11 | BVA (B-06 = 6)                    | Pos   | 2   | senha com 6 caracteres                                                                                                 | 1. Preencher válido. 2. Clicar Register.                          | 2. Sem erro de senha; cadastro concluído.                                  |
| CT-12 | EP (P-06 caractere inválido)      | Neg   | 3   | a definir (conjunto não documentado)                                                                                   | 1. Preencher válido. 2. Clicar Register.                          | 2. "Password can not include invalid characters."                          |
| CT-13 | Suposição de erro                 | Risco | 3   | email já cadastrado                                                                                                    | 1. Registrar com um email existente.                              | 1. Mensagem amigável de duplicidade, sem erro técnico (texto a confirmar). |

### RN07 / RN08 – Contato (PC-1 em `/contact`)

| ID    | Técnica (item)              | Tipo  | P   | Dados                                                        | Ação                                                    | Resultado esperado                                                  |
| ----- | --------------------------- | ----- | --- | ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------- |
| CT-14 | EP (P-07) + BVA (B-08 = 50) | Pos   | 3   | mensagem com exatamente 50 caracteres                        | 1. Preencher tudo. 2. Clicar Send.                      | 2. Mensagem enviada com confirmação (texto a confirmar).            |
| CT-15 | EP (P-07, um vazio por vez) | Neg   | 3   | **Variações a–e:** nome, sobrenome, email, assunto, mensagem | 1. Preencher todos menos o da variação. 2. Clicar Send. | 2. Só o `<campo>-error` daquele campo (ex.: "Subject is required"). |
| CT-16 | BVA (B-08 = 49)             | Neg   | 3   | mensagem com 49 caracteres                                   | 1. Preencher tudo. 2. Clicar Send.                      | 2. "Message must be minimal 50 characters".                         |
| CT-17 | Suposição de erro           | Risco | 4   | 49 caracteres + 1 espaço no fim                              | 1. Enviar.                                              | 1. Verificar se espaços contam para o mínimo (a confirmar).         |

### RN09 – Quantidade no produto (PC-1 em `/product/<Combination Pliers>`)

| ID    | Técnica (item)   | Tipo | P   | Dados                | Ação                                  | Resultado esperado                                                                                                           |
| ----- | ---------------- | ---- | --- | -------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| CT-18 | BVA (B-09 = 1)   | Neg  | 2   | quantidade inicial 1 | 1. Clicar −.                          | 1. A quantidade continua 1.                                                                                                  |
| CT-19 | BVA (B-09 = 0)   | Neg  | 2   | digitar `0`          | 1. Digitar 0. 2. Clicar Add to cart.  | 2. Não adiciona 0 unidades (comportamento exato a confirmar; o input tem `min=1`).                                           |
| CT-20 | BVA (B-09 = 99)  | Pos  | 2   | digitar `99`         | 1. Digitar 99. 2. Clicar Add to cart. | 2. Toast "Product added to shopping cart."; badge mostra 99.                                                                 |
| CT-21 | BVA (B-09 = 100) | Neg  | 2   | digitar `100`        | 1. Digitar 100. 2. Sair do campo.     | 2. Valor ajustado para 99 e/ou toast "You can order at most 99 of this product." (observado com 1000; com 100 é inferência). |

### RN10 / RN11 – Estoque e favoritos

| ID    | Técnica (item)     | Tipo | P   | Pré-condição                                   | Ação                                                | Resultado esperado                                                               |
| ----- | ------------------ | ---- | --- | ---------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------- |
| CT-22 | EP (P-08 inválida) | Neg  | 2   | PC-1, produto "Long Nose Pliers" (sem estoque) | 1. Abrir o produto.                                 | 1. "Out of stock" visível e Add to cart desabilitado.                            |
| CT-23 | Transição (T-09)   | Neg  | 2   | PC-1, qualquer produto                         | 1. Clicar Add to favourites.                        | 1. Toast "Unauthorized, can not add product to your favorite list."; nada salvo. |
| CT-24 | Transição (T-10)   | Pos  | 3   | PC-2, produto fora dos favoritos               | 1. Clicar Add to favourites. 2. Abrir My favorites. | 2. O produto aparece na lista (feedback do passo 1 a confirmar).                 |

### RN12 / RN13 – Carrinho

| ID    | Técnica (item)     | Tipo  | P   | Pré-condição / Dados                                      | Ação                                                            | Resultado esperado                                                                     |
| ----- | ------------------ | ----- | --- | --------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| CT-25 | Suposição de erro  | Risco | 2   | carrinho com 1 item                                       | 1. Em `/checkout`, mudar a quantidade para 0. 2. Sair do campo. | 2. Item removido ou erro amigável; total nunca negativo nem NaN (a confirmar).         |
| CT-26 | EP + DT (R1)       | Pos   | 1   | carrinho vazio; Combination Pliers qtd 1                  | 1. Adicionar ao carrinho. 2. Abrir `/checkout`.                 | 1. Toast "Product added to shopping cart."; badge = 1. 2. Linha $14.15 e total $14.15. |
| CT-27 | DT (R2)            | Pos   | 1   | Combination Pliers qtd 2                                  | 1. Adicionar. 2. Abrir `/checkout`.                             | 2. Linha $28.30 e total $28.30.                                                        |
| CT-28 | DT (R3)            | Pos   | 1   | Combination Pliers ($14.15) + Pliers ($12.01), qtd 1 cada | 1. Adicionar os dois. 2. Abrir `/checkout`.                     | 2. Linhas $14.15 e $12.01; total $26.16.                                               |
| CT-29 | DT (R2, alteração) | Alt   | 2   | carrinho do CT-26                                         | 1. Alterar a quantidade para 3 no carrinho.                     | 1. Linha e total recalculados para $42.45.                                             |

### RN14–RN16 – Checkout

| ID    | Técnica (item)                                 | Tipo  | P   | Pré-condição / Dados                                                     | Ação                                                                                                                                             | Resultado esperado                                                                         |
| ----- | ---------------------------------------------- | ----- | --- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| CT-30 | Transição (T-01 a T-04)                        | Pos   | 1   | PC-2 + 1 item                                                            | 1. Clicar `proceed-1`. 2. Clicar `proceed-2`. 3. Preencher o endereço e clicar `proceed-3`. 4. Escolher Cash on Delivery e clicar Check payment. | 1. Passo SIGN IN. 2. Passo BILLING ADDRESS. 3. Passo PAYMENT. 4. "Payment was successful". |
| CT-31 | Transição (T-05)                               | Pos   | 1   | estado após o CT-30                                                      | 1. Confirmar o pedido.                                                                                                                           | 1. Pedido confirmado e fatura em My invoices (a confirmar).                                |
| CT-32 | Transição (T-06)                               | Neg   | 1   | PC-1 + 1 item, no passo 2                                                | 1. Tentar avançar sem login nem guest.                                                                                                           | 1. Não há como ir ao Billing (`proceed-2` só aparece após autenticar).                     |
| CT-33 | Transição (T-07) + EP (P-10, um vazio por vez) | Neg   | 1   | PC-2, passo 3. **Variações a–f:** país, CEP, número, rua, cidade, estado | 1. Preencher todos menos o da variação.                                                                                                          | 1. `proceed-3` permanece desabilitado.                                                     |
| CT-34 | EP (P-10 válida)                               | Pos   | 1   | PC-2, passo 3 com endereço pré-preenchido parcial                        | 1. Completar os campos que faltam.                                                                                                               | 1. `proceed-3` habilita.                                                                   |
| CT-35 | EP (P-09 guest)                                | Alt   | 1   | PC-1 + 1 item, passo 2                                                   | 1. Abrir a aba "Continue as Guest". 2. Preencher email, nome e sobrenome. 3. Clicar Continue as Guest.                                           | 3. Avança para o Billing.                                                                  |
| CT-36 | EP (P-09 guest com email inválido)             | Neg   | 2   | como no CT-35, email `abc`                                               | 1–3 iguais ao CT-35.                                                                                                                             | 3. Não avança; mensagem de validação (texto a confirmar).                                  |
| CT-37 | EP (P-09 guest com campo vazio)                | Neg   | 2   | **Variações a–c:** email, nome, sobrenome                                | 1–3 iguais ao CT-35.                                                                                                                             | 3. Não avança (mensagem a confirmar).                                                      |
| CT-38 | Suposição de erro                              | Risco | 2   | passo 3 preenchido                                                       | 1. Recarregar a página (F5).                                                                                                                     | 1. Carrinho preservado; o wizard volta a um passo coerente, sem erro técnico.              |

### RN17–RN25 – Pagamento (PC-3)

| ID    | Técnica (item)                                     | Tipo  | P   | Dados                                                                                | Ação                                                                          | Resultado esperado                                                            |
| ----- | -------------------------------------------------- | ----- | --- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| CT-39 | DT (R1)                                            | Neg   | 1   | nenhum método                                                                        | 1. Observar o botão.                                                          | 1. Check payment desabilitado.                                                |
| CT-40 | DT (R4) + EP (P-13, P-14 válidas) + BVA (B-22 = 3) | Pos   | 1   | Credit Card: `1111-1111-1111-1111`, mês seguinte/ano, CVV `123`, titular `Test User` | 1. Selecionar Credit Card e preencher. 2. Clicar Check payment.               | 2. "Payment was successful".                                                  |
| CT-41 | EP (P-13)                                          | Neg   | 1   | número `1`                                                                           | 1. Preencher o resto válido. 2. Sair do campo.                                | 2. "Invalid card number format."                                              |
| CT-42 | Suposição de erro                                  | Risco | 2   | número `1111111111111111` (sem hífen)                                                | 1. Preencher o resto válido.                                                  | 1. Aceito ou erro de formato: registrar o comportamento.                      |
| CT-43 | EP (P-14)                                          | Neg   | 1   | validade `1`                                                                         | 1. Preencher. 2. Sair do campo.                                               | 2. "Invalid date format. Use MM/YYYY."                                        |
| CT-44 | BVA (B-21 mês anterior)                            | Neg   | 1   | mês anterior ao atual                                                                | 1. Preencher. 2. Sair do campo.                                               | 2. "Expiration date must be in the future."                                   |
| CT-45 | BVA (B-21 mês atual)                               | Risco | 1   | mês e ano atuais                                                                     | 1. Preencher. 2. Sair do campo.                                               | 2. A confirmar: registrar se o mês atual é aceito.                            |
| CT-46 | BVA (B-21 mês seguinte)                            | Pos   | 1   | mês seguinte                                                                         | 1. Preencher.                                                                 | 1. Sem erro de validade.                                                      |
| CT-47 | BVA (B-22 = 2)                                     | Neg   | 1   | CVV `12`                                                                             | 1. Preencher. 2. Sair do campo.                                               | 2. "CVV must be 3 or 4 digits."                                               |
| CT-48 | BVA (B-22 = 4)                                     | Pos   | 1   | CVV `1234`                                                                           | 1. Preencher.                                                                 | 1. Sem erro de CVV.                                                           |
| CT-49 | BVA (B-22 = 5)                                     | Neg   | 1   | CVV `12345`                                                                          | 1. Preencher. 2. Sair do campo.                                               | 2. "CVV must be 3 or 4 digits."                                               |
| CT-50 | Suposição de erro                                  | Risco | 2   | titular `Jo1`                                                                        | 1. Preencher o resto válido. 2. Clicar Check payment.                         | 2. Ponto a confirmar do E0: registrar se é aceito.                            |
| CT-51 | DT (R3)                                            | Neg   | 1   | Credit Card com CVV inválido, resto válido                                           | 1. Preencher.                                                                 | 1. Check payment não conclui o pagamento.                                     |
| CT-52 | Suposição de erro                                  | Risco | 1   | trocar Bank Transfer → Credit Card sem preencher                                     | 1. Selecionar Bank Transfer. 2. Trocar para Credit Card. 3. Observar o botão. | 3. Esperado pela RN17: desabilitado. Observado no E0: habilitado uma vez.     |
| CT-53 | DT (R4) + EP (P-12 válida)                         | Pos   | 1   | Bank Transfer: `Test Bank`, `Test User`, `12345678`                                  | 1. Preencher. 2. Clicar Check payment.                                        | 2. "Payment was successful".                                                  |
| CT-54 | EP (P-12 inválida)                                 | Neg   | 1   | bank name `Bank1`                                                                    | 1. Preencher o resto válido. 2. Sair do campo.                                | 2. "Bank name can only contain letters and spaces."                           |
| CT-55 | EP (campo obrigatório)                             | Neg   | 2   | **Variações a–c:** bank name, account name, account number vazios                    | 1. Preencher os outros.                                                       | 1. Check payment desabilitado.                                                |
| CT-56 | DT (R2)                                            | Pos   | 1   | Cash on Delivery                                                                     | 1. Selecionar. 2. Clicar Check payment.                                       | 1. Botão habilitado, sem campos extras. 2. "Payment was successful".          |
| CT-57 | EP (P-15 válidas)                                  | Pos   | 1   | **Variações a–d:** 3, 6, 9, 12 parcelas                                              | 1. Selecionar Buy Now Pay Later e as parcelas. 2. Clicar Check payment.       | 2. "Payment was successful" (observado com 3 parcelas).                       |
| CT-58 | EP (P-15 inválida)                                 | Neg   | 1   | BNPL sem parcela                                                                     | 1. Selecionar BNPL.                                                           | 1. Check payment desabilitado.                                                |
| CT-59 | DT (R4) + BVA (B-24a = 16, B-24b = 4)              | Pos   | 1   | Gift Card: `ABCD1234EFGH5678`, código `1234`                                         | 1. Preencher. 2. Clicar Check payment.                                        | 2. "Payment was successful" (a confirmar: o E0 só viu o botão habilitado).    |
| CT-60 | BVA (B-24a = 15)                                   | Neg   | 1   | número com 15 caracteres                                                             | 1. Preencher. 2. Sair do campo.                                               | 2. "Please enter a valid gift card number: exactly 16 letters and/or digits." |
| CT-61 | BVA (B-24a = 17)                                   | Neg   | 1   | número com 17 caracteres                                                             | 1. Preencher. 2. Sair do campo.                                               | 2. A mesma mensagem do CT-60.                                                 |
| CT-62 | BVA (B-24b = 3)                                    | Neg   | 1   | código `123`                                                                         | 1. Preencher. 2. Sair do campo.                                               | 2. "Please enter a valid validation code: exactly 4 letters and/or digits."   |
| CT-63 | BVA (B-24b = 5)                                    | Neg   | 1   | código `12345`                                                                       | 1. Preencher. 2. Sair do campo.                                               | 2. A mesma mensagem do CT-62.                                                 |
| CT-64 | Suposição de erro                                  | Risco | 1   | pagamento válido (como no CT-56)                                                     | 1. Clicar duas vezes rápido em Check payment e na confirmação.                | 1. Um único pedido gerado, sem cobrança duplicada.                            |

### RN26 – Busca (PC-1 em `/`)

| ID    | Técnica (item)     | Tipo  | P   | Dados                      | Ação                  | Resultado esperado                                                              |
| ----- | ------------------ | ----- | --- | -------------------------- | --------------------- | ------------------------------------------------------------------------------- |
| CT-65 | EP (P-16 válida)   | Pos   | 3   | `plier`                    | 1. Buscar.            | 1. 4 produtos: Combination Pliers, Pliers, Long Nose Pliers, Slip Joint Pliers. |
| CT-66 | EP (P-16 inválida) | Neg   | 3   | `zzzzz`                    | 1. Buscar.            | 1. "0 products found for 'zzzzz'" e "There are no products found."              |
| CT-67 | Suposição de erro  | Risco | 3   | `' OR 1=1 --` e `<script>` | 1. Buscar cada termo. | 1. Tratados como texto; sem erro técnico nem script executado.                  |

## 4. Resumo de cobertura

| RN   | Casos                                    | Pos | Neg | Risco |
| ---- | ---------------------------------------- | --- | --- | ----- |
| RN01 | CT-01 a CT-03                            | 1   | 2   | 0     |
| RN02 | CT-04, CT-05                             | 0   | 2   | 0     |
| RN03 | CT-06, CT-07a–l, CT-13                   | 1   | 12  | 1     |
| RN04 | CT-06, CT-08                             | 1   | 1   | 0     |
| RN05 | CT-09                                    | 0   | 1   | 0     |
| RN06 | CT-10 a CT-12                            | 1   | 2   | 0     |
| RN07 | CT-14, CT-15a–e                          | 1   | 5   | 0     |
| RN08 | CT-14, CT-16, CT-17                      | 1   | 1   | 1     |
| RN09 | CT-18 a CT-21                            | 1   | 3   | 0     |
| RN10 | CT-22                                    | 0   | 1   | 0     |
| RN11 | CT-23, CT-24                             | 1   | 1   | 0     |
| RN12 | CT-26                                    | 1   | 0   | 0     |
| RN13 | CT-25 a CT-29                            | 4   | 0   | 1     |
| RN14 | CT-30 a CT-32, CT-38                     | 2   | 1   | 1     |
| RN15 | CT-35 a CT-37                            | 1   | 4   | 0     |
| RN16 | CT-33a–f, CT-34                          | 1   | 6   | 0     |
| RN17 | CT-39, CT-51, CT-52                      | 0   | 2   | 1     |
| RN18 | CT-53 a CT-55                            | 1   | 4   | 0     |
| RN19 | CT-56                                    | 1   | 0   | 0     |
| RN20 | CT-40 a CT-42                            | 1   | 1   | 1     |
| RN21 | CT-43 a CT-46                            | 1   | 2   | 1     |
| RN22 | CT-47 a CT-49                            | 1   | 2   | 0     |
| RN23 | CT-57a–d, CT-58                          | 4   | 1   | 0     |
| RN24 | CT-59 a CT-63                            | 1   | 4   | 0     |
| RN25 | CT-40, CT-53, CT-56, CT-57, CT-59, CT-64 | 5   | 0   | 1     |
| RN26 | CT-65 a CT-67                            | 1   | 1   | 1     |

**Total:** 67 casos-base (CT-01 a CT-67), 94 execuções contando as variações. Toda RN tem pelo menos um caso, e toda RN com regra de rejeição tem caso negativo.
