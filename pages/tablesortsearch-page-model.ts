import { Locator, Page, expect } from "@playwright/test";
import { BasePageModel } from "./base-page-model";
import { Person } from "../datamodel/person.model";


export class TableSortSearchPageModel extends BasePageModel {
    readonly page: Page;
    readonly nextButton: Locator;
    readonly entriesLabel: Locator;
    readonly previousButton: Locator;
    readonly searchBar: Locator;
    pageNumber : number;
    

    constructor(page : Page) {        
        super(page);
        this.page = page;
        this.nextButton = page.locator('a.next');
        this.entriesLabel = page.locator('#example_info');
        this.previousButton = page.locator('a.previous');
        this.searchBar = page.getByLabel('Search:');
        this.pageNumber = 0;
    }

    async getResults() {
        let persons : Person[] = [];
        let name : string = "";
        let position : string = "";
        let office : string = "";
        let age : number = 0;
        let isButtonDisabled : Boolean = true;
        this.pageNumber = 0;
        
        do {
            // Check if next button is enabled
            isButtonDisabled = await this.page.locator('a.next.disabled').isVisible();

            // Verify current page
            this.pageNumber++;
            await expect(this.page.locator('a.paginate_button.current')).toContainText(this.pageNumber.toString());

            // Get rows and push person data
            let rows = this.page.locator('//tbody/tr').all();
            for (let row of await rows) {
                name = (await row.locator('//td[1]').innerText()).trim();
                position = (await row.locator('//td[2]').innerText()).trim();
                office = (await row.locator('//td[3]').innerText()).trim();
                age = Number((await row.locator('//td[4]').innerText()).trim());
                persons.push(new Person(name, position, office, age));
            }

            await this.nextButton.click();
        } while (!isButtonDisabled);

        return persons;
    }

    async navigateBackToFirstPage() {
        do {
            await this.previousButton.click();
            this.pageNumber--;
            await expect(this.page.locator('a.paginate_button.current')).toContainText(this.pageNumber.toString());
        } while(!await this.page.locator('a.previous.disabled').isVisible());
    }

    async navigateToPage() {
        await this.page.goto("https://www.lambdatest.com/selenium-playground/table-sort-search-demo");
    }
}