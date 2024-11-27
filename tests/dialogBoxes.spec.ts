import { test, expect } from '@playwright/test'

    test('TC: Add and delete Pet type', async ({page}) => {
        //1. Select the 'Pet Type' menu from navigation bar
        await page.goto('/')
        await page.getByTitle('pettypes').click()
        //2. Assert the "Pet Types" title displayed on the "Pet Types" page
        await expect(page.locator('h2')).toHaveText('Pet Types')
        //3. Click on "Add" button
        await page.getByRole('button', {name: "Add"}).click()
        //4. Assert the "New Pet Type" section title, "Name" header for the input field and the input field is visible
        const newPetTypeFieldSection = page.locator('app-pettype-add')
        await expect(newPetTypeFieldSection.locator('h2')).toHaveText('New Pet Type')
        await expect(newPetTypeFieldSection.locator('form')).toBeVisible()
        //5. Add a new pet type with the name "pig" and click "Save" button
        await newPetTypeFieldSection.getByRole('textbox').fill('pig')
        await newPetTypeFieldSection.getByRole('button').click()
        //6. Assert that the last item in the list of pet types has value of "pig"
        const petPigTableRow = page.getByRole('row', {name: "pig"})
        await expect(petPigTableRow.locator('input')).toHaveValue('pig')
            //7. Adding browser dialog listener before clicking delete and making an assertion to validate the message of the dialog box "Delete the pet type?"
        page.on('dialog', dialog => {
            expect(dialog.message()).toEqual('Delete the pet type?')
            //8. Click on OK button on the dialog box
            dialog.accept()
        })
        //7. Click on "Delete" button for the 'pig' pet
        await petPigTableRow.getByRole('button', {name: "Delete"}).click()
        //10. Add assertion, that the last item in the list of pet types is not the "pig"
        await expect(page.locator('tbody tr input').last()).not.toHaveValue('pig')
    })