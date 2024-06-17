import  { test, chromium, expect } from "playwright/test";

test("Login Test", async ( { page } ) => {
    // const browser = await chromium.launch({
    //     headless: false
    // });
    // const context = await browser.newContext();
    // const page = await context.newPage();

    await page.goto("https://www.saucedemo.com/");

    // using locator xpath or css selector
    const username = await page.locator("#user-name");
    const password = await page.locator("#password");

    // using get by role
    // const loginButton = await page.locator("#login-button");
    const loginButton = await page.getByRole('button', { name: 'Login' });
    
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();

    await username.fill("standard_user");
    await password.fill("secret_sauce");
    await loginButton.click();

    // using get by text 
    const header = await page.getByText("Products");

    // Wait
    await page.waitForLoadState();

    // assert by URL
    await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");

    await page.close();
})