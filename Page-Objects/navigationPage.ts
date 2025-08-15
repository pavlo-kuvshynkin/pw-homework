import { Page, expect } from '@playwright/test'

export class NavigationPage {

    readonly page: Page
    
    constructor(page: Page){
        this.page = page
    }

    async veterinariansPage(){
        await this.page.getByRole('button', {name: "Veterinarians"}).click()
        await this.page.getByRole('link', {name: 'All'}).click()
        await expect(this.page.getByRole('heading', {name: "Veterinarians"})).toBeVisible()
    }

    async ownersPage(){
        await this.page.getByRole('button', {name: 'Owners'}).click()
        await this.page.getByRole('link', { name: 'Search'}).click()
        await this.page.waitForResponse('**/petclinic/api/owners')
        await expect(this.page.getByRole('heading', {name: "Owners"})).toBeVisible()
    }

    async petTypesPage(){
        await this.page.getByRole('link', { name:'Pet Types'}).click()
        await expect(this.page.getByRole('heading', {name: "Pet Types"})).toBeVisible()
    }

    async specialtiesPage(){
        await this.page.getByRole('link', {name:'Specialties'}).click()
        await expect(this.page.getByRole('heading', {name: "Specialties"})).toBeVisible()
    }
}