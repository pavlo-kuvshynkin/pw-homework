import { test, expect } from '@playwright/test'

test.describe('listsAndDropDowns', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        // 1-2. Navigate to the 'Search' page and validate the title 'Owners' is present.
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
        await expect(page.locator('h2')).toHaveText('Owners')
    })

    test('TC 1: Validate selected pet types from the list', async ({ page }) => {
        // 3. Select the first owner from the table
        await page.getByRole('link', { name: 'George Franklin' }).click()
        // 4. Assert the owner name is 'George Franklin'
        await expect(page.locator('.ownerFullName')).toHaveText('George Franklin')
        // 5. Click on the 'Edit Pet' button for an existing pet
        await page.locator('app-pet-list', {hasText: "Leo"}).getByRole('button', {name: 'Edit Pet'}).click()
        // 6. Assert 'Pet' title is displayed
        await expect(page.locator('h2')).toHaveText('Pet')
        // 7. Assert that the owner field has the value 'George Franklin'
        await expect(page.locator('#owner_name')).toHaveValue('George Franklin')
        // 8. Create a locator for the "Type" field and assert it initially has 'cat' value
        const petTypeField = page.locator('#type1')
        await expect(petTypeField).toHaveValue('cat')
        // 9. Loop through the drop-down options and validate each selection
        const dropDownMenu = page.locator('select')
        const petTypeOptions = ['cat', 'dog', 'lizard', 'snake', 'bird', 'hamster']

        for (const petOption of petTypeOptions) {
            await dropDownMenu.selectOption(petOption)
            await expect(petTypeField).toHaveValue(petOption)
            if (petOption === 'hamster') {
                break
            }
        }
    })

    test('Test Case 2: Select all specialties', async ({page}) => {
        // 3. Select the first owner from the table
        await page.getByRole('link', { name: 'Eduardo Rodriquez' }).click()
        // 4. Locating Pet and Visits table for a pet 'Rosy' and click on the 'Edit Pet' button for an existing pet
        const petRosyTable = page.locator('app-pet-list', {hasText: "Rosy"})
        await petRosyTable.getByRole('button', {name: 'Edit Pet'}).click()
        // 5. Assert the name 'Rosy' is displayed in the pet name field
        await expect(page.getByLabel('Name')).toHaveValue("Rosy")
        // 6. Create a locator for the "Type" field and assert it initially has 'dog' value
        const petTypeField = page.locator('#type1')
        await expect(petTypeField).toHaveValue('dog')
        // 7. From the drop-down menu, select the value "bird"
        const dropDownField = page.locator('select')
        await dropDownField.selectOption('bird')
        // 8. Assert pet type and drop-down input field has a 'bird' value
        await expect(petTypeField).toHaveValue('bird')
        await expect(dropDownField).toHaveValue('bird')
        // 9. Click 'Update Pet' button
        const updatePetBtn = page.getByRole('button', {name: 'Update Pet'})
        await updatePetBtn.click()
        //10. Assert that pet "Rosy" has a new value of the Type "bird" on the "Pet details" page
        await expect(petRosyTable).toContainText('bird')
        //11. Reverting pet type back to 'dog' by going through steps from 6 to 10
        await petRosyTable.getByRole('button', {name: 'Edit Pet'}).click()
        await expect(petTypeField).toHaveValue('bird')
        await dropDownField.selectOption('dog')
        await expect(petTypeField).toHaveValue('dog')
        await expect(dropDownField).toHaveValue('dog')
        await updatePetBtn.click()
        await expect(petRosyTable.locator('td', {hasText: "Type"})).toContainText('dog')
    })
})