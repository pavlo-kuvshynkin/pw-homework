import {Page, expect} from '@playwright/test'
import {HelperBase} from './helperBase'

export class AddNewPetPage extends HelperBase {
    
    constructor(page: Page){
        super(page)
    }

    async fillInPetNameToTheNameFieldAndAssertNameIsValidAndCheckIconIsAppeared(petName: string){
        //3. In the Name field, type any new pet name
        const nameInputFieldSection = this.page.locator('.has-feedback', {has: this.page.getByLabel('Name')})
        await nameInputFieldSection.getByRole('textbox', {name: 'name'}).fill(petName)
        //4. Assert that an icon in the input field changed from "remove" to "ok"
        await expect(nameInputFieldSection.locator('span')).toHaveClass('glyphicon form-control-feedback glyphicon-ok')
        return petName
    }

    async selectBirthDateFromThePastAndAssertSelectedDate(numberOfDaysFromToday: number){
        //1. Using HelperBase class call a method to select desired date using calendar and store returned date format for assertion
        const expectedDateToAssert = await this.selectAnyDateFromTodayUsingCalendar(numberOfDaysFromToday)
        //2. Comparing returned date for assertion with one in the input field
        await expect(this.page.locator('.mat-datepicker-input')).toHaveValue(expectedDateToAssert)
    }

    async selectPetTypeThenExtractValueAndSaveTheNewPetDetails(petType: string){
        //1. Select the type of pet from the dropdown
        const petTypeField = this.page.locator('select')
        await petTypeField.selectOption(petType)
        const petTypeForAssertion = await petTypeField.inputValue()
        //2. Click "Save Pet" button
        await this.page.getByRole('button', {name: "Save Pet"}).click()
        //Store formatted pet type for assertion in the test
        return petTypeForAssertion
    }

    async getDateFromTheInputFieldInHyphenFormat(){
        //1. Get the date from the input field
        const selectedDate = await this.page.locator('.mat-datepicker-input').inputValue()
        //2. Reformatting date to hyphen format for assertion
        return selectedDate.replace(/\//g, '-')
    }
}