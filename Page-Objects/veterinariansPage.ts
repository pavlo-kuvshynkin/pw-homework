import {Page, expect, Locator} from '@playwright/test'

export class VeterinariansPage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async clickEditButtonForVeterinarian(veterinarianName: string){
        //Locate and click the "Edit" button and validate the 'Edit Veterinarian' title is displayed on the loaded page
        await this.page.getByRole('row', {name: veterinarianName}).getByRole('button', {name: "Edit"}).click()
        await expect(this.page.getByRole('heading')).toHaveText('Edit Veterinarian')
    }
    
    async validateDisplayedSelectedSpecialties(veterinarianName: string, specialtyNames: string[]){
        //1. Locate the table cell with specialties for the targeted veterinarian
        const specialtyCell = this.page.getByRole('row', {name: veterinarianName}).locator('td').nth(1)
        //2. Assert if there are no specialties or if there are specialties are presented
        if(specialtyNames.length === 0){
            await expect(specialtyCell).toBeEmpty()
        } else {
        // Get actual text from UI and split into array
            const actualText = await specialtyCell.innerText()
            const actualSpecialties = actualText?.trim().split(/\s+/).filter(s => s.length > 0) || []
            const expectedSpecialties = specialtyNames.map(name => name.trim()).filter(s => s.length > 0)
        // Sort both arrays for order-independent comparison
            expect(actualSpecialties.sort()).toEqual(expectedSpecialties.sort())
        }
    }

    async validateSpecialtiesListsAreEqual(currentSpecialties: string[], availableSpecialties: string[]) {
        expect(availableSpecialties.sort()).toEqual(currentSpecialties.sort())
    }
}