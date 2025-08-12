import {Page, expect, Locator} from '@playwright/test'

export class EditPetTypePage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async fillInTheNewPetTypeNameAndClickUpdate(newPetTypeName: string){
        //Filling the pet type name field and clicking the "Update" button
        const nameInputField = this.page.getByRole('textbox')
        await nameInputField.click()
        await nameInputField.fill(newPetTypeName)
        await this.page.getByRole('button', {name: "Update"}).click()
    }

    async enterANewPetTypeNameAndClickCancel(petTypeName: string) {
        //1. Change the pet type name from "dog" to "moose"
        const nameInputField = this.page.getByRole('textbox')
        await nameInputField.click()
        await nameInputField.fill(petTypeName)
        //2. Assert that input value is the one provided in the parameter
        await expect(this.page.getByRole('textbox')).toHaveValue(petTypeName)
        //3. Clicking the 'Cancel' button
        await this.page.getByRole('button', {name: "Cancel"}).click()
    }

    async validateClearingPetTypeNameFieldShowsUpAnErrorMessage(){
        //1. Clearing input field oon the 'Edit Pet Type' page
        await this.page.getByRole('textbox').click()
        await this.page.getByRole('textbox').clear()
        //2. Assert that the "Name is required" message below the input field is visible and has corresponding text
        const errorValidationMessage = this.page.locator('.help-block')
        await expect(errorValidationMessage).toHaveText('Name is required')
    }

    async validateTheEmptyPetTypeFieldCannotBeUpdatedAndStillShowsUpErrorMessage(){
        //Click on the 'Update' button and assert that an error message page is still displayed
        await this.page.getByRole('button', {name: "Update"}).click()
        await expect(this.page.locator('.help-block')).toBeVisible()
    }
}