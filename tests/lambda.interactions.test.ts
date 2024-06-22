import { expect, test } from "playwright/test";
import { DataEntryHelper } from "../helper/data.entry.helper";
import { Person } from "../datamodel/person.model";
import exp from "constants";
import { TableSortSearchPageModel } from "../pages/tablesortsearch-page-model";

test.describe('Interactions', ()=> {
    test("Sliders", { tag: '@smoketest' } , async ( { page }) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/drag-drop-range-sliders-demo");

        // Set parent locator
        const sliders = page.locator("//h4").all();
        
        // Set temporary variables
        let defaultValue = "";
        let randomNumber = 0;

        // For each sliders
        for (let slider of await sliders) {
            // Verify default value
            defaultValue = (await slider.innerText()).replace('Default value ', '');
            await expect(slider.locator("..//output")).toHaveText(defaultValue);

            // Set new values to slider and verify new values
            randomNumber =  Math.floor(Math.random() * 100);
            await slider.locator("..//input").fill(randomNumber.toString());
            await expect(slider.locator("..//output")).toHaveText(randomNumber.toString());
        }
    })
    
    test("JS Alerts", async ( { page }) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo");

        const clickMeButtons = page.locator("//p//button");
        
        let dialogMessage =  "";
        clickMeButtons.first()
        page.once('dialog', dialog => {
            dialogMessage = dialog.message();
            dialog.dismiss().catch(() => {});
        });

        await clickMeButtons.first().click();
        expect(dialogMessage).toMatch('I am an alert box!');
        
        page.once('dialog', dialog => {
            dialog.accept().catch(() => {});
        });

        await clickMeButtons.nth(1).click();
        await expect(page.locator('#confirm-demo')).toContainText('You pressed OK!');

        page.once('dialog', dialog => {
            dialog.dismiss().catch(() => {});
        });

        await clickMeButtons.nth(1).click();
        await expect(page.locator('#confirm-demo')).toContainText('You pressed Cancel!');

        var d = new DataEntryHelper();
        let name = await d.generateFirstName();
        page.once('dialog', dialog => {
            dialog.accept(name).catch(() => {});
        });

        await clickMeButtons.last().click();
        await expect(page.locator('#prompt-demo')).toContainText(`You have entered \'${name}\' !`);
    })
    
    test("Drap & Drop", async ( { page }) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/drag-and-drop-demo");

    })

    test("Date Picker", async ( {page}) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo");


    })

    test("Data List Filter", async ( {page} ) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/data-list-filter-demo");

    })

    test("Table sort and search", async ( {page} ) => {
        // const tablerSortSearchPage = new TableSortSearchPageModel(page);
        // tablerSortSearchPage.navigateToPage();
        page.goto("https://www.lambdatest.com/selenium-playground/table-sort-search-demo");
        
        let persons : Person[] = [];
        let name : string = "";
        let position : string = "";
        let office : string = "";
        let age : number = 0;
        let isButtonDisabled : Boolean = true;
        let pageNumber : number = 0;

        const nextButton = page.locator('a.next');

        do {
            // Check if next button is enabled
            isButtonDisabled = await page.locator('a.next.disabled').isVisible();

            // Verify current page
            pageNumber++;
            await expect(page.locator('a.paginate_button.current')).toContainText(pageNumber.toString());

            // Get rows and push person data
            let rows = page.locator('//tbody/tr').all();
            for (let row of await rows) {
                name = (await row.locator('//td[1]').innerText()).trim();
                position = (await row.locator('//td[2]').innerText()).trim();
                office = (await row.locator('//td[3]').innerText()).trim();
                age = Number((await row.locator('//td[4]').innerText()).trim());
                persons.push(new Person(name, position, office, age));
            }

            await nextButton.click();
        } while (!isButtonDisabled);
        
        // Verify correct number of entries
        let entriesLabel = page.locator('#example_info');
        await expect(entriesLabel).toContainText(`${persons.length} entries`);

        // Navigate back to page 1
        const previousButton = page.locator('a.previous');
        do {
            await previousButton.click();
            pageNumber--;
            await expect(page.locator('a.paginate_button.current')).toContainText(pageNumber.toString());
        } while(!await page.locator('a.previous.disabled').isVisible());

        // Look for test data
        const searchBar = page.getByLabel('Search:');
        await expect(searchBar).toBeVisible();

        // Search by Name
        let nameSearch : Person = persons[Math.floor(Math.random() * persons.length)];
        await searchBar.fill(nameSearch.name);

        let results = page.locator('//tbody/tr').all();
        
        for (let result of await results) {
            await expect(result).toContainText(nameSearch.name);
        }

        // Search by Position
        let positionSearch : Person = persons[Math.floor(Math.random() * persons.length)];
        await searchBar.fill(positionSearch.position);

        results = page.locator('//tbody/tr').all();

        for (let result of await results) {
            await expect(result).toContainText(positionSearch.position);
        }

        // Search by Office
        let officeSearch : Person = persons[Math.floor(Math.random() * persons.length)];
        await searchBar.fill(officeSearch.office);

        results = page.locator('//tbody/tr').all();

        for (let result of await results) {
            await expect(result).toContainText(officeSearch.office);
        }

        // Search by age
        let ageSearch : Person = persons[Math.floor(Math.random() * persons.length)];
        await searchBar.fill(ageSearch.age.toString());

        results = page.locator('//tbody/tr').all();

        for (let result of await results) {
            await expect(result).toContainText(ageSearch.age.toString());
        }

    })

    test("Page Model Refactored Search Sort Test", async ( {page} ) => {
        const tableSortSearchPage = new TableSortSearchPageModel(page);
        await tableSortSearchPage.navigateToPage();

        // Get all entries
        let persons : Person[] = [];
        persons = await tableSortSearchPage.getResults();

        // Verify number of entries
        await expect(tableSortSearchPage.entriesLabel).toContainText(`${persons.length} entries`);

        // Navigate to first page
        await tableSortSearchPage.navigateBackToFirstPage();

        // Verify search bar is available
        await expect(tableSortSearchPage.searchBar).toBeVisible();

        // To do: Add Sorting Test

        // Verify search by name
        let searchByName : Person = persons[Math.floor(Math.random() * persons.length)];
        await tableSortSearchPage.searchBar.fill(searchByName.name);
        let results : Person[] = []; 
        results = await tableSortSearchPage.getResults();
        expect(results).toEqual(expect.arrayContaining([searchByName]));

        // Verify search by position
        let searchByPosition : Person = persons[Math.floor(Math.random() * persons.length)];
        await tableSortSearchPage.searchBar.fill(searchByPosition.position);
        results = await tableSortSearchPage.getResults();
        for (let result of results) {
            expect(result.position).toEqual(searchByPosition.position);
        }

        // Verify search by office
        let searchByOffice : Person = persons[Math.floor(Math.random() * persons.length)];
        await tableSortSearchPage.searchBar.fill(searchByOffice.office);
        results = await tableSortSearchPage.getResults();
        for (let result of results) {
            expect(result.office).toEqual(searchByOffice.office);
        }
        
        // Verify search by age
        let searchByAge : Person = persons[Math.floor(Math.random() * persons.length)];
        await tableSortSearchPage.searchBar.fill(searchByAge.age.toString());
        results = await tableSortSearchPage.getResults();
        for (let result of results) {
            expect(result.age).toEqual(searchByAge.age);
        }
    })

    test.afterAll('Teardown',async( {page}) => {
        page.close();
    })

})

