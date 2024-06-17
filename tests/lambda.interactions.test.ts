import { expect, test } from "playwright/test";

test.describe('Interactions', ()=> {
    test("Sliders", { tag: '@smoketest' } , async ( { page }) => {
        await page.goto("https://www.lambdatest.com/selenium-playground/drag-drop-range-sliders-demo");

        const sliders = page.locator("//h4").all();
        let defaultValue = "";
        let randomNumber = 0;

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

