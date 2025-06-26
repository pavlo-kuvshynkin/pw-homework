import {Page, expect, Locator} from '@playwright/test'

export class SpecialtiesPage {

    readonly page: Page
    private specialtiesFromPage: string[] = []
    
    constructor(page: Page){
        this.page = page
    }

    async updateAnExistingSpecialtyAndValidateTheSpecialtyIsUpdated(targetedSpecialtyName: string, newSpecialtyName: string){
        //1. Select a targeted specialty row and go to edit it
        await this.getSpecialtyRowByName(targetedSpecialtyName).getByRole('button', { name: 'Edit'}).click()
        //2. Assert that "Edit Specialties" header displayed above the form
        await expect(this.page.getByRole('heading', {name: "Edit Specialty"})).toBeVisible()
        //3. Update the specialty to a new value e.g. "dermatology" and click "Update" button
        const specialtyNameInputField = this.page.getByRole('textbox')
        await specialtyNameInputField.click()
        await specialtyNameInputField.fill(newSpecialtyName)
        await this.page.getByRole('button', {name: "Update"}).click()
        //4. On the Specialties page assert that a specialty with a new is visible
        await expect(this.getSpecialtyRowByName(newSpecialtyName)).toBeVisible()
    }
    
    async addAndSaveANewSpecialtyAndValidateTheSpecialtyIsVisibleIn(specialtyName: string){
        //1. Select "Add" button. Type the new specialty "oncology" and click "Save" button
        await this.page.getByRole('button', {name: "Add"}).click()
        const addNewSpecialty = this.page.locator('form .form-group')
        await addNewSpecialty.getByRole('textbox').fill(specialtyName)
        await addNewSpecialty.getByRole('button', {name: "Save"}).click()
        //2. Then assert that just saved specialty is visible on the specialties page
        await expect(this.page.locator('tbody tr').nth(3)).toBeVisible()
    }

    async extractAllSpecialtiesIntoAnArray(){
        //Extract values from all specialty rows and put them into the array
        const specialtyRows = this.page.locator('tbody tr')
        this.specialtiesFromPage = []
        
        for(let row of await specialtyRows.all()){
            const rowValue = await row.locator('input').inputValue()
            this.specialtiesFromPage.push(rowValue!.trim())
        }
    }

    async deleteSpecialtyFromTheList(specialtyName: string){
        //Locate specialty rows by the targeted name and then select 'Delete' button
        await this.getSpecialtyRowByName(specialtyName).getByRole('button', {name: "Delete"}).click()
    }

    getStoredSpecialties(): string[] {
        return this.specialtiesFromPage
    }

    private getSpecialtyRowByName(specialtyName: string): Locator{
        return this.page.getByRole('row', {name: specialtyName})
    }
}