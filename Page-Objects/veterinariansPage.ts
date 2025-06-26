import {Page, expect, Locator} from '@playwright/test'

export class VeterinariansPage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }


    async selectAVeterinarianByNameAndNavigateToEdit(veterinarianName: string){
        //1. Locate the row of a targeted veterinarian
        const targetedVeterinarian = this.getVeterinarianTableRowByName(veterinarianName)
        //2. Locate and click the "Edit" button and validate the 'Edit Veterinarian' title is displayed on the loaded page
        await targetedVeterinarian.getByRole('button', {name: "Edit"}).click()
        await expect(this.page.getByRole('heading')).toHaveText('Edit Veterinarian')
    }
    
    async validateSpecialtyOfVeterinarianPopulatedOrEmpty(veterinarianName: string, specialtyNames: string[]){
    //1. Locate the table cell with specialties for the targeted veterinarian
        const specialtyCell = this.getVeterinarianTableRowByName(veterinarianName).locator('td').nth(1)
    //2. Assert if there are no specialties or if there are specialties are presented
        if(specialtyNames.length === 0){
            await expect(specialtyCell).toBeEmpty()
        } else {
        // Get actual text from UI and split into array
            const actualText = await specialtyCell.textContent()
            const actualSpecialties = actualText?.trim().split(/\s+/).filter(s => s.length > 0) || []
            const expectedSpecialties = specialtyNames.map(name => name.trim()).filter(s => s.length > 0)
        // Sort both arrays for order-independent comparison
            expect(actualSpecialties.sort()).toEqual(expectedSpecialties.sort())
        }
    }

    async compareSpecialtiesThatAvailableOnTheVeterinariansAndSpecialtiesPages(allSpecialties: string[], availableSpecialties: string[]) {
        expect(availableSpecialties.sort()).toEqual(allSpecialties.sort())
    }

    private getVeterinarianTableRowByName(veterinarianName: string): Locator{
        return this.page.getByRole('row', {name: veterinarianName})
    }
}