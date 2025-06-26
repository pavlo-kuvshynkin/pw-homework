import {Page, expect, Locator} from '@playwright/test'
import {} from '../Page-Objects/ownersPage'

export class OwnerInformationPage {

    readonly page: Page
    descriptions: string[]
    petName: string = ''
    petBirthDate: string = ''
    petType: string = ''
    
    constructor(page: Page){
        this.page = page
    }

    async validateOwnerPhoneAndPetNameIsDisplayedGoBackToOwnersPage(phoneNumber: string, petName: string){
        //1. On the Owner Information page, assert "Telephone" value
        await expect(this.page.locator('table tr', {hasText: "Telephone"})).toContainText(phoneNumber)
        //2. Assert that Pet Name in the Owner Information card matches the name extracted from the page on the step 2
        await expect(this.page.locator('app-pet-list td dd').first()).toHaveText(petName.trim())
        //3. Returning to the owners page
        await this.page.getByRole('button', {name: "Back"}).click()
    }

    async goToAddANewPet(){
        //1. On the Owner Information page, assert that "Telephone" value in the Owner Information card is "6085552765"
        await this.page.getByRole('button', {name: 'Add New Pet'}).click()
        //2. Assert that the title the 'Add Pet' is displayed
        await expect(this.page.getByRole('heading', {name: "Add Pet"})).toBeVisible()
    }

    async goToAddANewVisitForTargetedPetAndValidatePetDetailsOnTheAddVisitPage(petName: string, ownerFullname: string){
        //1. Locate the pet by a name
        await this.getTargetedPetDetailsTableByName(petName).getByRole('button', {name: "Add Visit"}).click()
        //2. Assert that the title the 'New Visit' is displayed
        await expect(this.page.getByRole('heading', {name: "New Visit"})).toBeVisible()
        //5. Assert that pet name is "Samantha" and owner name is "Jean Coleman"
        await expect(this.page.locator('.table-striped td').first()).toHaveText(petName)
        await expect(this.page.locator('.table-striped td').last()).toHaveText(ownerFullname)
    }

    async validateNewPetHasCorrespondingDetails(petName: string, petBirthDate: string, petType: string){
        //1. On the Owner Information page, assert that newly created pet has details specified on the add new pet page
        const targetedPetDetailsTable = this.getTargetedPetDetailsTableByName(petName)
        const targetedPetInfoRows = targetedPetDetailsTable.locator('dd')
        await expect(targetedPetInfoRows.nth(0)).toHaveText(petName)
        await expect(targetedPetInfoRows.nth(1)).toHaveText(petBirthDate)
        await expect(targetedPetInfoRows.nth(2)).toHaveText(petType)
    }

    async deleteTargetedPetAndValidateTheWasRemovedFromTheList(petName: string){
        //1. Click "Delete Pet" button the for the new pet "Tom"
        const targetedPetDetailsTable = this.getTargetedPetDetailsTableByName(petName)
        await targetedPetDetailsTable.getByRole('button', {name: "Delete Pet"}).click()
        //2. Assert that "Tom" does not exist in the list of pets anymore
        await expect(targetedPetDetailsTable).not.toBeVisible()
    }

    async getTargetedPetsVisitByDescriptionAndValidateVisitDate(petName: string, description: string, expectedVisitDate: string){
        //1. Locate a targeted Pet and get a visit by description
        const petVisitTableRowByDescription = this.getTargetedPetDetailsTableByName(petName).locator('.table-condensed tr', {hasText: description})
        //2. Located and assert that specified visit date is present in the table of visits for the targeted pet
        await expect(petVisitTableRowByDescription.locator('td').first()).toHaveText(expectedVisitDate)
    }

    async validateVisitDatesAreInChronologicalOrder(petName: string){
        //1. On the Owner Information page, assert that visits are displayed in chronological order
        const petVisitDates = await this.getTargetedPetDetailsTableByName(petName).locator('app-visit-list td').allTextContents()
        const sortedDates = [...petVisitDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        expect(petVisitDates).toEqual(sortedDates)
    }

    async deleteVisitsForTargetedPetByDescriptionAndValidateTheyAreRemovedFromTheTable(petName: string, descriptions: string[]){
        //1. Get targeted Pet details table by name and locate the visits table
        const targetedPetDetailsTable = this.getTargetedPetDetailsTableByName(petName)
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

    async navigateToEditATargetedPet(petName: string){
        //1. Locate the targeted pet by name and click on the "Edit Pet" button
        await this.getTargetedPetDetailsTableByName(petName).getByRole('button', {name: "Edit Pet"}).click()
        //2. Assert that the title 'Edit Pet' is displayed on the loaded page
        await expect(this.page.getByRole('heading')).toHaveText("Pet") 
    }

    async extractTargetedPetDetails(petName: string){
        const targetedPetDetailsTable = this.getTargetedPetDetailsTableByName(petName)
        //Extracting targeted pet details from the table
        this.petName = await targetedPetDetailsTable.locator('dd').nth(0).innerText()
        this.petBirthDate = await targetedPetDetailsTable.locator('dd').nth(1).innerText()
        this.petType = await targetedPetDetailsTable.locator('dd').nth(2).innerText()
    }

    private getTargetedPetDetailsTableByName(petName: string): Locator {
        return this.page.locator('app-pet-list', {hasText: petName})
    }
}