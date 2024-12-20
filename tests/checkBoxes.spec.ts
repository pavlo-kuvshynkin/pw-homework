import { test, expect } from '@playwright/test'

test.describe('Checkboxes', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
        //1-2. Opening dropdown list and select 'All' option then validating 'Veterinarians' page is opened
        await page.getByRole('button', {name: "Veterinarians"}).click()
        await page.getByRole('link', {name: 'All'}).click()
        await expect(page.locator('h2')).toHaveText('Veterinarians')
    })

    test('Test Case 1: Validate selected specialties', async ({page}) => {
        //3. Locating targeted row and clicking 'Edit'
        await page.getByRole('row', {name: 'Helen Leary'}).getByRole('button', {name: 'Edit Vet'}).click()
        //4. Asserting specialties fields has value 'radiology'
        const specialtiesField = page.locator('.selected-specialties')
        await expect(specialtiesField).toHaveText('radiology')
        //5. Clicking specialties field to show up menu with checkboxes
        await specialtiesField.click()
        //6. Asserting 'radiology' is checked
        const radiologyBox = page.getByRole('checkbox', {name:'radiology'})
        await radiologyBox.check()
        expect(await radiologyBox.isChecked()).toBeTruthy()
        //7. Asserting 'surgery' & 'dentistry' are unchecked
        const surgeryBox = page.getByRole('checkbox', {name:'surgery'})
        expect(await surgeryBox.isChecked()).toBeFalsy()
        const dentistryBox = page.getByRole('checkbox', {name:'dentistry'})
        expect(await dentistryBox.isChecked()).toBeFalsy()
        //8. Check 'surgery' & uncheck 'radiology'
        await radiologyBox.uncheck()
        await surgeryBox.check()
        //9. Asserting specialties fields has value 'radiology'
        await expect(specialtiesField).toHaveText('surgery')
        //10. Check 'dentistry'
        await dentistryBox.check()
        //9. Asserting specialties fields has both values 'surgery, dentistry'
        await expect(specialtiesField).toHaveText('surgery, dentistry')
    })

    test('Test Case 2: Select all specialties', async ({page}) => {
        //2. Locating targeted row and clicking 'Edit'
        await page.getByRole('row', {name: 'Rafael Ortega'}).getByRole('button', {name: 'Edit Vet'}).click()
        //3. Asserting specialties fields has value 'radiology'
        const specialtiesField = page.locator('.selected-specialties')
        await expect(specialtiesField).toHaveText('surgery')
        //4. Clicking specialties field to show up menu with checkboxes
        await specialtiesField.click()
        //5. Checking all the checkboxes & asserting they are all checked
        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.check()
            expect(await box.isChecked()).toBeTruthy()
        }
        //6. Asserting all 3 specialties are filled in the field 
        await expect(specialtiesField).toHaveText('surgery, radiology, dentistry')
    })

    test('Test Case 3: Unselect all specialties', async ({page}) => {
        //2. Locating targeted row and clicking 'Edit'
        await page.getByRole('row', { name:'Linda Douglas'}).getByRole('button', {name: 'Edit Vet'}).click()
        //3. Asserting specialties fields has value 'radiology'
        const specialtiesField = page.locator('.selected-specialties')
        await expect(specialtiesField).toHaveText('dentistry, surgery')
        //4. Clicking specialties field to show up menu with checkboxes
        await specialtiesField.click()
        //5. Unchecking all the checkboxes & asserting they are all unchecked
        const allBoxes = page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.uncheck()
            expect(await box.isChecked()).toBeFalsy()
        }
        //6. Asserting there are no specialties filed
        await expect(specialtiesField).toBeEmpty()
    })
})