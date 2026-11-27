import { type Locator, type Page } from '@playwright/test';

/**
 * Tela de login (/auth/login).
 * Regras da arquitetura: só ações e locators, sem asserção.
 * Os locators partem do formulário porque `email` e `password` se repetem em outras telas.
 */
export class LoginPage {
  readonly form: Locator;
  readonly email: Locator;
  readonly senha: Locator;
  readonly entrar: Locator;
  readonly erro: Locator;

  constructor(private readonly page: Page) {
    this.form = page.getByTestId('login-form');
    this.email = this.form.getByTestId('email');
    this.senha = this.form.getByTestId('password');
    this.entrar = this.form.getByTestId('login-submit');
    this.erro = page.getByTestId('login-error');
  }

  async acessar() {
    await this.page.goto('/auth/login');
  }

  async logar(email: string, senha: string) {
    await this.email.fill(email);
    await this.senha.fill(senha);
    await this.entrar.click();
  }
}
