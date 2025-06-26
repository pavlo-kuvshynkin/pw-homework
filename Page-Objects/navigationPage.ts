import { Page } from '@playwright/test'

export class NavigationPage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async veterinariansPage(){
        await this.page.getByRole('button', {name: "Veterinarians"}).click()
        await this.page.getByRole('link', {name: 'All'}).click()
    }

    // async addNewVeterinarianPage(){
    //     await this.selectMenuItems('Veterinarians')
    //     await this.page.getByRole('link', {name: 'Add New'}).click()
    // }


    async ownersPage(){
        await this.page.getByRole('button', {name: 'Owners'}).click()
        await this.page.getByRole('link', { name: 'Search'}).click()
    }

    // async addNewOwnerPage(){
    //     await this.selectMenuItems('Owners')
    //     await this.page.getByRole('link', {name: 'Add New'}).click()
    // }

    async petTypesPage(){
        await this.page.getByRole('link', { name:'Pet Types'}).click()
    }

    async specialtiesPage(){
        await this.page.getByRole('link', {name:'Specialties'}).click()
    }

    // private async selectMenuItems(groupItemName: string){
    //     const groupMenuItem = this.page.getByRole('link', {name: groupItemName})
    //     const itemExpandedState = await groupMenuItem.getAttribute('arial-expanded')
    //     if(itemExpandedState == "false")
    //         await groupMenuItem.click({force: true})
    // }
}