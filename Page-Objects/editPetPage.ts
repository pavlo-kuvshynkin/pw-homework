import {Page, expect, Locator} from '@playwright/test'

export class EditPetPage {

    readonly page: Page
    petType: string = ''
    
    constructor(page: Page){
        this.page = page
    }

    async validatePrefilledPetDetailsAreMatchingTheDetailsFromOwnersInformationPage(ownerFullName: string, expectedPetName: string, expectedPetBirthDate: string, expectedPetType: string){
        //1. Validate owner full name value
        await expect(this.page.locator('#owner_name')).toHaveValue(ownerFullName)
        //2. Validate Pet Name value
        await expect(this.page.getByLabel('Name')).toHaveValue(expectedPetName)
        //3. Validate Pet birth date
        await expect(this.page.locator('input[name="birthDate"]')).toHaveValue(expectedPetBirthDate.replaceAll(/-/g, '/')) 
        //4. Validate Pet Type
        await expect(this.page.locator('#type1')).toHaveValue(expectedPetType)
    }

    async validateAllPetTypesAreDisplayedInTheDropDown(expectedPetTypes: string[]){
        //1. Get all options from the drop-down menu
        const petTypeDropDown = this.page.getByLabel('Type')
        const allPetTypes = await petTypeDropDown.locator('option').allTextContents()
        //2. Assert that all expected pet types are present in the drop-down menu
        expect(allPetTypes).toEqual(expect.arrayContaining(expectedPetTypes))
    }

    async selectPetTypeAndClickUpdateToSavePetDetails(petType: string){
        await this.page.getByLabel('Type').click()
        await this.page.locator('select').selectOption(petType)
        //2. Click "Save Pet" button
        await this.page.getByRole('button', {name: "Update Pet"}).click()
        //Store pet type for assertion in the test
        this.petType = petType
    }
}