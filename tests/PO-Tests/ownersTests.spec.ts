import { test, expect } from '@playwright/test'
import { PageManager } from '../../Page-Objects/pageManager'

test.describe('Date Selector Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })
    test('TC_5 Verify adding a new pet and validate new pet details are correct on the owner information page', async ({ page }) => {
        const pm = new PageManager(page)

        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().selectOwnerByName("Harold Davis")
        await pm.onOwnerInformationPage().goToAddANewPet()
        await pm.onAddNewPetPage().fillInPetNameToTheNameFieldAndAssertNameIsValidAndCheckIconIsAppeared("Tom")
        await pm.onAddNewPetPage().selectBirthDateAndAssertSelectedDateFormattedCorrectly("2014", "MAY", "2")
        await pm.onAddNewPetPage().selectPetTypeAndSaveTheNewPetDetails("dog")
        await pm.onOwnerInformationPage().validateNewPetHasCorrespondingDetails(pm.onAddNewPetPage().petName, pm.onAddNewPetPage().petBirthDate, pm.onAddNewPetPage().petType)
        await pm.onOwnerInformationPage().deleteTargetedPetAndValidateTheWasRemovedFromTheList(pm.onAddNewPetPage().petName)
    })

    test('TC_6 Verify adding pet visits and validate dates are displayed in chronological order', async ({page}) => {
        const pm = new PageManager(page)

        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().selectOwnerByName("Jean Coleman")
        await pm.onOwnerInformationPage().goToAddANewVisitForTargetedPetAndValidatePetDetailsOnTheAddVisitPage("Samantha", pm.onOwnersPage().ownerFullName)
        await pm.onAddNewVisitPage().selectTodaysDateUsingCalendarAndValidateDateFormatInTheInputField()
        await pm.onAddNewVisitPage().addDescriptionAndSaveTheVisit("todays visit description")
        await pm.onOwnerInformationPage().getTargetedPetsVisitByDescriptionAndValidateVisitDate("Samantha", pm.onAddNewVisitPage().todaysVisitDescription, pm.onAddNewVisitPage().todaysDate)
        await pm.onOwnerInformationPage().goToAddANewVisitForTargetedPetAndValidatePetDetailsOnTheAddVisitPage("Samantha", pm.onOwnersPage().ownerFullName)
        await pm.onAddNewVisitPage().selectPastDateUsingCalendarForAPetVisit(45)
        await pm.onAddNewVisitPage().addDescriptionAndSaveTheVisit("past visit description")
        await pm.onOwnerInformationPage().getTargetedPetsVisitByDescriptionAndValidateVisitDate("Samantha", pm.onAddNewVisitPage().pastVisitDescription, pm.onAddNewVisitPage().pastDate)
        await pm.onOwnerInformationPage().validateVisitDatesAreInChronologicalOrder("Samantha")
        await pm.onOwnerInformationPage().deleteVisitsForTargetedPetByDescriptionAndValidateTheyAreRemovedFromTheTable("Samantha", [pm.onAddNewVisitPage().todaysVisitDescription, pm.onAddNewVisitPage().pastVisitDescription])
    })

    test('TC_8 Verify editing Pet page and validate Pet type change', async ({page}) => {
        const pm = new PageManager(page)

        await pm.navigateTo().petTypesPage()
        await pm.onPetTypesPage().extractAllPetTypeNames()
        await pm.navigateTo().ownersPage()
        await pm.onOwnersPage().selectOwnerByName("George Franklin")
        await pm.onOwnerInformationPage().extractTargetedPetDetails("Leo")
        await pm.onOwnerInformationPage().navigateToEditATargetedPet("Leo")
        await pm.onEditPetPage().validatePrefilledPetDetailsAreMatchingTheDetailsFromOwnersInformationPage(pm.onOwnersPage().ownerFullName, pm.onOwnerInformationPage().petName, pm.onOwnerInformationPage().petBirthDate, pm.onOwnerInformationPage().petType)
        await pm.onEditPetPage().validateAllPetTypesAreDisplayedInTheDropDown(pm.onPetTypesPage().allPetTypeNames)
        await pm.onEditPetPage().selectPetTypeAndClickUpdateToSavePetDetails("dog")
        await pm.onOwnerInformationPage().validateNewPetHasCorrespondingDetails(pm.onOwnerInformationPage().petName, pm.onOwnerInformationPage().petBirthDate, pm.onEditPetPage().petType)
    })
})