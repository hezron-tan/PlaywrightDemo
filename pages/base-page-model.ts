import { type Page } from '@playwright/test';

export class BasePageModel {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToPage(url: string) {
        await this.page.goto(url);
    }
}