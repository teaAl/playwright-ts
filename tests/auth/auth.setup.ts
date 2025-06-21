import { test as setup, expect, Page, BrowserContext } from "@playwright/test";
import { LoginPage } from "../POM/LoginPage";

const authFile = "tests/auth/user.json";
setup.use({ baseURL: process.env.BASE_URL });

setup("Login ", async ({ browser }) => {
  let context: BrowserContext;
  let page: Page;
  let user = {
    email: "Laconics-Admin",
    password: "JJDlSvNh6cej3cxv",
  };
  context = await browser.newContext();
  page = await context.newPage();
  let loginPage = new LoginPage(page);
  await loginPage.goto();
  const loginResponse = await loginPage.login(user.email, user.password);
  expect(loginResponse?.ok()).toBeTruthy();
  // Wait for dashboard to load
  await page.context().storageState({ path: authFile });
});
