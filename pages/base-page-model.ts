import { type Page } from '@playwright/test';

export class BasePageModel {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}