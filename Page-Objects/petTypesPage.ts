import {Page, expect, Locator} from '@playwright/test'

export class PetTypesPage {

    private readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async clickOnEditButtonForPetType(petTypeName: string){
        //1. Get targeted pet type by name and select 'Edit' button
        await this.page.getByRole('row', {name: petTypeName}).getByRole('button', {name: "Edit"}).click()
        //2. Assert the title "Edit Pet Type" is  displayed
        await expect(this.page.getByRole('heading', { name: 'Edit Pet Type' })).toBeVisible()
    }

    async validatePetTypeName(petTypeName: string){
        //Locate targeted row by Pet type name
        await expect(this.page.getByRole('row', {name: petTypeName}).getByRole('textbox')).toHaveValue(petTypeName)
    }

    async extractAllPetTypeNames(){
        //Extract all pet type names from the table
        const allPetTypeNames = await this.page.locator('tbody tr td').allTextContents()
        return allPetTypeNames
    }
}