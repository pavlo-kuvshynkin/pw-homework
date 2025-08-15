import {Page, expect, Locator} from '@playwright/test'
import {HelperBase} from './helperBase'

export class AddNewVisitPage extends HelperBase{
    
    constructor(page: Page){
        super(page)
    }

    /**
     * @param numberOfDaysFromToday - this parameter should take negative value (-41) to select past date and positive value (+25) to select future date or "0" to select today's date
     */
    async selectVisitDateUsingCalendarAndAssertSelectedDateInTheInputField(numberOfDaysFromToday: number){
        //1. Using HelperBase class call a method to select desired date using calendar and store returned date format for assertion
        const expectedDateToAssert = await this.selectAnyDateFromTodayUsingCalendar(numberOfDaysFromToday)
        //2. Comparing returned date for assertion with one in the input field
        await expect(this.page.locator('.mat-datepicker-input')).toHaveValue(expectedDateToAssert)
    }

    async getDateFromTheInputFieldInHyphenFormat(){
        //1. Get the date from the input field
        const selectedDate = await this.page.locator('.mat-datepicker-input').inputValue()
        //2. Reformatting date to hyphen format for assertion
        return selectedDate.replace(/\//g, '-')
    }

    async validatePetAndOwnerDetailsComparedToDetailsFromOwnerInformationPage(petDetails: string [], ownerDetails: string []){
        //1. Locate the table with pet and owner details
        const detailsTable = this.page.locator('.table-striped td')
        //2. Assert that the table has the same details as on the Owner Information page
        await expect(this.page.locator('.table-striped td').first()).toHaveText(petDetails[0])
        await expect(this.page.locator('.table-striped td').nth(1)).toHaveText(petDetails[1])
        await expect(this.page.locator('.table-striped td').nth(2)).toHaveText(petDetails[2])
        await expect(this.page.locator('.table-striped td').last()).toHaveText(ownerDetails[0])
    }

    async addDescriptionAndSaveTheVisit(description: string){
        //1. Fill in the description field with a text
        await this.page.locator('#description').fill(description)
        //2. Click on the "Add Visit" button
        await this.page.getByRole('button', {name: 'Add Visit'}).click()
        //3. Save the description to be used for assertion on the Owner Information page
        return description
    }
}