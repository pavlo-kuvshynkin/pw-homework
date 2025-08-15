import {Page, expect, Locator} from '@playwright/test'

export class OwnersPage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async validatePetNameAndCityOfTheOwner(ownerFullName: string, petName: string, ownerCity: string){
        //1. Locate the owner by the name "Jeff Black". Assert that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
        const targetedOwnerRow = this.page.getByRole('row', {name: ownerFullName})
        await expect(targetedOwnerRow.locator('td').nth(2)).toHaveText(ownerCity)
        await expect(targetedOwnerRow.locator('td').nth(4)).toHaveText(petName)
    }

    async validateTheCountOfOwnersThatHasMadisonCity(ownersCount: number){
        //Locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
        await expect(this.page.getByRole('row').filter({has: this.page.locator('td').nth(2).getByText('Madison')})).toHaveCount(ownersCount)
    }

    async getOwnerPetNameByOwnerPhoneNumber(phoneNumber: string){
        //1. Locate the owner by the phone number
        const rowByOwnerPhoneNumber = this.page.getByRole('row', {name: phoneNumber})
        //2. Extract the Pet name displayed in the table for the owner and saving it to a const
        const petNameOfTheOwner = await rowByOwnerPhoneNumber.locator('td').nth(4).innerText()
        //Return owner phone number for assertion in the test
        return petNameOfTheOwner
    }

    async selectOwnerByPhoneNumber(phoneNumber: string){
        //Locate the owner by phone number and click the link
        await this.page.getByRole('row', {name: phoneNumber}).getByRole('link').click()
        await expect(this.page.getByRole('heading', {name: "Owner Information"})).toBeVisible()
    }

    async validatePetsThatHasMadisonCity(extractedPetNames: string[]){
        //1. Locate all rows with a city "Madison"
        const allMadisonRows = this.page.getByRole('row').filter({has: this.page.locator('td').nth(2).getByText('Madison')})
        //2. Create an empty array to extract and put pet names
        let madisonPetNames: string[] = []
        //3. Loop through each row and extract the pet name
        for (let row of await allMadisonRows.all()) {
            const petNamesOfEachMadisonRow = await row.locator('td').last().textContent()
            madisonPetNames.push(petNamesOfEachMadisonRow!.trim()) //Putting the pet name to the array
        }
        //4. Assert that the collected pet names match the expected values in an array
        expect(madisonPetNames).toEqual(expect.arrayContaining(extractedPetNames))
    }

    async validateSearchByOwnersLastName(lastNames: string[]){
        //1. In the "Last name" input field, put the last name from an array and click the "Find Owner" button and the same for all last names
        const ownerLastNames = lastNames
        for (let ownerLastName of ownerLastNames) {
            await this.page.getByRole('textbox').fill(ownerLastName)
            await this.page.getByRole('button', { name: "Find Owner" }).click()
            if(ownerLastName !== "Playwright"){
                await this.page.waitForResponse('**/petclinic/api/owners*')
        //2. Assert each searched last name returns an owner with the same last name
                for (let row of await this.page.locator('.ownerFullName').all()){
                    await expect(row).toContainText(ownerLastName)
                }
            }
        //3. Assert that no existing last name returns an error message
            else {
                await expect(this.page.locator('.xd-container')).toContainText(`No owners with LastName starting with "${ownerLastName}"`)
            }
        }
    }

    async clickOnTheOwnerFullNameLink(ownerFullName: string){
        //1. Click on the owner full name and assert the header is "Owner Information"
        await this.page.getByRole('row', {name: ownerFullName}).getByRole('link', {name: ownerFullName}).click()
        await this.page.waitForResponse('**/petclinic/api/owners/**')
        await expect(this.page.getByRole('heading', {name: "Owner Information"})).toBeVisible()
    }

    async getDetailsForATargetedOwner(ownerFullName: string){
        //1. Locate the targeted owner by full name
        const targetedOwnerRow = this.page.getByRole('row', {name: ownerFullName})
        let ownerDetails: string[] = []
        //2. Extract the Owner Full Name, Address, City, and Phone Number from the table and push into an array
        const detailsTableCell = await targetedOwnerRow.getByRole('cell').all()
        for (let tableCell of detailsTableCell) {
            const cellContent = await tableCell.innerText()
            ownerDetails.push(cellContent!)
        }
        return ownerDetails
    }
}