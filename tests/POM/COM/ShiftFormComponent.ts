import { expect, type Locator, type Page, Response } from "@playwright/test";

export class ShiftFormComponent {
  readonly page: Page;
  readonly formInput: (name: string) => Locator;
  readonly option: (name: string) => Locator;
  readonly headline: (name: string) => Locator;
  readonly formInputId: (text: string) => Promise<string | null>;
  readonly createShiftButton: Locator;
  readonly deleteShiftButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.formInput = (name) => page.getByRole("textbox", { name: name });
    this.option = (name) => page.getByRole("option", { name: name });
    this.headline = (name) =>
      page.locator(".headline", {
        hasText: name,
      });
    this.formInputId = async (text) =>
      page.locator("label", { hasText: text }).getAttribute("for");
    this.createShiftButton = page.getByRole("button", { name: "Speichern" });
    this.deleteShiftButton = page.getByRole("button", { name: "Löschen" });
  }

  /* 
    Method to always have a valid date for Datum field
    @param daysToAdd - Number of days to add to today's date.
    This method will create a date in the future based on the current date.
   */
  private dateManipulation(daysToAdd: number) {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const inputDate = `${day}.${month}.${year}`; // Format: DD.MM.YYYY
    const queryDate = `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    return { inputDate, queryDate };
  }

  async readData() {
    const vorlageInputId = await this.formInputId("Vorlage");
    expect(vorlageInputId).not.toBeNull();
    await expect(this.page.locator(`#${vorlageInputId}`)).toHaveValue(/./);
    const vorlageInput = await this.page
      .locator(`#${vorlageInputId}`)
      .inputValue();

    const mitarbeiterInputId = await this.formInputId("Mitarbeiter");
    expect(mitarbeiterInputId).not.toBeNull();
    const mitarbeiterInput = await this.page
      .locator(`#${mitarbeiterInputId}`)
      .inputValue();
    const datumInputId = await this.formInputId("Datum");
    expect(datumInputId).not.toBeNull();
    const datumInput = await this.page.locator(`#${datumInputId}`).inputValue();
    const endzeitInputId = await this.formInputId("Endzeit");
    expect(endzeitInputId).not.toBeNull();
    const endzeitInput = await this.page
      .locator(`#${endzeitInputId}`)
      .inputValue();
    return {
      vorlage: vorlageInput,
      mitarbeiter: mitarbeiterInput,
      datum: datumInput,
      endzeit: endzeitInput,
    };
  }

  async getSelectorOptions() {
    let options: string[] = [];
    // const optionsLocators = await this.page.getByRole("option").all();
    const optionsLocators = this.page.getByRole("option");
    await optionsLocators.first().waitFor({ state: "visible" });
    const optionsAvailable = await optionsLocators.all();
    for (const option of optionsAvailable) {
      const optionText = await option.textContent();
      options.push(optionText as string);
    }
    const randomOption = options[Math.floor(Math.random() * options.length)];
    return { options, randomOption };
  }

  async verifyShiftData(shiftData: {
    vorlage: string;
    mitarbeiter: string;
    datum: string;
    endzeit: string;
  }) {
    const {
      vorlage: vorlageInput,
      mitarbeiter: mitarbeiterInput,
      datum: datumInput,
      endzeit: endzeitInput,
    } = await this.readData();
    const headline = await this.headline(shiftData.vorlage).textContent();
    expect(headline).toBe(shiftData.vorlage);
    expect(vorlageInput).toBe(shiftData.vorlage);
    expect(mitarbeiterInput).toBe(shiftData.mitarbeiter);
    expect(datumInput).toBe(shiftData.datum);
    expect(endzeitInput).toBe(shiftData.endzeit);
    // verify timestamp on history tab
  }

  async createShift() {
    //Vorlage value
    await this.formInput("Vorlage").click();
    const { randomOption: vorlageSelectedOption } =
      await this.getSelectorOptions();
    await expect(async () => {
      await this.option(vorlageSelectedOption).click();
    }).toPass({
      timeout: 5000,
      intervals: [1000],
    });
    //Mitarbeiter value
    await this.formInput("Mitarbeiter").click();
    const { randomOption: mitarbeiterSelectedOption } =
      await this.getSelectorOptions();
    await this.option(mitarbeiterSelectedOption).click();
    // Datum value
    await this.formInput("Datum").click();
    const { inputDate: shiftDate, queryDate } = this.dateManipulation(2); // 2 days in the future
    await this.formInput("Datum").fill(shiftDate);
    // Endzeit value
    await this.formInput("Endzeit").click();
    await this.option("16:00").click(); // hardcoded for now

    // intercept the request when creating a shift
    const createShiftResponsePromise = this.page.waitForResponse("**/graphql");
    await this.createShiftButton.click();
    const createShiftResponse = await createShiftResponsePromise;
    const responseJson = await createShiftResponse.json();
    const shiftData = responseJson[0].data.createShiftSlot;
    const shiftId = shiftData.id;

    return {
      vorlage: vorlageSelectedOption,
      mitarbeiter: mitarbeiterSelectedOption,
      datum: shiftDate,
      endzeit: "16:00",
      shiftId: shiftId,
      queryDate: queryDate,
    };
  }

  async deleteShift(shiftId: string) /*: Promise<Response>*/ {
    const responsePromise = this.page.waitForResponse(
      async (response) => {
        if (!response.url().includes("graphql")) return false;

        try {
          const json = await response.json();
          const responses = Array.isArray(json) ? json : [json];
          return responses.some(
            (res) => res.data && "deleteShiftSlots" in res.data
          );
        } catch {
          return false;
        }
      },
      { timeout: 10000 }
    );

    // Click delete button and wait for the specific response
    await Promise.all([responsePromise, this.deleteShiftButton.click()]);

    const response = await responsePromise;
    const json = await response.json();
    const responses = Array.isArray(json) ? json : [json];

    const deleteShiftResponse = responses.find(
      (res) => res.data && "deleteShiftSlots" in res.data
    );

    // Get the deleted shift object
    const deletedShift = await deleteShiftResponse.data.deleteShiftSlots[0];
    const deletedShiftId = await deletedShift.id;

    expect(await deletedShiftId).toBe(shiftId);

    if (!deleteShiftResponse) {
      throw new Error("DeleteShiftSlots operation not found in responses");
    }

    return deleteShiftResponse;
  }
}
