import { expect, test } from "playwright/test";
import { DataEntryHelper } from "../helper/data.entry.helper";

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
        page.close();
    })
    
    test("Drap & Drop", async ( { page }) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/drag-and-drop-demo");

    })

    test("Pagination", async ( {page} ) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/table-pagination-demo");

    })

    test("Date Picker", async ( {page}) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/bootstrap-date-picker-demo");


    })

    test("Data List Filter", async ( {page} ) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/data-list-filter-demo");

    })

    test("Table sort and search", async ( {page} ) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/table-sort-search-demo");

    })
})

