import { type Locator, type Page } from '@playwright/test';

/** Área do cliente (/account). */
export class AccountPage {
  readonly titulo: Locator;

  constructor(page: Page) {
    this.titulo = page.getByTestId('page-title');
  }
}
