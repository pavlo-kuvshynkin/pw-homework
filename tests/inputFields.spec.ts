import { test, expect } from '@playwright/test';

test.describe('Input fields', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
        await page.getByTitle('pettypes').click()
        await expect(page.locator('h2')).toHaveText('Pet Types')
    })

    test('Test Case 1: Update pet type', async ({page}) => {
        //Creating locator for targeted table row that is going to be edited
        const tableRow = page.locator('tbody tr')
        await tableRow.getByRole('button',{name: "Edit"}).first().click()
        //Asserting the "Edit Pet Type" text displayed
        await expect(page.locator('h2')).toHaveText('Edit Pet Type')
        //Creating a locator for input field that be cleared and inserted a new value
        const nameInputField = page.getByRole('textbox')
        await nameInputField.clear()
        await nameInputField.fill('rabbit')
        //Creating a locator for 'Update' button that we will use a few more times
        const updateButton = page.getByRole('button', {name: "Update"})
        await updateButton.click()
        //Extracting a value of the name field
        //Asserting (general) the value of the first row is updated
        await expect(tableRow.locator('td input[id="0"]')).toHaveValue('rabbit')
        //Now going to edit the same row again to back 'cat'
        await tableRow.getByRole('button',{name: "Edit"}).first().click()
        //Clearing 'rabbit' from the field and filling with 'cat' and clicking 'Update' button
        await nameInputField.clear()
        await nameInputField.fill('cat')
        await updateButton.click()
        //Then asserting the 'cat' value of the same row is updated
        await expect(tableRow.locator('td input[id="0"]')).toHaveValue('cat')
    })

    // test('Test Case 2: Cancel pet type update', async ({page}) => {
    // const tableRows = page.locator('tbody tr')
    // await tableRows.filter({has: page.locator('td input[id="1"]')}).getByRole('button',{name: "Edit"}).click()
    // });

    // test('Test Case 3: Pet type name is required validation', async ({page}) => {
    // const tableRows = page.locator('tbody tr')
    // await tableRows.filter({has: page.locator('td input[id="2"]')}).getByRole('button',{name: "Edit"}).click()
    // });
})