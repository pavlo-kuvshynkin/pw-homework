import { Page, expect } from "@playwright/test"

export class HelperBase {
    readonly page: Page

    constructor(page: Page){
        this.page = page
    }
    /**
     * This method is used to select any date from today using calendar
     * @param numberOfDaysFromToday - this parameter should take negative value (-41) to select past date and positive value (+25) to select future date or "0" to select today's date
     */
    async selectAnyDateFromTodayUsingCalendar(numberOfDaysFromToday: number){
        //1. Click on the calendar icon for the "Birth Date" field
        await this.page.getByLabel('Open calendar').click()
        //2. Set dates format
        let date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday) //numberOfDaysFromToday can be negative to select past date, 0 for today, or positive for future date
        //Making date format output to be asserted
        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
        const expectedYear = date.getFullYear()
        const expectedDateForAssertion = `${expectedYear}/${expectedMonth}/${expectedDay.padStart(2, '0')}`
        const expectedMonthAndYear = `${expectedMonth} ${expectedYear}`
        //3. Ensure the correct month is selected in the calendar
        let calendarMonthAndYear = await this.page.locator('.mat-calendar-period-button').innerText()
        //4. Create a loop to select a date N days back/further from the current date for the cases that exceed the current month
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            if (numberOfDaysFromToday > 0) {
            //&& !calendarMonthAndYear.includes(expectedMonthAndYear)
                await this.page.getByLabel('Next month').click()
            } else {
                await this.page.getByLabel('Previous month').click()
            }
            calendarMonthAndYear = await this.page.getByLabel('Choose month and year').innerText()
        }
        await this.page.getByText(expectedDay, {exact: true}).click()
        //Return expected date for assertion to be used in the test methods
        return expectedDateForAssertion
    }

}