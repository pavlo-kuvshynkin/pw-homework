import {Page, expect, Locator} from '@playwright/test'

export class EditPetPage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async validateInputFieldsValues(ownerFullName: string[], petDetails: string[]){
        //1. Validate owner full name value
        await expect(this.page.locator('#owner_name')).toHaveValue(ownerFullName[0])
        //2. Validate Pet Name value
        await expect(this.page.getByLabel('Name')).toHaveValue(petDetails[0])
        //3. Validate Pet birth date
        await expect(this.page.locator('input[name="birthDate"]')).toHaveValue(petDetails[1].replaceAll(/-/g, '/')) 
        //4. Validate Pet Type
        await expect(this.page.locator('#type1')).toHaveValue(petDetails[2])
    }

    async validateAllPetTypesAreDisplayedInTheDropDown(expectedPetTypes: string[]){
        //1. Get all options from the drop-down menu
        const petTypeDropDown = this.page.getByLabel('Type')
        const allPetTypes = await petTypeDropDown.locator('option').allTextContents()
        //2. Assert that all expected pet types are present in the drop-down menu
        expect(allPetTypes).toEqual(expect.arrayContaining(expectedPetTypes))
    }

    async selectPetTypeAndClickUpdatePetButton(petType: string){
        const petTypeField = this.page.locator('select')
        await petTypeField.selectOption(petType)
        const petTypeForAssertion = await petTypeField.inputValue()
        //2. Click "Save Pet" button
        await this.page.getByRole('button', {name: "Update Pet"}).click()
        //Store pet type for assertion in the test
        return petTypeForAssertion
    }
}