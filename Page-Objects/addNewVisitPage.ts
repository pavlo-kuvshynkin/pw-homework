import {Page, expect, Locator} from '@playwright/test'

export class AddNewVisitPage {

    readonly page: Page
    todaysDate: string = ''
    pastDate: string = ''
    todaysVisitDescription: string = ''
    pastVisitDescription: string = ''
    
    constructor(page: Page){
        this.page = page
    }

    async selectTodaysDateUsingCalendarAndValidateDateFormatInTheInputField(){
        //1. Open calendar
        await this.page.getByLabel('Open calendar').click()
        //2. Getting current date
        let date = new Date()
        date.setDate(date.getDate())
        //Making date format output to be asserted
        const expectedDate = date.toLocaleString('En-US', {day: '2-digit'})
        const expectedMonth = date.toLocaleString('En-US', {month : '2-digit'})
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedYear}/${expectedMonth}/${expectedDate}`
        //3. Select current date in the datepicker
        await this.page.getByText(expectedDate, {exact: true}).click()
        //4. Assert that selected  today's date is displayed in the format "YYYY/MM/DD"
        await expect(this.page.locator('input[name="date"]')).toHaveValue(dateToAssert)

        this.todaysDate = `${expectedYear}-${expectedMonth}-${expectedDate}` //To be used for assertions on the Owner Information and Add new visit pages
    }

    async selectPastDateUsingCalendarForAPetVisit(numberOfDaysBack: number){
        await this.page.getByLabel('Open calendar').click()
        //1. Set date to be N days back from the current date
        let date = new Date()
        date.setDate(date.getDate() - numberOfDaysBack)
        //2. Recalculate expected month and year
        const expectedVisitDay = date.getDate().toString()
        const expectedMonthVisit = date.toLocaleString('En-US', {month : '2-digit'})
        const expectedYearVisit = date.getFullYear()
        const expectedMonthAndYearVisit = `${expectedMonthVisit} ${expectedYearVisit}`
        //3. Ensure the correct month is selected in the calendar
        let calendarMonthAndYear = await this.page.locator('.mat-calendar-period-button').innerText()
        //4. Create a loop to select a date N days back from the current date for the cases that exceed the current month
        while(!calendarMonthAndYear.includes(expectedMonthAndYearVisit)){
            await this.page.getByLabel('Previous month').click()
            calendarMonthAndYear = await this.page.getByLabel('Choose month and year').innerText()
        }
        await this.page.getByText(expectedVisitDay, {exact: true}).click()

        this.pastDate = `${expectedYearVisit}-${expectedMonthVisit}-${expectedVisitDay.padStart(2, '0')}` //To be used for assertions on the Owner Information and Add New visit pages
    }

    async addDescriptionAndSaveTheVisit(description: string){
        //1. Fill in the description field with a text
        await this.page.locator('#description').fill(description)
        //2. Click on the "Add Visit" button
        await this.page.getByRole('button', {name: 'Add Visit'}).click()
        //3. Save the description to the class variables to be used for assertion on the Owner Information page
        if (description === "todays visit description") {
            this.todaysVisitDescription = description
        } else if (description === "past visit description") {
            this.pastVisitDescription = description
        }
    }
}