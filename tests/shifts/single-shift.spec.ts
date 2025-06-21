import { test, expect, BrowserContext, Page, Locator } from "@playwright/test";
import { DashboardPage } from "../POM/DashboardPage";
import { ShiftFormComponent } from "../COM/ShiftFormComponent";

test.describe.serial("Single shift test suite - CRUD OPS", () => {
  let context: BrowserContext;
  let page: Page;
  let dashboardPage: DashboardPage;
  let shiftFormComponent: ShiftFormComponent;
  let createdShiftId: string;
  let shiftCard: Locator;

  let shiftData: {
    vorlage: string;
    mitarbeiter: string;
    datum: string;
    endzeit: string;
  } = {
    vorlage: "",
    mitarbeiter: "",
    datum: "",
    endzeit: "",
  };

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    dashboardPage = new DashboardPage(page);
    shiftFormComponent = new ShiftFormComponent(page);
    await dashboardPage.goto();
    await dashboardPage.sidemenu.capacatyPlanningButton.click();
  });

  test("Create a single shift sucesfully", async () => {
    await dashboardPage.sidemenu.shiftManagementButton.click();
    await expect(dashboardPage.pageTitle).toBeVisible();
    await expect(dashboardPage.pageTitle).toContainText("Schichten");
    await dashboardPage.triggerAsideActionForm();
    const { vorlage, mitarbeiter, datum, endzeit, shiftId, queryDate } =
      await shiftFormComponent.createShift();
    shiftData.vorlage = vorlage;
    shiftData.mitarbeiter = mitarbeiter;
    shiftData.datum = datum;
    shiftData.endzeit = endzeit;
    createdShiftId = shiftId;

    // navigate to the date of the created shift
    await dashboardPage.page.goto("#/organisation/shifts?date=" + queryDate);
    shiftCard = await dashboardPage.getShiftCardById(createdShiftId);
    await expect(shiftCard).toBeVisible();
    await shiftCard.click(/*{ clickCount: 2 }*/);
    // verify popup is visible
    await expect(dashboardPage.shiftDetailsPopup).toBeVisible();
  });

  test("Verify shift details", async () => {
    await dashboardPage.shiftPopupOpenButton.click();
    await expect(dashboardPage.asideActionFormCloseButton).toBeVisible();
    await shiftFormComponent.verifyShiftData(shiftData);
  });

  test("Update shift details", async () => {
    // updating only the end-time
    await shiftFormComponent.formInput("Endzeit").click();
    await shiftFormComponent.option("17:00").click(); // hardcoded for now
    // intercept the request when updating a shift
    const updateShiftResponsePromise =
      dashboardPage.page.waitForResponse("**/graphql");
    await shiftFormComponent.createShiftButton.click();
    const updateShiftResponse = await updateShiftResponsePromise;
    const responseJson = await updateShiftResponse.json();
    const updateShiftSlot = await responseJson[0].data.updateShiftSlot;
    const updatedShiftId = updateShiftSlot.id;
    expect(updateShiftResponse.ok()).toBeTruthy();
    expect(updatedShiftId).toBe(createdShiftId);
    const updatedShiftData = {
      ...shiftData,
      endzeit: "17:00", // updated end time
    };
    await dashboardPage.page.reload();
    await expect(shiftCard).toBeVisible();
    await shiftCard.click({ clickCount: 2 });
    await expect(shiftFormComponent.deleteShiftButton).toBeVisible();
    await shiftFormComponent.verifyShiftData(updatedShiftData);
  });

  test("Delete shift", async () => {
    await shiftFormComponent.deleteShift(createdShiftId);
  });
});
