import {Page, expect, Locator} from '@playwright/test'
import {} from '../Page-Objects/ownersPage'

export class OwnerInformationPage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async validateOwnerPhoneAndPetNameIsDisplayedGoBackToOwnersPage(phoneNumber: string, petName: string){
        //1. On the Owner Information page, assert "Telephone" value
        await expect(this.page.locator('table tr', {hasText: "Telephone"})).toContainText(phoneNumber)
        //2. Assert that Pet Name in the Owner Information card matches the name extracted from the page on the step 2
        await expect(this.page.locator('app-pet-list td dd').first()).toHaveText(petName.trim())
        //Returning to the owners page through navigation in test
    }

    async clickOnAddNewPetButton(){
        //1. On the Owner Information page, assert that "Telephone" value in the Owner Information card is "6085552765"
        await this.page.getByRole('button', {name: 'Add New Pet'}).click()
        //2. Assert that the title the 'Add Pet' is displayed
        await expect(this.page.getByRole('heading', {name: "Add Pet"})).toBeVisible()
    }

    async clickAddNewVisitButtonForATargetedPet(petName: string){
        //1. Locate the pet by a name
        await this.page.locator('app-pet-list', {hasText: petName}).getByRole('button', {name: "Add Visit"}).click()
        //2. Assert that the title the 'New Visit' is displayed
        await expect(this.page.getByRole('heading', {name: "New Visit"})).toBeVisible()
    }

    async validatePetDetailsForPet(petName: string, petBirthDate: string, petType: string){
        //1. On the Owner Information page, assert that newly created pet has details specified on the add new pet page
        const targetedPetDetailsTable = this.page.locator('app-pet-list', {hasText: petName})
        const petDetailsRows = targetedPetDetailsTable.locator('dd')
        //2. Assert pet birth date and pet type
        await expect(petDetailsRows.nth(1)).toHaveText(petBirthDate)
        await expect(petDetailsRows.nth(2)).toHaveText(petType)
    }

    async deleteTargetedPetAndValidateTheWasRemovedFromTheList(petName: string){
        //1. Click "Delete Pet" button the for the new pet "Tom"
        const targetedPetDetailsTable = this.page.locator('app-pet-list', {hasText: petName})
        await targetedPetDetailsTable.getByRole('button', {name: "Delete Pet"}).click()
        //2. Assert that "Tom" does not exist in the list of pets anymore
        await expect(targetedPetDetailsTable).not.toBeVisible()
    }

    async getTargetedPetsVisitByDescriptionAndValidateVisitDate(petName: string, description: string, expectedVisitDate: string){
        //1. Locate a targeted Pet and get a visit by description provided on the add new visit page
        const petVisitTableRowByDescription = this.page.locator('app-pet-list', {hasText: petName}).locator('.table-condensed tr', {hasText: description})
        //2. Located and assert that specified visit date is present in the table of visits for the targeted pet
        await expect(petVisitTableRowByDescription.locator('td').first()).toHaveText(expectedVisitDate)
    }

    async validateVisitDatesAreInChronologicalOrder(petName: string){
        //1. On the Owner Information page, assert that visits are displayed in chronological order
        const petVisitDates = await this.page.locator('app-pet-list', {hasText: petName}).locator('app-visit-list td').allTextContents()
        const sortedDates = [...petVisitDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        expect(petVisitDates).toEqual(sortedDates)
    }

    async deleteVisitsForTargetedPetByDescriptionAndValidateTheyAreRemovedFromTheTable(petName: string, descriptions: string[]){
        //1. Get targeted Pet details table by name and locate the visits table
        const targetedPetDetailsTable = this.page.locator('app-pet-list', {hasText: petName})
        const allPetVisitsTableRows = await targetedPetDetailsTable.locator('.table-condensed tr').all()
        //2. Loop through each table row of visits and click Delete button for the visit that matches the specified descriptions
        for (let row of allPetVisitsTableRows.slice(1)){
            const visitDescriptionText = await row.locator('td').nth(1).textContent()
            if (descriptions.includes(visitDescriptionText!.trim())){
                await row.getByRole('button', {name: "Delete Visit"}).click()
            }
            else{
                break
        }
        //3. Assert that deleted visits are not displayed in the table
        await expect(targetedPetDetailsTable).not.toContainText(descriptions)
        }
    }

    async clickEditPetButtonForATargetedPet(petName: string){
        //1. Locate the targeted pet by name and click on the "Edit Pet" button
        await this.page.locator('app-pet-list', {hasText: petName}).getByRole('button', {name: "Edit Pet"}).click()
        //2. Assert that the title 'Edit Pet' is displayed on the loaded page
        await expect(this.page.getByRole('heading')).toHaveText("Pet")
    }

    async getPetDetails(petName: string){
        //1. Locate the targeted pet by name and store all the details
        const targetedPetDetailsTable = this.page.locator('app-pet-list', {hasText: petName})
        let petDetails: string [] = []
        //2. Extract the pet name, birth date, and type from the table and push into an array
        const petDetailsCell = await targetedPetDetailsTable.locator('dd').all()
        for (let cell of petDetailsCell) {
            const petDetail = await cell.innerText()
            petDetails.push(petDetail!)
        }
        //3. Return an array in order to validate the details in test
        return petDetails
    }

    async getOwnerDetails(){
        //1. Locate the owner details table by full name
        const ownerDetailsTable = this.page.getByRole('table').first()
        let ownerDetails: string[] = []
        //2. Extract the Owner Full Name, Address, City, and Phone Number from the table and push into an array
        const ownerDetailRows = await ownerDetailsTable.locator('tr').all()
        for (let tableRow of ownerDetailRows) {
            const cellContent = await tableRow.locator('td').innerText()
            ownerDetails.push(cellContent!)
        }
        //4. Return an array with owner details
        return ownerDetails
    }

    async validateOwnerDetailsFromOwnersPageAreDisplayed(ownerDetails: string[], ownerDetailsForAssertion: string[]){
        //Assert that extracted owner details from Owners page match the details extracted from the Owner Information page
        expect(ownerDetailsForAssertion).toEqual(expect.arrayContaining(ownerDetails))
    }
}