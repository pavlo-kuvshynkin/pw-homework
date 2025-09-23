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

    await page.route('*/**/petclinic/api/vets', async route => {
        const response = await route.fetch()
        const responseBody = await response.json()
        for (let vet of responseBody) {
            if (vet.firstName === 'Sharon' && vet.lastName === 'Jenkins'){
                vet.specialties = [
                    {
                        "id": 1015,
                        "name": "radiology"
                    },
                    {
                        "id": 1016,
                        "name": "surgery"
                    },
                    {
                        "id": 1017,
                        "name": "dentistry"
                    },            {
                        "id": 1018,
                        "name": "dermatology"
                    },
                    {
                        "id": 1019,
                        "name": "ophthalmology"
                    },
                    {
                        "id": 1020,
                        "name": "nutrition"
                    },
                    {
                        "id": 1021,
                        "name": "anesthesiology"
                    },
                    {
                        "id": 1022,
                        "name": "emergency and critical care"
                    },
                    {
                        "id": 1023,
                        "name": "internal medicine"
                    },
                    {
                        "id": 1024,
                        "name": "behavior"
                    }
                ];
            }
        }
        
        await route.fulfill({
            body: JSON.stringify(responseBody)
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
    await expect(page.locator(".ownerFullName")).toHaveText(owners[0].firstName + ' ' + owners[0].lastName)
    await expect(page.getByRole('row', {name: "Address"})).toContainText(owners[0].address)
    await expect(page.getByRole('row', {name: "City"})).toContainText(owners[0].city)
    await expect(page.getByRole('row', {name: "Telephone"})).toContainText(owners[0].telephone)
    //4. Validate owner has 2 pets and their names are matching the mock data
    const allPetsTables = page.locator('app-pet-list');
    await expect(allPetsTables.first().locator('dd').first()).toHaveText(owners[0].pets[0].name);
    await expect(allPetsTables.last().locator('dd').first()).toHaveText(owners[0].pets[1].name);
    //5. Validate number of visits for the first pet
    await expect(page.locator('.table-condensed > tr')).toHaveCount(10)
});

test('Intercept API response', async ({ page }) => {
    await page.goto('/');
    const pm = new PageManager(page);
    //1. Navigate to the Veterinarians page
    await pm.navigateTo().veterinariansPage();
    await expect(page.getByRole('heading')).toHaveText('Veterinarians');
    //2. Validate number of specialties for the "Sharon Jenkins" is equal to 10
    await expect(page.getByRole('row', {name: "Sharon Jenkins"}).getByRole('cell').nth(1).locator('div')).toHaveCount(10)
})