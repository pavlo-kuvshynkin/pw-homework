import { test, expect, request } from '@playwright/test';
import { PageManager } from '../Page-Objects/pageManager';

test('TC_1: Delete specialty validation', async ({page, request}) => {
    //1. Create a new specialty via API and validate status code 201
    const newSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            name: 'API testing expert'
        }
    });
    expect(newSpecialtyResponse.status()).toEqual(201);
    //2. Go to specialties page
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.navigateTo().specialtiesPage();
    //3. Validate that the created specialty is present
    await expect(page.getByRole('row', {name: 'API testing expert'})).toBeVisible();
    //4. Delete the created specialty
    await page.getByRole('row', {name: 'API testing expert'}).getByRole('button', {name: 'Delete'}).click();
    //5. Validate that the deleted specialty is not presented anymore
    await expect(page.getByText('API testing expert')).not.toBeVisible();
})

test('TC_2: Add and delete veterinarian', async ({page, request}) => {
    //1. Create a new Veterinarian via API without specialties and validate status code 201
    const newVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
        firstName: 'Test',
        id: null,
        lastName: 'Testerson',
        specialties: []
        }
    });
    const newVetResponseBody = await newVetResponse.json();
    const newVetID = newVetResponseBody.id;
    expect(newVetResponse.status()).toEqual(201);
    expect(newVetResponseBody.firstName).toEqual('Test');
    expect(newVetResponseBody.lastName).toEqual('Testerson');
    //2. Go to Veterinarians page
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.navigateTo().veterinariansPage();
    //3. Validate that the created veterinarian is present and no specialties are assigned
    const newVetRow = page.getByRole('row', {name: 'Test Testerson'})
    await expect(newVetRow).toBeVisible();
    await expect(newVetRow.getByRole('cell').nth(1)).toBeEmpty();
    //4. Click "Edit Vet" button for newly created veterinarian
    newVetRow.getByRole('button', {name: 'Edit Vet'}).click();
    //5. On "Edit Veterinarian" page, select "dentistry" specialty from the drop-down, and click Save Vet button
    await page.locator('.dropdown-display').click();
    await page.getByRole('checkbox', {name: "dentistry"}).check();
    await page.locator('.dropdown-display').click();
    await page.getByRole('button', {name: 'Save Vet'}).click();
    //6. Add the assertion that the "dentistry" specialty is displayed for the test veterinarian
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText("dentistry");
    //7. Delete the created test veterinarian via API request. Assert the response status code
    await request.delete('https://petclinic-api.bondaracademy.com/petclinic/api/vets/'+newVetID+'');
    //8. Get the list of veterinarians via API request. Make the assertion that deleted veterinarian does not exist in the response body
    const allVetsResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets');
    const allVetsResponseBody = await allVetsResponse.json();
    for (let vet of allVetsResponseBody){
        expect(vet.id).not.toEqual(newVetRow)
    }
})

test('TC_3: New specialty is displayed', async ({page, request}) => { 
    //1. Create a new specialty via API and validate status code 201
    const newSpecialtyResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        data: {
            name: 'API testing ninja'
        }
    });
    const newSpecialtyResponseBody = await newSpecialtyResponse.json();
    const newSpecialtyID = newSpecialtyResponseBody.id;
    expect(newSpecialtyResponse.status()).toEqual(201);
    //2. Create a new veterinarian via API with a specialty "surgery". Add assertion of the response status code.
    const newVetResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        data: {
        firstName: 'Test',
        id: null,
        lastName: 'Testerson',
        specialties: [{
            "id": 1016,
            "name": "surgery"
            }]
        }
    });
    const newVetResponseBody = await newVetResponse.json();
    const newVetID = newVetResponseBody.id;
    expect(newVetResponse.status()).toEqual(201);
    //3. Go to Veterinarians page
    await page.goto('/');
    const pm = new PageManager(page);
    await pm.navigateTo().veterinariansPage();
    //4. Assert that newly created veterinarian is available in the list and it has specialty "surgery"
    const newVetRow = page.getByRole('row', {name: 'Test Testerson'})
    await expect(newVetRow).toBeVisible();
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText(newVetResponseBody.specialties[0].name);
    //5. Click "Edit Vet" button for newly created veterinarian
    newVetRow.getByRole('button', {name: 'Edit Vet'}).click();
    //6. On Edit Veterinarian page, change the specialty from "surgery" to "api testing ninja" and click "Save Vet" button
    await page.locator('.dropdown-display').click();
    await page.getByRole('checkbox', {name: "surgery"}).uncheck();
    await page.getByRole('checkbox', {name: newSpecialtyResponseBody.name}).check();
    await page.locator('.dropdown-display').click();
    await page.getByRole('button', {name: 'Save Vet'}).click();
    //7. Add the assertion that veterinarian has a specialty "api testing ninja"
    await expect(newVetRow.getByRole('cell').nth(1)).toHaveText(newSpecialtyResponseBody.name);
    //8. Delete the created test veterinarian via API request. Assert the response status code
    const deleteVet = await request.delete('https://petclinic-api.bondaracademy.com/petclinic/api/vets/'+newVetID+'');
    expect(deleteVet.status()).toEqual(204);
    //9. Delete the created specialty via API request. Assert the response status code
    const deleteSpecialty = await request.delete('https://petclinic-api.bondaracademy.com/petclinic/api/specialties/'+newSpecialtyID+'');
    expect(deleteSpecialty.status()).toEqual(204);
    //10. Navigate to the Specialties page and add assert that "api testing ninja" does not exist in the list of specialties
    await pm.navigateTo().specialtiesPage();
    await expect(page.getByRole('cell', {name: "API testing ninja"})).not.toBeVisible();
})