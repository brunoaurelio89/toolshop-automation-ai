import { test, expect } from '../../../src/fixtures';
import { credentials, hasCredentials } from '../../../src/config/env';

test.describe('Login', { tag: '@smoke' }, () => {
  test(
    'entra com credenciais válidas',
    { tag: ['@RN01', '@CT-01'] },
    async ({ loginPage, accountPage, page }) => {
      test.skip(!hasCredentials, 'Defina USER_EMAIL e USER_PASSWORD no .env');

      await loginPage.acessar();
      await loginPage.logar(credentials.email, credentials.password);

      await expect(page).toHaveURL(/\/account$/);
      await expect(accountPage.titulo).toHaveText('My account');
    },
  );

  test(
    'mostra erro genérico com e-mail inexistente',
    { tag: ['@RN02', '@CT-05'] },
    async ({ loginPage, page }) => {
      // E-mail inexistente de propósito: com a conta real, 3 senhas erradas
      // bloqueiam a conta para sempre (RN27). Por isso o CT-04 não roda aqui.
      await loginPage.acessar();
      await loginPage.logar('nao-existe.e3@example.com', 'senha-errada-123');

      await expect(loginPage.erro).toHaveText('Invalid email or password');
      await expect(page).toHaveURL(/\/auth\/login$/);
    },
  );
});
