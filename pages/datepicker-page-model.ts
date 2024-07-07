import { Locator, Page, expect } from "@playwright/test";
import { BasePageModel } from "./base-page-model";
import { DataEntryHelper } from "../helper/data.entry.helper";
import { stringify } from "querystring";


export class DatePickerPageModel extends BasePageModel {
    readonly page: Page;
    readonly datePicker: Locator;
    readonly startDateField: Locator;
    readonly endDateField: Locator;
    readonly nextButton: Locator;
    readonly prevButton: Locator;
    

    constructor(page : Page) {        
        super(page);
        this.page = page;
        this.datePicker = page.locator("//div[@class='datepicker-days']/table");
        this.startDateField = page.locator('//*[@id="datepicker"]/input[1]');
        this.endDateField = page.locator('//*[@id="datepicker"]/input[2]');
        this.nextButton = this.datePicker.locator("//th[@class='next']");
        this.prevButton = this.datePicker.locator("//th[@class='prev']");
    }

    async selectStartDate(startDate: Date) {
        await this.startDateField.click();
        await expect(this.datePicker).toBeVisible();
        return await this.selectDate(startDate);
    }

    async selectEndDate(endDate: Date) {
        await this.endDateField.click();
        await expect(this.datePicker).toBeVisible();
        return await this.selectDate(endDate);
    }

    async getSelectedStartDate() {
        return await this.startDateField.getAttribute('placeholder');
    }

    private async selectDate(selectedDate: Date) {
        let selectedYear: number = selectedDate.getFullYear();
        let selectedMonth: number = selectedDate.getMonth();
        let selectedDay = selectedDate.getDay();
        let currentMonthYear = await this.getCurrentDate();
        let currentMonth: number = currentMonthYear == null ? Number(new Date().getMonth()) : Number(new Date(currentMonthYear).getMonth());
        let currentYear: number = currentMonthYear == null ? Number(new Date().getFullYear()) : Number(currentMonthYear.split(' ')[1]);
        while (new Date(selectedYear, selectedMonth) != new Date(currentYear, currentMonth)) {
            if (new Date(selectedYear, selectedMonth) < new Date(currentYear, currentMonth)) {
                await this.prevButton.click();
            }
            else if (new Date(selectedYear, selectedMonth) > new Date(currentYear, currentMonth)) {
                await this.nextButton.click();
            }
            else {
                break;
            }
            
            currentMonthYear = await this.getCurrentDate();
            currentMonth = Number(new Date(currentMonthYear == null ? 0 : currentMonthYear).getMonth());
            currentYear = Number(currentMonthYear?.split(' ')[1]);
        }

        let calendarDays = await this.datePicker.locator("//td[@class='day']").all();
        let selectedCalendarDay = calendarDays[Math.floor(Math.random() * calendarDays.length)];
        selectedDay = Number(await selectedCalendarDay.innerText());
        await selectedCalendarDay.click();

        selectedDate = new Date(selectedYear + "-" + (selectedMonth + 1) + "-" + selectedDay);
        return selectedDate;
    }

    private async getCurrentDate() {
        let strCurrDate = await this.datePicker.locator("//th[@class='datepicker-switch']").textContent();
        return strCurrDate;
    }

    private async selectDay(day: number) {
        await this.datePicker.locator(`//td[@class='day'][text()='${day}']`).click();
    }

    // async navigateToPage() {
    //     await this.page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo");
    // }
}
