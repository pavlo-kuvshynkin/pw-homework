import {Page, expect, Locator} from '@playwright/test'

export class VeterinarianEditPage {

    readonly page: Page
    availableSpecialties: string[] = []
    
    constructor(page: Page){
        this.page = page
    }

    async extractSpecialtiesForVeterinariansAndGetBackToAllVeterinariansPage(){
        //1. Click on the Specialties drop-down menu to open it
        await this.page.locator('.dropdown-display').click()
        const specialtyOptions = this.page.locator('.dropdown-content label')
        //2. Loop through the list of specialties and extract them into 'availableSpecialties'
        for(let option of await specialtyOptions.all()){
            const specialtyValue = await option.textContent()
            this.availableSpecialties.push(specialtyValue!.trim())
        }
        //3. Click on the Specialties drop-down menu to close it in order to see "Back" button and click this button
        await this.page.locator('.dropdown-display').click()
        await this.page.getByRole('button', {name: "Back"}).click()
    }

    async selectAndSaveASpecialty(specialtyName: string){
        //1. Opening of the Specialties drop-down menu is completed in the method "extractSpecialtiesForVeterinarians"
        await this.page.locator('.dropdown-display').click()
        //2. Select specialty option
        await this.page.getByRole('checkbox', {name: specialtyName}).click()
        //3. Close Specialties drop-down menu by clicking on the field and save changes
        await this.page.locator('.dropdown-display').click()
        await this.page.getByRole('button', {name: "Save vet"}).click()
    }

    async selectAndSaveMultipleSpecialties(){
        //1. Open the Specialties drop-down menu
        await this.page.locator('.dropdown-display').click()
        //2. Select multiple specialties
        const allBoxes = this.page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.check()
            expect(await box.isChecked()).toBeTruthy()
        }
        //3. Close the Specialties drop-down menu by clicking on the field and save changes
        await this.page.locator('.dropdown-display').click()
        await this.page.getByRole('button', {name: "Save vet"}).click()
    }

    async removeSpecialtiesAndSave(){
//1. Open the Specialties drop-down menu
        await this.page.locator('.dropdown-display').click()
        //2. Select multiple specialties
        const allBoxes = this.page.getByRole('checkbox')
        for (const box of await allBoxes.all()){
            await box.uncheck()
            expect(await box.isChecked()).toBeFalsy()
        }
        //3. Close the Specialties drop-down menu by clicking on the field and save changes
        await this.page.locator('.dropdown-display').click()
        await this.page.getByRole('button', {name: "Save vet"}).click()
    }
}