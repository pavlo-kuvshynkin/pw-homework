import { test } from '@playwright/test';
import { PageManager } from '../../Page-Objects/pageManager'

test.describe('Validating Pet types functionality', () => {
    test.beforeEach( async({page}) => {
        await page.goto('/')
    })
    test('TC_1 Verify update Pet Type name saving, cancel updating and validation of empty entries', async({page}) =>{
    const pm = new PageManager(page)

    await pm.navigateTo().petTypesPage()
    //Updating the pet type row "cat" to a new value "rabbit"
    await pm.onPetTypesPage().openEditingTargetedPetType("cat")
    await pm.onPetTypesPage().fillInTheNewPetTypeNameAndClickUpdate("rabbit")
    await pm.onPetTypesPage().validatePetTypeName("rabbit")
    //Updating the same field back to the value "cat"
    await pm.onPetTypesPage().openEditingTargetedPetType("rabbit")
    await pm.onPetTypesPage().fillInTheNewPetTypeNameAndClickUpdate("cat")
    await pm.onPetTypesPage().validatePetTypeName("cat")
    //Going to update a dog pet type row, cancelling updating and validating value hasn't changed
    await pm.onPetTypesPage().openEditingTargetedPetType("dog")
    await pm.onPetTypesPage().inPetTypeEditingFormEnterANewPetTypeNameAndThenCancel("moose")
    await pm.onPetTypesPage().validatePetTypeName("dog")
    //Going to update a dog pet type row and validating and error message after clearing an input field
    await pm.onPetTypesPage().openEditingTargetedPetType("lizard")
    await pm.onPetTypesPage().validateEmptyPetTypeNameFormShowsUpAnErrorMessageAndCannotBeSaved()
    })
})