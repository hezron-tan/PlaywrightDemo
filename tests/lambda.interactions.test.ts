import { expect, test } from "playwright/test";
import { DataEntryHelper } from "../helper/data.entry.helper";
import { Person } from "../datamodel/person.model";
import { HeaderOption, TableSortSearchPageModel } from "../pages/tablesortsearch-page-model";
import { DatePickerPageModel } from "../pages/datepicker-page-model";
import { start } from "repl";

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

        let name = DataEntryHelper.generateFirstName();
        page.once('dialog', dialog => {
            dialog.accept(name).catch(() => {});
        });

        await clickMeButtons.last().click();
        await expect(page.locator('#prompt-demo')).toContainText(`You have entered \'${name}\' !`);
    })
    
    test("Drap & Drop", async ( { page }) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/drag-and-drop-demo");

        const dragabbles = page.locator('#todrag span');
        const dropzone = page.locator('#mydropzone');
        const droplist = page.locator('#droppedlist');
        
        while ((await dragabbles.all()).length != 0) {
            let itemName = await dragabbles.first().innerText();
            await dragabbles.first().dragTo(dropzone);
            await expect(droplist).toContainText(itemName);
        } 

        const demo2Dragabble = page.locator('#draggable');
        const droppable = page.locator('#droppable');

        await demo2Dragabble.dragTo(droppable);
        await expect(droppable).toContainText('Dropped');
    })

    test("Simple Date Picker", async ( {page}) => {
       await page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo");

        const birthdayDatePicker = page.locator('#birthday');
        let birthDate = new Date(DataEntryHelper.generateBirthDate()).toISOString().split('T')[0];
        await birthdayDatePicker.fill(birthDate);
        await expect(birthdayDatePicker).toHaveValue(birthDate);
    })

    test("Date Picker Refactored", async ( {page}) => {
        const datePickerPage: DatePickerPageModel = new DatePickerPageModel(page);
        await datePickerPage.navigateToPage("https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo");

        let startDate = DataEntryHelper.generatePastDate();
        let endDate = DataEntryHelper.generateFuturetDate();
 
        startDate = await datePickerPage.selectStartDate(startDate);
        await expect(datePickerPage.startDateField).toHaveValue(startDate.toLocaleDateString("en-NZ", { day: "2-digit", month: "2-digit", year: "numeric"}));

        endDate = await datePickerPage.selectEndDate(endDate);
        await expect(datePickerPage.endDateField).toHaveValue(endDate.toLocaleDateString("en-NZ", { day: "2-digit", month: "2-digit", year: "numeric"}));
     })

    test("Table sort and search", async ( {page} ) => {
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

    test("Page Model Refactored Search Test", async ( {page} ) => {
        const tableSortSearchPage : TableSortSearchPageModel = new TableSortSearchPageModel(page);
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

    test("Sorting Test", async( {page} ) => {
        const tableSortSearchPage : TableSortSearchPageModel = new TableSortSearchPageModel(page);
        await tableSortSearchPage.navigateToPage();

        // Get all entries
        let persons : Person[] = [];
        persons = await tableSortSearchPage.getResults();

        // Navigate back to page 1
        await tableSortSearchPage.clickPageNumber(1);

        // Verify sorted by Name by Default
        persons.sort((a, b) => a.name.localeCompare(b.name));
        let sortedDataPerson : Person[] = [];
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);

        // Verify sorting by Name Desc
        await tableSortSearchPage.clickHeader(HeaderOption.Name);
        persons.sort((a, b) => b.name.localeCompare(a.name));
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);

        // Verify sorting by Position Asc
        await tableSortSearchPage.clickHeader(HeaderOption.Position);
        persons.sort((a, b) => a.position.localeCompare(b.position));
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);

        // Verify sorting by Position Desc
        await tableSortSearchPage.clickHeader(HeaderOption.Position);
        persons.sort((a, b) => b.position.localeCompare(a.position));
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);

        // Verify sorting by Office Asc
        await tableSortSearchPage.clickHeader(HeaderOption.Office);
        persons.sort((a, b) => a.office.localeCompare(b.office));
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);

        // Verify sorting by Office Desc
        await tableSortSearchPage.clickHeader(HeaderOption.Office);
        persons.sort((a, b) => b.office.localeCompare(a.office));
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);

        // Verify sorting by Age Asc
        await tableSortSearchPage.clickHeader(HeaderOption.Age);
        persons.sort((a, b) => a.age - b.age);
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);

        // Verify sorting by Age Desc
        await tableSortSearchPage.clickHeader(HeaderOption.Age);
        persons.sort((a, b) => b.age - a.age);
        sortedDataPerson = await tableSortSearchPage.getResults();
        expect(sortedDataPerson).toMatchObject(persons);
    })

    test.afterEach('Teardown',async( {page} ) => {
        page.close();
    })

})

