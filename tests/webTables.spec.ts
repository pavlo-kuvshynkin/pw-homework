import { test, expect } from '@playwright/test';

test.describe('Web tables of Owners', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
        // 1. Click the 'Owners' button from nav bar and select 'Search.
        await page.getByRole('button', { name: 'Owners' }).click()
        await page.getByRole('link', { name: 'Search' }).click()
    });

    test('TC 1: Validate the pet name city of the owner', async ({page}) => {
        //2. Locate the owner by the name "Jeff Black". Add the assertions that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
        const targetedRowJeffBlack = page.getByRole('row', {name: 'Jeff Black'})
        await expect(targetedRowJeffBlack.locator('td').nth(2)).toHaveText('Monona')
        await expect(targetedRowJeffBlack.locator('td').nth(4)).toHaveText('Lucky')
    });

    test('TC 2: Validate owners count of the Madison city', async ({page}) => {
        //2. Locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
        await expect(page.getByRole('row', {name: "Madison"}).filter({has: page.locator('td').nth(2).getByText('Madison')})).toHaveCount(4)
    });

    test('TC 3: Validate search by Last Name', async ({page}) => {
        //2.  In the "Last name" input field, type the last name "Black" and click the "Find Owner" button
        const lastNameInputField = page.getByRole('textbox')
        const findOwnerButton = page.getByRole('button', {name:"Find Owner"})
        await lastNameInputField.fill('Black')
        await findOwnerButton.click()
        //3. Assert that the displayed owner in the table has a last name "Black"
        const lastNameCellOfTheTableRows = page.locator('tbody tr td.ownerFullName')
        await page.waitForTimeout(2000)
        await expect(lastNameCellOfTheTableRows).toContainText('Black')
        //4. In the "Last name" input field, type the last name "Davis" and click the "Find Owner" button
        await lastNameInputField.fill('Davis')
        await findOwnerButton.click()
        //5. Assert that each owner displayed in the table has a last name "Davis"
        await page.waitForTimeout(2000)
        //Creating a const that will collect all rows first cell texts
        let firstCellTexts = await lastNameCellOfTheTableRows.allTextContents() //Extract and validate only the last names from the first cell of each row
        let lastNames = firstCellTexts.map((text) => text.trim().split(' ').pop()) // Trim and extract last name
        expect(lastNames).toEqual(lastNames.map(() => 'Davis'))
        //6. In the "Last name" input field, type the partial match for the last name "Es" and click the "Find Owner" button
        await lastNameInputField.fill("Es")
        await findOwnerButton.click()
        //7. Assert that each owner displayed in the table has a last name containing "Es"
        await page.waitForTimeout(2000)
        firstCellTexts = await lastNameCellOfTheTableRows.allTextContents() // Re-fetch rows
        lastNames = firstCellTexts.map((text) => text.trim().split(' ').pop()) // Extract updated last names
        lastNames.forEach((lastName) => {
            expect(lastName).toContain('Es')
        });
        //8. In the "Last name" input field, type the last name "Playwright" click the "Find Owner" button
        await lastNameInputField.fill('Playwright')
        await findOwnerButton.click()
        //9. Assert that the message "No owners with LastName starting with "Playwright" is presented
        await expect(page.getByText('No owners with LastName')).toContainText('No owners with LastName')
    });

    test('TC 4: Validate phone number and pet name on the Owner Information page', async ({page}) => {
        //2. Locate the owner by the phone number "6085552765". Extract the Pet name displayed in the table for the owner and saving it to a const. Then click on this owner.
        const rowByOwnerPhoneNumber = page.locator('tbody tr', {hasText: "6085552765"})
        const targetOwnerPetName = await rowByOwnerPhoneNumber.locator('td').nth(4).textContent()
        await rowByOwnerPhoneNumber.getByRole('link').click()
        //3. On the Owner Information page, assert that "Telephone" value in the Owner Information card is "6085552765"
        await expect(page.locator('table tr', {hasText: "Telephone"})).toContainText('6085552765')
        //4. Assert that Pet Name in the Owner Information card matches the name extracted from the page on the step 2
        const petNameOnTheOwnerInformationPage = await page.locator('app-pet-list td dd').first().innerText()
        expect(petNameOnTheOwnerInformationPage.trim()).toEqual(targetOwnerPetName?.trim())
    });

    test('TC 5: Validate pets of the Madison city', async ({page}) => {
        //2. On the Owners page, assert that rows with Madison city have a list of pets: Leo, George, Mulligan, Freddy 
        await page.waitForTimeout(2500)
        const madisonRows = page.getByRole('row', {name: "Madison"})
        //Create an empty array to store pet names
        const madisonPetNames: string[] = []
        //Get the number of rows with "Madison"
        const rowCount = await madisonRows.count()
        //Loop through each row and extract the pet name
        for (let i = 0; i < rowCount; i++) {
            const petName = await madisonRows.nth(i).locator('td:nth-child(5)').textContent()
            if(petName) {
                madisonPetNames.push(petName.trim()) // Add the pet name to the array
            }
        }
        //Assert that the collected pet names match the expected list directly
        expect(madisonPetNames).toEqual(['Leo', 'George', 'Mulligan', 'Freddy'])
        console.log('Pets associated with Madison:', madisonPetNames)
    });
});

test.describe('Web tables of Veterinarians', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
    })

    test('TC 1: Validate the pet name city of the owner', async ({page}) => {
        // 1. Click the 'Veterinarians' button from nav bar and select 'All'
        await page.getByRole('button', {name: "Veterinarians"}).click()
        await page.getByRole('link', { name: "All" }).click()
        //2. On the Veterinarians page, assert that "Rafael Ortega" has specialty "surgery"
        const rowOfRafaelOrtega = page.getByRole('row', {name: "Rafael Ortega"})
        await expect(rowOfRafaelOrtega.locator('td').nth(1)).toHaveText('surgery')
        //3. Select the SPECIALTIES menu item in the navigation bar
        await page.getByRole('link', {name:"Specialties"}).click()
        //4. Assert that "Specialties" header displayed above the table
        await expect(page.locator('h2')).toHaveText('Specialties')
        //5. Click on "Edit" button for the "surgery" specialty
        await page.getByRole('row', {name: "surgery"}).getByRole('button', { name: 'Edit'}).click()
        //6. Assert that "Specialties" header displayed above the table
        await expect(page.locator('h2')).toHaveText('Edit Specialty')
        //7. Update the specialty from "surgery" to "dermatology" and click "Update" button
        const specialtyInputField = page.getByRole('textbox')
        await specialtyInputField.click()
        await specialtyInputField.fill('dermatology')
        await page.getByRole('button', {name: "Update"}).click()
        //8. Assert that "surgery" was changed to "dermatology" in the list of specialties
        await expect(page.getByRole('row', {name: "dermatology"}).locator('input')).toHaveValue('dermatology')
        //9. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', {name: "Veterinarians"}).click()
        await page.getByRole('link', { name: "All" }).click()
        //10. On the Veterinarians page, assert that "Rafael Ortega" has specialty "dermatology"
        await expect(rowOfRafaelOrtega.locator('td').nth(1)).toHaveText('dermatology')
        //11. Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
        await page.getByRole('link', {name:"Specialties"}).click()
        await page.getByRole('row', {name: "dermatology"}).getByRole('button', { name: "Edit"}).click()
        await specialtyInputField.click()
        await specialtyInputField.fill("surgery")
        await page.getByRole('button', {name: "Update"}).click()
    })

    test('TC 2: Validate specialty lists', async ({page}) => {
        //1. Click the 'Veterinarians' button from nav bar and select 'All'
        await page.getByRole('link', {name:"Specialties"}).click()
        //2. On the Specialties page, select "Add" button. Type the new specialty "oncology" and click "Save" button
        await page.getByRole('button', {name: "Add"}).click()
        const addNewSpecialty = page.locator('form .form-group')
        await addNewSpecialty.getByRole('textbox').fill("oncology")
        await addNewSpecialty.getByRole('button', {name: "Save"}).click()
        await page.waitForTimeout(500)
        //3. Extract all values of specialties and put them into the array
        const specialtyNameTableRows: string[] = []
        const specialtyRows = page.locator('tbody tr input')
        const rowCount = await specialtyRows.count()
        for(let i = 0; i < rowCount; i++){
            const rowValue = await specialtyRows.nth(i).inputValue()
            if(rowValue){
                specialtyNameTableRows.push(rowValue.trim())
            }
            console.log('Specialties in Table:', specialtyNameTableRows)
        }
        //4. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', {name: "Veterinarians"}).click()
        await page.getByRole('link', { name: "All" }).click()
        //5. On the Veterinarians page, locate the "Sharon Jenkins" in the list and click "Edit" button
        const rowOfRafaelOrtega = page.getByRole('row', {name: "Sharon Jenkins"})
        await rowOfRafaelOrtega.getByRole('button', {name: "Edit Vet"}).click()
        //6. Click on the Specialties drop-down menu. Extract all values from the drop-down menu to an array
        await page.locator('.dropdown-display').click()
        //Extracting all values
        const dropdownSpecialtyNames: string[] = []
        const specialtyOptions = page.locator('.dropdown-content label')
        const specialtyCount = await specialtyOptions.count()
        for(let i = 0; i < specialtyCount; i++){
            const specialtyValue = await specialtyOptions.nth(i).textContent()
            if(specialtyValue){
                dropdownSpecialtyNames.push(specialtyValue.trim())
            }
        }
        console.log('Specialties in Dropdown:', dropdownSpecialtyNames)
        //7. Assert that array of specialties collected in the step 3 is equal the the array from drop-down menu
        expect(specialtyNameTableRows).toEqual(dropdownSpecialtyNames)
        //8. Select the "oncology" specialty and click "Save vet" button
        await page.getByRole('checkbox', {name:"oncology"}).click()
        await page.locator('.dropdown-display').click() //To close dropdown menu
        await page.getByRole('button', {name: "Save vet"}).click()
        //9. On the Veterinarians page, assert that "Sharon Jenkins" has specialty "oncology"
        await expect(rowOfRafaelOrtega.locator('td').nth(1)).toHaveText('oncology')
        //10. Navigate to SPECIALTIES page. Click "Delete" for "oncology" specialty
        await page.getByRole('link', {name:"Specialties"}).click()
        await page.getByRole('row', {name: "oncology"}).getByRole('button', {name: "Delete"}).click()
        //11. Navigate to VETERINARIANS page. Assert that "Sharon Jenkins" has no specialty assigned
        await page.getByRole('button', {name: "Veterinarians"}).click()
        await page.getByRole('link', { name: "All" }).click()
        await expect(rowOfRafaelOrtega.locator('td').nth(1)).toBeEmpty()
    })
})