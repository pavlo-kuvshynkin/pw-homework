import {Page, expect, Locator} from '@playwright/test'

export class AddNewPetPage {

    readonly page: Page
    petName: string = ''
    petBirthDate: string = ''
    petType: string = ''
    
    constructor(page: Page){
        this.page = page
    }

    async fillInPetNameToTheNameFieldAndAssertNameIsValidAndCheckIconIsAppeared(petName: string){
        //3. In the Name field, type any new pet name
        const nameInputFieldSection = this.page.locator('.has-feedback', {has: this.page.getByLabel('Name')})
        await nameInputFieldSection.getByRole('textbox', {name: 'name'}).fill(petName)
        //4. Assert that an icon in the input field changed from "remove" to "ok"
        await expect(nameInputFieldSection.locator('span')).toHaveClass('glyphicon form-control-feedback glyphicon-ok')
        //Store pet name for assertion in the test
        this.petName = petName
    }

    /**
     * @param birthYear - should be format as numeric string like "2020"
     * @param birthMonth - should be format as upper case letters "JUNE"
     * @param birthDay - should be format as numeric string like "1,2,..,9,10.."
     */
    async selectBirthDateAndAssertSelectedDateFormattedCorrectly(birthYear: string, birthMonth: string, birthDay: string){
        //1. Click on the calendar icon for the "Birth Date" field
        await this.page.getByLabel('Open calendar').click()
        //2. Using calendar selector, select the date
        await this.page.getByLabel('Choose month and year').click()
        await this.page.getByLabel('Previous 24 years').click()
        await this.page.getByLabel(birthYear).click()
        await this.page.getByText(birthMonth.toUpperCase()).click()
        await this.page.getByText(birthDay, {exact: true}).click()
        //3. Assert the input field is in the format "YYYY/MM/DD"
        // Convert birthMonth (e.g., "JUNE") to its corresponding two-digit month number
        const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE","JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
        const monthIndex = monthNames.indexOf(birthMonth.toUpperCase())
        const formattedMonth = (monthIndex + 1).toString().padStart(2, '0')
        const formattedDay = birthDay.padStart(2, '0')
        const birthDateToAssert = `${birthYear}/${formattedMonth}/${formattedDay}`
        await expect(this.page.locator('input[name="birthDate"]')).toHaveValue(birthDateToAssert)
        //Store pet birth date for assertion in different format in the test
        this.petBirthDate = `${birthYear}-${formattedMonth}-${formattedDay}`
    }

    async selectPetTypeAndSaveTheNewPetDetails(petType: string){
        //1. Select the type of pet from the dropdown 
        await this.page.getByLabel('Type').click()
        await this.page.locator('select').selectOption(petType)
        //2. Click "Save Pet" button
        await this.page.getByRole('button', {name: "Save Pet"}).click()
        //Store formatted pet type for assertion in the test
        this.petType = petType 
    } 
}