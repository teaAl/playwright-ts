import { expect, type Locator, type Page, Response } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId("LoginView.username-text-field");
    this.passwordInput = page.getByTestId(
      "PasswordTextField.password-text-field"
    );
    this.loginButton = page.getByTestId("LoginView.login-button");
  }

  async goto() {
    await this.page.goto("index.html#/");
  }

  async login(email: string, password: string): Promise<Response | null> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    const loginResponsePromise = this.page.waitForResponse("**/login");
    await this.loginButton.click();
    const loginResponse = await loginResponsePromise;
    return loginResponse;
  }
}
