import {Page, expect, Locator} from '@playwright/test'

export class OwnersPage {

    readonly page: Page
    petName: string = ''
    ownerPhoneNumber: string = ''
    ownerFullName: string = ''
    
    constructor(page: Page){
        this.page = page
    }

    async validatePetNameAndCityOfTheOwner(ownerName: string, petName: string, ownerCity: string){
        //2. Locate the owner by the name "Jeff Black". Assert that this owner is from the city of "Monona" and he has a pet with a name "Lucky"
        const targetedOwnerRow = this.getTargetedOwnerRowByName(ownerName)
        await expect(targetedOwnerRow.locator('td').nth(2)).toHaveText(ownerCity)
        await expect(targetedOwnerRow.locator('td').nth(4)).toHaveText(petName)
    }

    async validateTheCountOfOwnersThatHasMadisonCity(ownersCount: number){
        //Locate all owners who live in the city of "Madison". Add the assertion that the total number of owners should be 4
        await expect(this.page.getByRole('row').filter({has: this.page.locator('td').nth(2).getByText('Madison')})).toHaveCount(ownersCount)
    }

    async findingOwnerByPhoneNumberExtractingHisPetNameAndClickOwnerFullNameLink(phoneNumber: string){
        //1. Locate the owner by the phone number
        const rowByOwnerPhoneNumber = this.page.getByRole('row', {name: phoneNumber})
        //2. Extract the Pet name displayed in the table for the owner and saving it to a const
        this.petName = await rowByOwnerPhoneNumber.locator('td').nth(4).innerText()
        //3. Then click on this owner full name link
        this.ownerPhoneNumber = phoneNumber //Saving the phone number to the class variable in order to specify it in the test
        await rowByOwnerPhoneNumber.getByRole('link').click()
    }

    async validatePetsThatHasMadisonCity(extractedPetNames: string[]){
        await this.page.waitForResponse(response => response.url().includes('/petclinic/api/owners') && response.status() === 200)
        //1. On the Owners page, assert that rows with Madison city have a list of pets: Leo, George, Mulligan, Freddy 
        //Locate all rows with a city "Madison"
        const allMadisonRows = this.page.getByRole('row').filter({has: this.page.locator('td').nth(2).getByText('Madison')})
        //Create an empty array to extract and put pet names
        let madisonPetNames: string[] = []
        //Loop through each row and extract the pet name
        for (let row of await allMadisonRows.all()) {
            const petNamesOfEachMadisonRow = await row.locator('td').last().textContent()
            madisonPetNames.push(petNamesOfEachMadisonRow!.trim()) //Putting the pet name to the array
        }
        //2. Assert that the collected pet names match the expected values in an array
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
                for (let row of await this.page.locator('.ownerFullName').all()) {
                    await expect(row).toContainText(ownerLastName)
                }
            }
        //3. Assert that no existing last name returns an error message
            else {
                await expect(this.page.locator('.xd-container')).toContainText(`No owners with LastName starting with "${ownerLastName}"`)
            }
        }
    }

    async selectOwnerByName(ownerName: string){
        //Select the owner by the name and click on it
        const ownerRow = this.getTargetedOwnerRowByName(ownerName)
        await ownerRow.getByRole('link').click()
        //Store selected owner full name
        this.ownerFullName = await ownerRow.locator('td').first().innerText() //To be used for assertions on the Owner Information and Add new visit pages
    }

    private getTargetedOwnerRowByName(ownerName: string): Locator{
        return this.page.getByRole('row', {name: ownerName})
    }
}