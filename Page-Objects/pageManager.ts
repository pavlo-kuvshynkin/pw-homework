import { Page } from '@playwright/test';
import { NavigationPage } from './navigationPage';
import { PetTypesPage } from './PettypesPage';
import { OwnersPage } from './ownersPage';
import { OwnerInformationPage } from './ownerInformationPage';
import { EditPetPage } from './editPetPage';
import { VeterinariansPage } from './veterinariansPage';
import { SpecialtiesPage } from './specialtiesPage';
import { AddNewPetPage } from './addNewPetPage';
import { AddNewVisitPage } from './addNewVisitPage';
import { VeterinarianEditPage } from './veterinariansEditPage';
export class PageManager{

    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly petTypesPage: PetTypesPage
    private readonly ownersPage: OwnersPage
    private readonly ownerInformationPage: OwnerInformationPage
    private readonly editPetPage: EditPetPage
    private readonly veterinariansPage: VeterinariansPage
    private readonly specialtiesPage: SpecialtiesPage
    private readonly addNewPetPage: AddNewPetPage
    private readonly addNewVisitPage: AddNewVisitPage
    private readonly veterinarianEditPage: VeterinarianEditPage

    constructor(page: Page){
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.petTypesPage = new PetTypesPage(this.page)
        this.ownersPage = new OwnersPage(this.page)
        this.ownerInformationPage = new OwnerInformationPage(this.page)
        this.editPetPage = new EditPetPage(this.page)
        this.veterinariansPage = new VeterinariansPage(this.page)
        this.specialtiesPage = new SpecialtiesPage(this.page)
        this.addNewPetPage = new AddNewPetPage(this.page)
        this.addNewVisitPage = new AddNewVisitPage(this.page)
        this.veterinarianEditPage = new VeterinarianEditPage(this.page)
    }
    
    navigateTo(){
        return this.navigationPage
    }

    onPetTypesPage(){
        return this.petTypesPage
    }

    onOwnersPage(){
        return this.ownersPage
    }
    onOwnerInformationPage(){
        return this.ownerInformationPage
    }

    onEditPetPage(){
        return this.editPetPage
    }

    onVeterinariansPage(){
        return this.veterinariansPage
    }

    onSpecialtiesPage(){
        return this.specialtiesPage
    }

    onAddNewPetPage(){
        return this.addNewPetPage
    }

    onAddNewVisitPage(){
        return this.addNewVisitPage
    }
    onVeterinarianEditPage(){
        return this.veterinarianEditPage
    }
}