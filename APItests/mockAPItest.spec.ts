import { test, expect } from '@playwright/test';
import owners from '../test-data/ownersDetails.json';
import { PageManager } from '../Page-Objects/pageManager';

test.beforeEach(async ({ page }) => {
    await page.route('*/**/petclinic/api/owners', async route => {
        await route.fulfill({
            body: JSON.stringify(owners)
        });
    })
    await page.route('*/**/petclinic/api/owners/*', async route => {
        await route.fulfill({
            body: JSON.stringify(owners[0])
        });
    });
});

test('Owners details validation', async ({ page }) => {
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.navigateTo().ownersPage();
    await expect(page.getByRole('heading')).toHaveText('Owners');
    //1. Validate that 2 owners are displayed in the table
    await expect(page.locator('tbody > tr')).toHaveCount(2);
    //2. Navigate to the first owner's details page
    await page.getByRole('link', {name: `${owners[0].firstName} ${owners[0].lastName}`}).click();
    //3. Validate owner details are matching the mock data
    await expect(page.getByRole('heading').first()).toHaveText('Owner Information');
    //Locating and extracting owner details from the table
    const ownerDetailsTable = page.getByRole('table').first();
        let ownerDetails: string[] = [];
        const ownerDetailRows = await ownerDetailsTable.locator('tr').all();
        for (let tableRow of ownerDetailRows) {
            const cellContent = await tableRow.locator('td').innerText()
            ownerDetails.push(cellContent!);
        }
    expect(ownerDetails).toEqual([
        owners[0].firstName + ' ' + owners[0].lastName,
        owners[0].address,
        owners[0].city,
        owners[0].telephone
    ]);
    //4. Validate owner has 2 pets and their names are matching the mock data
    const allPetsTables = page.locator('app-pet-list');
    await expect(allPetsTables.first().locator('dd').first()).toHaveText(owners[0].pets[0].name);
    await expect(allPetsTables.last().locator('dd').first()).toHaveText(owners[0].pets[1].name);
    //5. Validate number of visits for the first pet
    await expect(page.locator('.table-condensed > tr')).toHaveCount(10)
});