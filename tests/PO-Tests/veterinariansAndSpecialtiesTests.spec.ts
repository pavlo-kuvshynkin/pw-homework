import { test } from '@playwright/test';
import { PageManager } from '../../Page-Objects/pageManager';

test.describe('Validating Veterinarians and Specialties functionality', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
    })

    test('TC_2 Validate owners table data appearance and that the owners table data match the owners information page', async({page}) =>{
    const pm = new PageManager(page)

    await pm.navigateTo().ownersPage()
    await pm.onOwnersPage().validatePetNameAndCityOfTheOwner("Jeff Black", "Lucky", "Monona")
    await pm.onOwnersPage().validateTheCountOfOwnersThatHasMadisonCity(4)
    await pm.onOwnersPage().findingOwnerByPhoneNumberExtractingHisPetNameAndClickOwnerFullNameLink("6085552765")
    await pm.onOwnerInformationPage().validateOwnerPhoneAndPetNameIsDisplayedGoBackToOwnersPage(pm.onOwnersPage().ownerPhoneNumber, pm.onOwnersPage().petName)
    await pm.onOwnersPage().validatePetsThatHasMadisonCity(["Leo", "George", "Mulligan", "Freddy"])
    await pm.onOwnersPage().validateSearchByOwnersLastName(["Black", "Davis", "Es", "Playwright"])
    })

    test('TC_3 Verify editing an existing specialty will be changed for corresponding veterinarians', async({page}) =>{
    const pm = new PageManager(page)

    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtyOfVeterinarianPopulatedOrEmpty("Rafael Ortega", ["surgery"])
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().updateAnExistingSpecialtyAndValidateTheSpecialtyIsUpdated("surgery", "dermatology")
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtyOfVeterinarianPopulatedOrEmpty("Rafael Ortega", ["dermatology"])
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().updateAnExistingSpecialtyAndValidateTheSpecialtyIsUpdated("dermatology", "surgery")
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtyOfVeterinarianPopulatedOrEmpty("Rafael Ortega", ["surgery"])
    })

    test('TC_4 Verify adding and deleting specialties is updating on the Veterinarians pages and Edit Veterinarian', async({page}) =>{
    const pm = new PageManager(page)

    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().addAndSaveANewSpecialtyAndValidateTheSpecialtyIsVisibleIn("oncology")
    await pm.onSpecialtiesPage().extractAllSpecialtiesIntoAnArray()
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().selectAVeterinarianByNameAndNavigateToEdit("Sharon Jenkins")
    await pm.onVeterinarianEditPage().extractSpecialtiesForVeterinariansAndGetBackToAllVeterinariansPage()
    await pm.onVeterinariansPage().compareSpecialtiesThatAvailableOnTheVeterinariansAndSpecialtiesPages(pm.onSpecialtiesPage().getStoredSpecialties(), pm.onVeterinarianEditPage().availableSpecialties)
    await pm.onVeterinariansPage().selectAVeterinarianByNameAndNavigateToEdit("Sharon Jenkins")
    await pm.onVeterinarianEditPage().selectAndSaveASpecialty("oncology")
    await pm.onVeterinariansPage().validateSpecialtyOfVeterinarianPopulatedOrEmpty("Sharon Jenkins", ["oncology"])
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().deleteSpecialtyFromTheList("oncology")
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtyOfVeterinarianPopulatedOrEmpty("Sharon Jenkins", [])
    })

    test('TC_7 Verify adding and removing multiple specialties for a veterinarian', async({page}) =>{
        const pm = new PageManager(page)

        await pm.navigateTo().veterinariansPage()
        await pm.onVeterinariansPage().selectAVeterinarianByNameAndNavigateToEdit("James Carter")
        await pm.onVeterinarianEditPage().extractSpecialtiesForVeterinariansAndGetBackToAllVeterinariansPage()
        await pm.onVeterinariansPage().selectAVeterinarianByNameAndNavigateToEdit("James Carter")
        await pm.onVeterinarianEditPage().selectAndSaveMultipleSpecialties()
        await pm.onVeterinariansPage().validateSpecialtyOfVeterinarianPopulatedOrEmpty("James Carter", pm.onVeterinarianEditPage().availableSpecialties)
        await pm.onVeterinariansPage().selectAVeterinarianByNameAndNavigateToEdit("James Carter")
        await pm.onVeterinarianEditPage().removeSpecialtiesAndSave()
        await pm.onVeterinariansPage().validateSpecialtyOfVeterinarianPopulatedOrEmpty("James Carter", [])
    })
})