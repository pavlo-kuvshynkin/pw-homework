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
        await expect(page.getByRole('row', {name: "Madison"})).toHaveCount(4)
    });

    test('TC 3: Validate search by Last Name', async ({page}) => {
        //2.  In the "Last name" input field, type the last name "Black" and click the "Find Owner" button
        const ownerLastNames = ["Black", "Davis", "Es", "Playwright"]
        //Creating a loop to search for values from an 'ownerLastNames' array
        for(let ownerLastName of ownerLastNames){
            const lastNameInputField = page.getByRole('textbox')
            const findOwnerButton = page.getByRole('button', {name:"Find Owner"})
            await lastNameInputField.fill(ownerLastName)
            await findOwnerButton.click()
            await page.waitForResponse(response => response.url().includes('/petclinic/api/owners') && response.status() === 200)
            const targetedTableRows = page.locator('tbody tr')
        //3. Assert that the displayed owner in the table has a last name indicated in an array.
            for(let row of await targetedTableRows.all()){
                const ownerNameCellValue = await row.locator('.ownerFullName').textContent() //The locator is incorrect for some reason

                if(ownerLastName == "Playwright"){
                    await expect(page.getByText('No owners with LastName starting with')).toContainText(`No owners with LastName starting with "${ownerLastName}"`)
                }
                else{
                    expect(ownerNameCellValue).toContain(ownerLastName)
                }
            }
        }
    });

    test('TC 4: Validate phone number and pet name on the Owner Information page', async ({page}) => {
        //2. Locate the owner by the phone number "6085552765". Extract the Pet name displayed in the table for the owner and saving it to a const. Then click on this owner.
        const rowByOwnerPhoneNumber = page.getByRole('row', {name: "6085552765"})
        const targetOwnerPetName = await rowByOwnerPhoneNumber.locator('td').nth(4).innerText()
        await rowByOwnerPhoneNumber.getByRole('link').click()
        //3. On the Owner Information page, assert that "Telephone" value in the Owner Information card is "6085552765"
        await expect(page.locator('table tr', {hasText: "Telephone"})).toContainText('6085552765')
        //4. Assert that Pet Name in the Owner Information card matches the name extracted from the page on the step 2
        const petNameOnTheOwnerInformationPage = page.locator('app-pet-list td dd')
        await expect(petNameOnTheOwnerInformationPage.first()).toHaveText(targetOwnerPetName.trim())
    });

    test('TC 5: Validate pets of the Madison city', async ({page}) => {
        await page.waitForResponse(response => response.url().includes('/petclinic/api/owners') && response.status() === 200)
        //2. On the Owners page, assert that rows with Madison city have a list of pets: Leo, George, Mulligan, Freddy 
        //Locate all rows with a city "Madison"
        const allMadisonRows = page.getByRole('row', {name: "Madison"})
        //Create an empty array to extract and put pet names
        let madisonPetNames: string[] = []
        //Loop through each row and extract the pet name
        for (let row of await allMadisonRows.all()) {
            const petNamesOfEachMadisonRow = await row.locator('td').last().textContent()
            madisonPetNames.push(petNamesOfEachMadisonRow!.trim()) //Putting the pet name to the array
        }
        //Assert that the collected pet names match the expected values in an array
        expect(madisonPetNames).toEqual(expect.arrayContaining(['Leo', 'George', 'Mulligan', 'Freddy']))
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
        const targetedSpecialtyField = page.locator('tbody tr').filter({has: page.locator('[id="1"]')})
        await targetedSpecialtyField.getByRole('button', { name: 'Edit'}).click()
        //6. Assert that "Specialties" header displayed above the table
        await expect(page.locator('h2')).toHaveText('Edit Specialty')
        //7. Update the specialty from "surgery" to "dermatology" and click "Update" button
        const specialtyNameInputField = page.getByRole('textbox')
        await specialtyNameInputField.click()
        await specialtyNameInputField.fill('dermatology')
        await page.getByRole('button', {name: "Update"}).click()
        //8. Assert that "surgery" was changed to "dermatology" in the list of specialties
        await expect(targetedSpecialtyField.locator('[id="1"]')).toHaveValue('dermatology')
        //9. Select the VETERINARIANS menu item in the navigation bar, then select "All"
        await page.getByRole('button', {name: "Veterinarians"}).click()
        await page.getByRole('link', { name: "All" }).click()
        //10. On the Veterinarians page, assert that "Rafael Ortega" has specialty "dermatology"
        await expect(rowOfRafaelOrtega.locator('td').nth(1)).toHaveText('dermatology')
        //11. Navigate to SPECIALTIES page, revert the changes renaming "dermatology" back to "surgery"
        await page.getByRole('link', {name:"Specialties"}).click()
        await targetedSpecialtyField.getByRole('button', { name: "Edit"}).click()
        await specialtyNameInputField.click()
        await specialtyNameInputField.fill("surgery")
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
        await expect(page.locator('tbody tr').nth(3)).toBeVisible()
        //3. Extract all values of specialties and put them into the array
        let specialtyNameTableRows: string[] = []
        const specialtyRows = page.locator('tbody tr')
        
        for(let row of await specialtyRows.all()){
            const rowValue = await row.locator('input').inputValue()
            specialtyNameTableRows.push(rowValue!.trim())
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
        let dropdownSpecialtyNames: string[] = []
        const specialtyOptions = page.locator('.dropdown-content label')
        
        for(let option of await specialtyOptions.all()){
            const specialtyValue = await option.textContent()
            dropdownSpecialtyNames.push(specialtyValue!.trim())
        }
        //7. Assert that array of specialties collected in the step 3 is equal the the array from drop-down menu
        expect(specialtyNameTableRows).toEqual(expect.arrayContaining(dropdownSpecialtyNames))
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