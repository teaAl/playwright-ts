import { expect, type Locator, type Page, Response } from "@playwright/test";

export class SidemenuComponent {
  readonly page: Page;
  readonly capacatyPlanningButton: Locator;
  readonly shiftManagementButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.capacatyPlanningButton = page.getByTestId(
      "NavItems.capacity-planning-group"
    );
    this.shiftManagementButton = page.getByTestId("NavItems.shift");
  }
}

/*
  There's a pattern in NavItems data-testid attributes.
  Can create a method to grab the nav item by passing a prop.
  Example:
  getNavItemByTestId(parialTestId: string): Locator {
    return this.page.getByTestId("NavItems." + partialTestId);
  }

  This way, you can dynamically get any nav item by its partial test ID.
  Another thing to consider is to group navlinks the same way as in UI 
  because submenu items are not visible if parent item is not expanded.
  Example: if you need to click on "Shift Management" submenu item,
  you need to first click on "Shift Management" parent item to expand it 
  or then the test will fail because submenu items are not visible.
*/
