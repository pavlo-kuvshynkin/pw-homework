import { test, expect } from '@playwright/test';

test.describe('Web datepicker scenarios', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
        // 1. Click the 'Owners' button from nav bar and select 'Search.
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
    })

    test('TC 1: Select the desired date in the calendar', async ({page}) => {
        //2. In the list of the Owners, locate the owner by the name "Harold Davis" and select this owner
        await page.getByRole('link', {name: "Harold Davis"}).click()
        //3. On the Owner Information page, select "Add New Pet" button
        await page.getByRole('button', {name: 'Add New Pet'}).click()
        //4. In the Name field, type any new pet name "Tom"
        const nameInputFieldSection = page.locator('.has-feedback', {has: page.getByLabel('Name')})
        await nameInputFieldSection.getByRole('textbox', {name: 'name'}).fill("Tom")
        //5. Assert that an icon in the input field changed from "remove" to "ok"
        await expect(nameInputFieldSection.locator('span')).toHaveClass('glyphicon form-control-feedback glyphicon-ok')
        //6. Click on the calendar icon for the "Birth Date" field
        await page.getByLabel('Open calendar').click()
        //7. Using calendar selector, select the date "May 2nd, 2014"
        await page.getByLabel('Choose month and year').click()
        await page.getByLabel('Previous 24 years').click()
        await page.getByLabel('2014').click()
        await page.getByText('MAY').click()
        await page.getByText('2', {exact: true}).click()
        //8. Assert the input field is in the format "2014/05/02"
        await expect(page.locator('input[name="birthDate"]')).toHaveValue("2014/05/02")
        //9. Select the type of pet "dog" and click "Save Pet" button
        await page.getByLabel('Type').click()
        await page.locator('select').selectOption('dog')
        await page.getByRole('button', {name: "Save Pet"}).click()
        //10. On the Owner Information page, assert that newly created pet name is 'Tom', Birth Date is in the format "2014-05-02", Type is dog
        const targetedPetDetailsTable = page.locator('app-pet-list', {hasText: "Tom"})
        const targetedPetInfoRows = targetedPetDetailsTable.locator('dd')
        await expect(targetedPetInfoRows.nth(0)).toHaveText('Tom')
        await expect(targetedPetInfoRows.nth(1)).toHaveText("2014-05-02")
        await expect(targetedPetInfoRows.nth(2)).toHaveText('dog')
        //11. Click "Delete Pet" button the for the new pet "Tom"
        await targetedPetDetailsTable.getByRole('button', {name: "Delete Pet"}).click()
        //12. Assert that "Tom" does not exist in the list of pets anymore
        await expect(targetedPetDetailsTable).not.toBeVisible()
    })

    test('TC 2: Select the dates of visits and validate dates order', async ({page}) => {
        //2. In the list of the Owners, locate the owner by the name "Jean Coleman" and select this owner
        await page.getByRole('link', {name: "Jean Coleman"}).click()
        //3. In the list of pets, locate the pet with a name "Samantha" and click "Add Visit" button
        const petSamanthaProfile = page.locator('app-pet-list', {hasText: "Samantha"})
        await petSamanthaProfile.getByRole('button', {name: "Add Visit"}).click()
        //4. Assert that "New Visit" is displayed as header of the page
        await expect(page.locator('h2')).toHaveText('New Visit')
        //5. Assert that pet name is "Samantha" and owner name is "Jean Coleman"
        await expect(page.locator('.table-striped td').first()).toHaveText("Samantha")
        await expect(page.locator('.table-striped td').last()).toHaveText("Jean Coleman")
        //6. Click on the calendar icon and select the current date in date picker
        await page.getByLabel('Open calendar').click()
        //Getting current date
        let date = new Date()
        date.setDate(date.getDate())
        //Making date format output to be asserted
        //let expectedDayForSelection = date.getDate().toString()
        const expectedDate = date.toLocaleString('En-US', {day: '2-digit'})
        const expectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedYear}/${expectedMonth}/${expectedDate}`
        //Select current date in the datepicker
        await page.getByText(expectedDate, {exact: true}).click()
        //7. Assert that selected date is displayed and it is in the format "YYYY/MM/DD"
        await expect(page.locator('input[name="date"]')).toHaveValue(dateToAssert)
        //8. Type the description in the field, for example, "dermatologists visit" and click "Add Visit" button
        await page.locator('#description').fill("dermatologists visit")
        await page.getByRole('button', {name: 'Add Visit'}).click()
        //9. Assert that selected date of visit is displayed at the top of the list of visits for "Samantha" pet on the "Owner Information" page and is in the format "YYYY-MM-DD"
        const birthDateToAssertOnTheOwnerInformationPage = `${expectedYear}-${expectedMonth}-${expectedDate}`
        const allPetVisitsTableRows = petSamanthaProfile.locator('.table-condensed tr')
        await expect(allPetVisitsTableRows.locator('td').first()).toHaveText(birthDateToAssertOnTheOwnerInformationPage)
        //10. Add one more visit for "Samantha" pet by clicking "Add Visit" button
        await petSamanthaProfile.getByRole('button', {name: "Add Visit"}).click()
        //11. Click on the calendar icon and select the date which is 45 days back from the current date
        await page.getByLabel('Open calendar').click()
        //Set date to be 45 days back from the current date
        date.setDate(date.getDate() - 45)
        // Recalculate expected month and year
        const expectedDay2ndVisit = date.getDate().toString()
        const expectedMonth2ndVisit = date.toLocaleString('En-US', {month : '2-digit'})
        const expectedYear2ndVisit = date.getFullYear()
        const expectedMonthAndYear2ndVisit = `${expectedMonth2ndVisit} ${expectedYear2ndVisit}`
        // Ensure the correct month is selected in the calendar
        let calendarMonthAndYear = await page.locator('.mat-calendar-period-button').innerText()
        // Create a loop to select a date 45 days back from the current date 
        while(!calendarMonthAndYear.includes(expectedMonthAndYear2ndVisit)){
            await page.getByLabel('Previous month').click()
            calendarMonthAndYear = await page.getByLabel('Choose month and year').innerText()
        }
        await page.getByText(expectedDay2ndVisit, {exact: true}).click()
        //12. Type the description in the field, for example, "massage therapy" and click "Add Visit" button
        await page.locator('#description').fill("massage therapy")
        await page.getByRole('button', {name: 'Add Visit'}).click()
        //13. Assert that date added at step 11 is in chronological order in relation to the previous dates for "Samantha" pet on the "Owner Information" page. The date of visit above this date in the table should be greater
        const firstVisitsDateText = await allPetVisitsTableRows.filter({hasText: "dermatologists visit"}).locator('td').first(). innerText()
        const secondVisitsDateText = await allPetVisitsTableRows.filter({hasText: "massage therapy"}).locator('td').first().innerText()
        // Converting date strings into a date type before for assertion
        const firstVisitDate = new Date(firstVisitsDateText)
        const secondVisitDate = new Date(secondVisitsDateText)
        // Asserting that first visit date is earlier than second visit date
        expect(firstVisitDate > secondVisitDate).toBeTruthy()
        //14. Select the "Delete Visit" button for both newly created visits
        await allPetVisitsTableRows.filter({hasText: "dermatologists visit"}).getByRole('button', {name: "Delete Visit"}).click()
        await allPetVisitsTableRows.filter({hasText: "massage therapy"}).getByRole('button', {name: "Delete Visit"}).click()
        //15. Assertions that deleted visits are no longer displayed in the table on "Owner Information" page
        await expect(petSamanthaProfile.locator('app-visit-list')).not.toContainText("dermatologists visit")
        await expect(petSamanthaProfile.locator('app-visit-list')).not.toContainText("massage therapy")
    })
})