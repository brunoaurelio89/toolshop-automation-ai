# E0 – Exploração da aplicação

Reconhecimento do **Toolshop v5.0** ([practicesoftwaretesting.com](https://practicesoftwaretesting.com)), feito em **22/11/2026** com navegação real (Playwright headless) e testes exploratórios com dados válidos e inválidos.

Este documento é a base para a **E5 – Cenários de teste com IA** e a **E6 – Plano de testes**.

## 1. Mapa de funcionalidades

```
Toolshop
├── Header (global)
│   ├── Home · Categories (Hand Tools, Power Tools, Other, Special Tools, Rentals) · Contact
│   ├── Sign in  →  (logado) menu do usuário: My account, favorites, profile, invoices, messages, Sign out
│   ├── Carrinho (badge com quantidade)
│   └── Idioma: DE, EL, EN, ES, FR, NL, TR
├── Catálogo (/)
│   ├── Busca por texto (+ reset) → "N products found for 'x'" / "There are no products found."
│   ├── Ordenação: nome A-Z/Z-A, preço Hi-Lo/Lo-Hi, CO₂ A-E/E-A
│   ├── Filtros: faixa de preço (slider 0–200), categorias (árvore), marcas, "eco-friendly"
│   ├── Card: nome, preço, badge CO₂ (A–E), "Out of stock", botão comparar
│   └── Paginação (9 produtos por página)
├── Produto (/product/:id)
│   ├── Nome, preço unitário, CO₂, descrição, especificações (tabela)
│   ├── Quantidade (− / input / +), Add to cart, Add to favourites, Compare
│   └── Related products
├── Rentals (/rentals) → Excavator, Bulldozer, Crane (aluguel por hora; sem seletor de quantidade)
├── Auth
│   ├── Login (/auth/login) + "Sign in with Google"
│   ├── Registro (/auth/register) com busca de endereço pelo CEP
│   └── Esqueci a senha (/auth/forgot-password)
├── Contato (/contact): nome, sobrenome, email, assunto, mensagem, anexo
├── Checkout (/checkout) – wizard de 4 passos
│   ├── 1 CART: itens, quantidade editável, preço da linha, total, Continue shopping
│   ├── 2 SIGN IN: login OU aba "Continue as Guest" (email, nome, sobrenome)
│   ├── 3 BILLING ADDRESS: país, CEP, número, rua, cidade, estado (pré-preenchido pelo perfil)
│   └── 4 PAYMENT: Bank Transfer · Cash on Delivery · Credit Card · Buy Now Pay Later · Gift Card
│        └── "Check payment" → "Payment was successful" → confirmação do pedido
└── My account (/account): favorites (remover), profile (dados, troca de senha, 2FA/TOTP), invoices (paginado), messages
```

## 2. Regras de negócio observadas

| ID   | Área                          | Regra                                                                                                                              | Evidência (mensagem ou comportamento)                                                          | Técnica sugerida                |
| ---- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------- |
| RN01 | Login                         | Email e senha obrigatórios                                                                                                         | "Email is required" / "Password is required"                                                   | Partição de equivalência        |
| RN02 | Login                         | Credencial inválida é rejeitada sem indicar qual campo está errado                                                                 | "Invalid email or password"                                                                    | Partição de equivalência        |
| RN03 | Registro                      | Todos os campos obrigatórios (nome, sobrenome, data de nascimento, país, CEP, número, rua, cidade, estado, telefone, email, senha) | `<campo>-error` em cada campo                                                                  | Partição de equivalência        |
| RN04 | Registro                      | Data de nascimento no formato YYYY-MM-DD                                                                                           | "Please enter a valid date in YYYY-MM-DD format."                                              | Partição / valor-limite         |
| RN05 | Registro                      | Email em formato válido                                                                                                            | "Email format is invalid"                                                                      | Partição de equivalência        |
| RN06 | Registro                      | Senha com no mínimo 6 caracteres e sem caracteres inválidos                                                                        | "Password must be minimal 6 characters long." / "Password can not include invalid characters." | Valor-limite (5/6)              |
| RN07 | Contato                       | Nome, sobrenome, email, assunto e mensagem obrigatórios                                                                            | `<campo>-error`                                                                                | Partição de equivalência        |
| RN08 | Contato                       | Mensagem com no mínimo 50 caracteres                                                                                               | "Message must be minimal 50 characters"                                                        | Valor-limite (49/50)            |
| RN09 | Produto                       | Quantidade entre 1 e 99 (`min=1 max=99`; o botão − não desce de 1)                                                                 | 1000 vira 99; toast "You can order at most 99 of this product."                                | Valor-limite (0/1/99/100)       |
| RN10 | Produto                       | Produto sem estoque não pode ir ao carrinho                                                                                        | `add-to-cart` desabilitado + "Out of stock"                                                    | Partição de equivalência        |
| RN11 | Produto                       | Favoritar exige login                                                                                                              | toast "Unauthorized, can not add product to your favorite list."                               | Transição de estados            |
| RN12 | Carrinho                      | Adicionar produto mostra toast e atualiza o badge                                                                                  | "Product added to shopping cart."                                                              | —                               |
| RN13 | Carrinho                      | Preço da linha = quantidade × preço unitário; total = soma das linhas                                                              | 2 × $14.15 = $28.30                                                                            | Tabela de decisão               |
| RN14 | Checkout                      | Passos em sequência: Cart → Sign in → Billing → Payment                                                                            | botões `proceed-1`, `proceed-2`, `proceed-3`                                                   | Transição de estados            |
| RN15 | Checkout                      | Passo 2 aceita login ou compra como convidado (email, nome, sobrenome)                                                             | aba "Continue as Guest"                                                                        | Partição de equivalência        |
| RN16 | Checkout                      | Billing: país, CEP, número, rua, cidade e estado obrigatórios; o endereço do perfil vem pré-preenchido (parcialmente)              | `proceed-3` desabilitado até completar                                                         | Partição de equivalência        |
| RN17 | Pagamento                     | Forma de pagamento obrigatória; "Check payment" desabilitado sem forma escolhida                                                   | `finish` desabilitado                                                                          | Tabela de decisão               |
| RN18 | Pagamento – Bank Transfer     | Nome do banco, nome da conta e número da conta obrigatórios; nome do banco aceita só letras e espaços                              | "Bank name can only contain letters and spaces."                                               | Partição de equivalência        |
| RN19 | Pagamento – Cash on Delivery  | Sem campos extras; libera o pagamento direto                                                                                       | `finish` habilitado                                                                            | —                               |
| RN20 | Pagamento – Credit Card       | Número no formato `9999-9999-9999-9999`                                                                                            | "Invalid card number format."                                                                  | Partição de equivalência        |
| RN21 | Pagamento – Credit Card       | Validade no formato MM/YYYY e no futuro                                                                                            | "Invalid date format. Use MM/YYYY." / "Expiration date must be in the future."                 | Valor-limite (mês atual)        |
| RN22 | Pagamento – Credit Card       | CVV com 3 ou 4 dígitos                                                                                                             | "CVV must be 3 or 4 digits."                                                                   | Valor-limite (2/3/4/5)          |
| RN23 | Pagamento – Buy Now Pay Later | Parcelas obrigatórias: 3, 6, 9 ou 12                                                                                               | `finish` desabilitado sem parcela                                                              | Partição de equivalência        |
| RN24 | Pagamento – Gift Card         | Número com exatamente 16 letras ou dígitos; código de validação com exatamente 4                                                   | "...exactly 16 letters and/or digits." / "...exactly 4 letters and/or digits."                 | Valor-limite (15/16/17 e 3/4/5) |
| RN25 | Pagamento                     | Pagamento válido mostra sucesso antes da confirmação do pedido                                                                     | `payment-success-message`: "Payment was successful"                                            | —                               |
| RN26 | Catálogo                      | Busca sem resultado mostra contador 0 e mensagem                                                                                   | "0 products found for 'x'" / "There are no products found."                                    | Partição de equivalência        |

### Pontos a confirmar

Comportamentos suspeitos. Ainda **não** são regras nem bugs confirmados.

- O nome do titular do cartão aceitou dígito ("Jo1") sem erro. Falta validação ou não existe essa regra?
- No Credit Card, o botão "Check payment" ficou **habilitado com os campos vazios** uma vez, logo após trocar de forma de pagamento. Precisa ser reproduzido.
- Quantidade 0 ou negativa no passo 1 do carrinho (não testado).
- Rentals: regras de horas e quantidade não verificadas.

## 3. Seletores

**Conclusão: a aplicação usa `data-test` de forma ampla e consistente.** Na home, 74 de 87 elementos interativos têm `data-test`. Nos formulários, todos os campos e botões têm.

**Recomendação:** configurar `testIdAttribute: 'data-test'` no `playwright.config.ts` e usar `page.getByTestId(...)`. Usar `getByRole` apenas nos elementos sem o atributo.

| Área           | Seletores `data-test` principais                                                                                                                                                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header         | `nav-home`, `nav-categories`, `nav-hand-tools`, `nav-power-tools`, `nav-other`, `nav-special-tools`, `nav-rentals`, `nav-contact`, `nav-sign-in`, `nav-cart`, `cart-quantity`, `language-select`, `lang-<código>`; logado: `nav-menu`, `nav-my-account`, `nav-my-favorites`, `nav-my-profile`, `nav-my-invoices`, `nav-my-messages`, `nav-sign-out` |
| Catálogo       | `search-query`, `search-submit`, `search-reset`, `search-caption`, `search-result-count`, `no-results`, `sort`, `filters`, `category-<ULID>`, `brand-<ULID>`, `eco-friendly-filter`, `product-<ULID>`, `product-name`, `product-price`, `co2-rating-badge`, `out-of-stock`, `compare-btn`, `pagination-prev`, `pagination-next`                     |
| Produto        | `product-name`, `unit-price`, `product-description`, `decrease-quantity`, `quantity`, `increase-quantity`, `add-to-cart`, `add-to-favorites`, `add-to-compare`, `product-specs`, `spec-row`, `spec-name`, `spec-value`                                                                                                                              |
| Login          | `login-form`, `email`, `password`, `login-submit`, `login-error`, `register-link`, `forgot-password-link`                                                                                                                                                                                                                                           |
| Registro       | `register-form`, `first-name`, `last-name`, `dob`, `country`, `postal_code`, `house_number`, `street`, `city`, `state`, `phone`, `email`, `password`, `register-submit`                                                                                                                                                                             |
| Erros de campo | padrão `<campo>-error` (ex.: `email-error`, `dob-error`, `message-error`)                                                                                                                                                                                                                                                                           |
| Contato        | `first-name`, `last-name`, `email`, `subject`, `message`, `attachment`, `contact-submit`                                                                                                                                                                                                                                                            |
| Checkout       | `product-title`, `product-quantity`, `product-price`, `line-price`, `cart-total`, `continue-shopping`, `proceed-1`, `proceed-2`, `proceed-3`, `guest-email`, `guest-first-name`, `guest-last-name`, `guest-submit`                                                                                                                                  |
| Pagamento      | `payment-method` (valores: `bank-transfer`, `cash-on-delivery`, `credit-card`, `buy-now-pay-later`, `gift-card`), `bank_name`, `account_name`, `account_number`, `credit_card_number`, `expiration_date`, `cvv`, `card_holder_name`, `monthly_installments`, `gift_card_number`, `validation_code`, `finish`, `payment-success-message`             |
| Conta          | `page-title`, `favorite-<ULID>`, `delete`, `update-profile-submit`, `current-password`, `new-password`, `new-password-confirm`, `change-password-submit`                                                                                                                                                                                            |

### Elementos sem `data-test`

Usar `getByRole` ou o texto visível:

- aba "Continue as Guest" no checkout;
- botão "Sign in with Google";
- botões numéricos da paginação (1, 2, 3...);
- botões "Testing Guide" e "🐛 Bug Hunting";
- sliders de preço (`role=slider`);
- toasts (`.toast-message`);
- mensagens de validação do pagamento (não seguem o padrão `-error`).

### Cuidados

- **`data-test` repetidos** em telas ou blocos diferentes (`email`, `password`, `country`, `product-price`, `product-name`): no Page Object, limitar a busca ao formulário, passo ou card.
- **IDs ULID** em `product-*`, `category-*` e `brand-*` dependem da massa de dados. Preferir localizar pelo nome ou label dentro do card.
- **Massa compartilhada:** o banco é público e outros usuários alteram os dados (já existem marcas como "Moya Brand… editado"). Os testes não devem depender de nomes de marca nem do estado da conta demo.
- **Conta demo compartilhada** (`customer@practicesoftwaretesting.com`): para pedidos, preferir um usuário novo ou compra como convidado.

## 4. Próximos passos

1. Configurar `baseURL` e `testIdAttribute: 'data-test'` no `playwright.config.ts`, remover o `tests/example.spec.ts` e adicionar os scripts de teste ao `package.json`.
2. Usar a tabela de regras como base para a E5 (cenários com IA) e a E6 (plano de testes).
3. Repetir este reconhecimento na [versão com bugs](https://with-bugs.practicesoftwaretesting.com) e comparar.
