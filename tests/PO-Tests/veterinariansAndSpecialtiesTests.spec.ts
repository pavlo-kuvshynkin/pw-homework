import { test } from '@playwright/test';
import { PageManager } from '../../Page-Objects/pageManager';

test.describe('Validating Veterinarians and Specialties functionality', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
    })

    test('TC_2 Verify editing an existing specialty will be changed for corresponding veterinarians', async({page}) =>{
    const pm = new PageManager(page)

    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateDisplayedSelectedSpecialties("Rafael Ortega", ["surgery"])
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().updateAnExistingSpecialtyAndValidateTheSpecialtyIsUpdated("surgery", "dermatology")
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateDisplayedSelectedSpecialties("Rafael Ortega", ["dermatology"])
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().updateAnExistingSpecialtyAndValidateTheSpecialtyIsUpdated("dermatology", "surgery")
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateDisplayedSelectedSpecialties("Rafael Ortega", ["surgery"])
    })

    test('TC_3 Verify adding and deleting specialties is updating on the Veterinarians pages and Edit Veterinarian', async({page}) =>{
    const pm = new PageManager(page)

    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().addAndSaveANewSpecialtyAndValidateTheSpecialtyIsVisibleIn("oncology")
    const currentSpecialties = await pm.onSpecialtiesPage().getListOfCurrentSpecialties()
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().clickEditButtonForVeterinarian("Sharon Jenkins")
    const availableSpecialties = await pm.onEditVeterinarianPage().getSpecialtiesForVeterinarians()
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtiesListsAreEqual(currentSpecialties, availableSpecialties)
    await pm.onVeterinariansPage().clickEditButtonForVeterinarian("Sharon Jenkins")
    await pm.onEditVeterinarianPage().selectAndSaveASpecialty("oncology")
    await pm.onVeterinariansPage().validateDisplayedSelectedSpecialties("Sharon Jenkins", ["oncology"])
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().deleteSpecialtyFromTheList("oncology")
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateDisplayedSelectedSpecialties("Sharon Jenkins", [])
    })

    test('TC_4 Verify adding and removing multiple specialties for a veterinarian', async({page}) =>{
        const pm = new PageManager(page)

        await pm.navigateTo().veterinariansPage()
        await pm.onVeterinariansPage().clickEditButtonForVeterinarian("James Carter")
        const availableSpecialties = await pm.onEditVeterinarianPage().getSpecialtiesForVeterinarians()
        await pm.navigateTo().veterinariansPage()
        await pm.onVeterinariansPage().clickEditButtonForVeterinarian("James Carter")
        await pm.onEditVeterinarianPage().selectAndSaveAllSpecialties()
        await pm.onVeterinariansPage().validateDisplayedSelectedSpecialties("James Carter", availableSpecialties)
        await pm.onVeterinariansPage().clickEditButtonForVeterinarian("James Carter")
        await pm.onEditVeterinarianPage().removeSpecialtiesAndSave()
        await pm.onVeterinariansPage().validateDisplayedSelectedSpecialties("James Carter", [])
    })
})