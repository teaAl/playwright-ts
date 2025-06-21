import { expect, type Locator, type Page, Response } from "@playwright/test";
import { SidemenuComponent } from "../COM/SidemenuComponent";

export class DashboardPage {
  readonly page: Page;
  readonly sidemenu: SidemenuComponent;
  readonly pageTitle: Locator;
  readonly bottomActionButton: Locator;
  readonly asideActionForm: Locator;
  readonly asideActionFormCloseButton: Locator;
  readonly shiftDetailsPopup: Locator;
  readonly shiftPopupOpenButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidemenu = new SidemenuComponent(page);
    this.pageTitle = page.locator(".v-toolbar__title");
    this.bottomActionButton = page.getByRole("main").getByRole("button");
    this.asideActionForm = page.locator(".v-dialog__content--active");
    this.asideActionFormCloseButton = this.page.getByTestId("IconButton.close");
    this.shiftDetailsPopup = page.getByRole("menu");
    this.shiftPopupOpenButton = page.getByTestId("IconButton.open");
  }

  async goto() {
    await this.page.goto("#/views/5");
    await expect(this.page).toHaveURL("#/views/5");
  }

  async triggerAsideActionForm() {
    await this.bottomActionButton.click();
    await expect(this.asideActionFormCloseButton).toBeVisible();
  }

  async getShiftCardById(id: string): Promise<Locator> {
    const referencedShiftCard = this.page.locator(`[data-event-id="${id}"]`);
    return referencedShiftCard;
  }
}
