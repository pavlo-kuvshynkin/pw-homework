import {Page, expect, Locator} from '@playwright/test'

export class PetTypesPage {

    private readonly page: Page
    private readonly updateButton: Locator
    allPetTypeNames: string[]
    
    constructor(page: Page){
        this.page = page
        this.updateButton = page.getByRole('button', {name: "Update"})
    }

    async openEditingTargetedPetType(petTypeName: string){
        //1. Get targeted pet type by name and select 'Edit' button
        await this.getPetTypeRowByName(petTypeName).getByRole('button', {name: "Edit"}).click()
        //2. Assert the title "Edit Pet Type" is  displayed
        await expect(this.page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()
    }

    async fillInTheNewPetTypeNameAndClickUpdate(newPetTypeName: string){
        //Filling the pet type name field and clicking the "Update" button
        await this.fillingPetTypeNameInputField(newPetTypeName)
        await this.updateButton.click()
    }

    async validatePetTypeName(petTypeName: string){
        //Locate targeted row by Pet type name
        await expect(this.getPetTypeRowByName(petTypeName).getByRole('textbox')).toHaveValue(petTypeName)
    }

    async inPetTypeEditingFormEnterANewPetTypeNameAndThenCancel(petTypeName: string) {
        //2. Change the pet type name from "dog" to "moose"
        await this.fillingPetTypeNameInputField(petTypeName)
        //3. Assert that input value is "moose"
        await expect(this.page.getByRole('textbox')).toHaveValue(petTypeName)
        //Clicking the 'Cancel' button
        await this.page.getByRole('button', {name: "Cancel"}).click()
    }

    async validateEmptyPetTypeNameFormShowsUpAnErrorMessageAndCannotBeSaved() {
        //1. Clearing input field oon the 'Edit Pet Type' page
        await this.page.getByRole('textbox').click()
        await this.page.getByRole('textbox').clear()
        //3. Assert that the "Name is required" message below the input field is visible and has corresponding text
        const errorValidationMessage = this.page.locator('.help-block')
        await expect(errorValidationMessage).toBeVisible()
        await expect(errorValidationMessage).toHaveText('Name is required')
        //4. Click on the 'Update' button and assert that "Edit Pet Type" page is still displayed
        await this.updateButton.click()
        await expect(this.page.getByRole('heading', { name: "Edit Pet Type" })).toBeVisible()
        //5. Clicking the 'Cancel' button
        await this.page.getByRole('button', {name: "Cancel"}).click()
        //6.Assert that the 'Pet Types' page is displayed
        await expect(this.page.getByRole('heading', { name: "Pet Types"})).toBeVisible()
    }

    async extractAllPetTypeNames(){
        //1. Extract all pet type names from the table
        this.allPetTypeNames = await this.page.locator('tbody tr td').allTextContents()
    }
    //Internal use methods
    private async fillingPetTypeNameInputField(petTypeName: string){
        const nameInputField = this.page.getByRole('textbox')
        await nameInputField.click()
        await nameInputField.fill(petTypeName)
    }

    private getPetTypeRowByName(petTypeName: string): Locator {
        return this.page.getByRole('row', { name: petTypeName })
    }
}