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
        await nameInputField.click()
        await nameInputField.clear()
        await nameInputField.fill('rabbit')
        //Creating a locator for 'Update' button that we will use a few more times
        const updateButton = page.getByRole('button', {name: "Update"})
        await updateButton.click()
        //Extracting a value of the name field
        //Asserting the value of the first row is updated
        await expect(tableRow.locator('td input[id="0"]')).toHaveValue('rabbit')
        //Now going to edit the same row again to back 'cat'
        await tableRow.getByRole('button',{name: "Edit"}).first().click()
        //Clearing 'rabbit' from the field and filling with 'cat' and clicking 'Update' button
        await nameInputField.click()
        await nameInputField.clear()
        await nameInputField.fill('cat')
        await updateButton.click()
        //Then asserting the 'cat' value of the same row is updated
        await expect(tableRow.locator('td input[id="0"]')).toHaveValue('cat')
    })

    test('Test Case 2: Cancel pet type update', async ({page}) => {
        //Creating locator for targeted table rows that is going to be edited
        const tableRow = page.getByRole('row', { name: 'dog Edit Delete' })
        await tableRow.getByRole('button').first().click()
        //Clearing the field and filling 'moose'
        const nameInputField = page.getByRole('textbox')
        await nameInputField.click()
        await nameInputField.clear()
        await nameInputField.fill('moose')
        //Asserting input value is 'moose'
        const inputValue = await nameInputField.inputValue()
        expect(inputValue).toEqual('moose')
        //Clicking the 'Cancel' button
        await page.getByRole('button', {name: "Cancel"}).click()
        //Then asserting the 'dog' value is remaining for the same row
        await expect(tableRow.locator('td input[id="1"]')).toHaveValue('dog')
    });

    test('Test Case 3: Pet type name is required validation', async ({page}) => {
        //Creating locator for targeted table rows that is going to be edited
        const tableRow = page.getByRole('row', { name: 'lizard Edit Delete' })
        await tableRow.getByRole('button').first().click()
        //Clearing input field
        const nameInputField = page.getByRole('textbox')
        await nameInputField.click()
        await nameInputField.clear()
        //Extracting a text from a locator for an error message and asserting the text of an error message to be presented
        const errorMessage = page.locator('.help-block')
        await expect(errorMessage).toBeVisible()
        await expect(errorMessage).toHaveText('Name is required')
        //Click on the 'Update' button and making an assertion that "Edit Pet Type" page is still displayed
        await page.getByRole('button', {name: "Update"}).click()
        await expect(page.locator('h2')).toHaveText('Edit Pet Type')
        //Clicking the 'Cancel' button
        await page.getByRole('button', {name: "Cancel"}).click()
        //Making an assertion that the 'Pet Types' page is displayed
        await expect(page.locator('h2')).toHaveText('Pet Types')
    });
})