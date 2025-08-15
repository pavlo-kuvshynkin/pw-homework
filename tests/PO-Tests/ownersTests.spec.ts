import { test, expect } from '@playwright/test'
import { PageManager } from '../../Page-Objects/pageManager'

test.describe('Date Selector Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('TC_5 Validate owners table data appearance and that the owners table data match the owners information page', async({page}) =>{
        const pm = new PageManager(page)

        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().validatePetNameAndCityOfTheOwner("Jeff Black", "Lucky", "Monona")
        await pm.onOwnersPage().validateTheCountOfOwnersThatHasMadisonCity(4)
        const petName = await pm.onOwnersPage().getOwnerPetNameByOwnerPhoneNumber("6085552765")
        await pm.onOwnersPage().selectOwnerByPhoneNumber("6085552765")
        await pm.onOwnerInformationPage().validateOwnerPhoneAndPetNameIsDisplayedGoBackToOwnersPage("6085552765", petName)
        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().validatePetsThatHasMadisonCity(["Leo", "George", "Mulligan", "Freddy"])
        await pm.onOwnersPage().validateSearchByOwnersLastName(["Black", "Davis", "Es", "Playwright"])
    })

    test('TC_6 Verify adding and deletion of the Pet with validation of the Pet details display', async ({ page }) => {
        const pm = new PageManager(page)

        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().clickOnTheOwnerFullNameLink("Harold Davis")
        await pm.onOwnerInformationPage().clickOnAddNewPetButton()
        await pm.onAddNewPetPage().fillInPetNameIntoNameFieldAndValidateCheckIcon("Tom")
        await pm.onAddNewPetPage().selectBirthDateFromThePastAndAssertSelectedDate(-97)
        const petBirthDate = await pm.onAddNewPetPage().getDateFromTheInputFieldInHyphenFormat()
        await pm.onAddNewPetPage().selectPetTypeThenExtractValueAndSaveTheNewPetDetails("dog")
        await pm.onOwnerInformationPage().validatePetDetailsForPet("Tom", petBirthDate, "dog")
        await pm.onOwnerInformationPage().deleteTargetedPetAndValidateTheWasRemovedFromTheList("dog")
    })

    test('TC_7 Verify owner details are displayed on the Owner information page', async ({page}) => {
        const pm = new PageManager(page)

        await pm.navigateTo().ownersPage()
        const targetedOwnerDetails = await pm.onOwnersPage().getDetailsForATargetedOwner("Jean Coleman")
        await pm.onOwnersPage().clickOnTheOwnerFullNameLink("Jean Coleman")
        const ownerDetailsForAssertion = await pm.onOwnerInformationPage().getOwnerDetails()
        await pm.onOwnerInformationPage().validateOwnerDetailsFromOwnersPageAreDisplayed(ownerDetailsForAssertion, targetedOwnerDetails)
    })

    test('TC_8 Verify owner and Pet details are displayed on the New visit page', async ({page}) => {
        const pm = new PageManager(page)

        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().clickOnTheOwnerFullNameLink("Jean Coleman")
        const ownerDetailsForAssertion = await pm.onOwnerInformationPage().getOwnerDetails()
        const targetedPetDetails = await pm.onOwnerInformationPage().getPetDetails("Samantha")
        await pm.onOwnerInformationPage().clickAddNewVisitButtonForATargetedPet("Samantha")
        await pm.onAddNewVisitPage().validatePetAndOwnerDetailsComparedToDetailsFromOwnerInformationPage(targetedPetDetails, ownerDetailsForAssertion)
    })

    test('TC_9 Verify adding visits for todays and past dates are displayed in chronological order and delete them', async ({page}) => {
        const pm = new PageManager(page)

        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().clickOnTheOwnerFullNameLink("Jean Coleman")
        await pm.onOwnerInformationPage().clickAddNewVisitButtonForATargetedPet("Samantha")
        await pm.onAddNewVisitPage().selectVisitDateUsingCalendarAndAssertSelectedDateInTheInputField(0)
        const todaysVisitDate = await pm.onAddNewVisitPage().getDateFromTheInputFieldInHyphenFormat()
        const todaysVisitDescription = await pm.onAddNewVisitPage().addDescriptionAndSaveTheVisit("todays visit description")
        await pm.onOwnerInformationPage().getTargetedPetsVisitByDescriptionAndValidateVisitDate("Samantha", todaysVisitDescription, todaysVisitDate)
        await pm.onOwnerInformationPage().clickAddNewVisitButtonForATargetedPet("Samantha")
        await pm.onAddNewVisitPage().selectVisitDateUsingCalendarAndAssertSelectedDateInTheInputField(-45)
        const pastVisitDate = await pm.onAddNewVisitPage().getDateFromTheInputFieldInHyphenFormat()
        const pastVisitDescription = await pm.onAddNewVisitPage().addDescriptionAndSaveTheVisit("past visit description")
        await pm.onOwnerInformationPage().getTargetedPetsVisitByDescriptionAndValidateVisitDate("Samantha", pastVisitDescription, pastVisitDate)
        await pm.onOwnerInformationPage().validateVisitDatesAreInChronologicalOrder("Samantha")
        await pm.onOwnerInformationPage().deleteVisitsForTargetedPetByDescriptionAndValidateTheyAreRemovedFromTheTable("Samantha", [todaysVisitDescription, pastVisitDescription])
    })

    test('TC_10 Verify editing Pet and validate Pet type change', async ({page}) => {
        const pm = new PageManager(page)

        await pm.navigateTo().petTypesPage()
        const allPetTypes = await pm.onPetTypesPage().extractAllPetTypeNames()
        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().clickOnTheOwnerFullNameLink("George Franklin")
        const ownerDetails = await pm.onOwnerInformationPage().getOwnerDetails()
        const petDetails = await pm.onOwnerInformationPage().getPetDetails("Leo")
        await pm.onOwnerInformationPage().clickEditPetButtonForATargetedPet("Leo")
        await pm.onEditPetPage().validateInputFieldsValues(ownerDetails, petDetails)
        await pm.onEditPetPage().validateAllPetTypesAreDisplayedInTheDropDown(allPetTypes)
        await pm.onEditPetPage().selectPetTypeAndClickUpdatePetButton("dog")
        await pm.onOwnerInformationPage().validatePetDetailsForPet(petDetails[0], petDetails[1], "dog")
    })
})