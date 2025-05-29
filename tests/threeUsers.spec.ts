import { test, expect } from "@playwright/test";
import { createNomination, getPurchases, loginAdmin2, loginAdmin3, loginAdmin4, getNominations, deleteNomination } from "../helpers/requests";

let token2: string;
let token3: string;
let token4: string;
let initialQuantity: number;

const purchase = {
  id: "",
  quantity: 0,
};

test.beforeAll(async ({ request }) => {
  token2 = await loginAdmin2(request);
  token3 = await loginAdmin3(request);
  token4 = await loginAdmin4(request);
});

test.skip("Check 3 users create nominations with delays", async ({request,}, testInfo) => {
  testInfo.slow();
  // Step 1
  await test.step("Login users and get initial state", async () => {
    const responseBody = await getPurchases(request, token2);
    purchase.id = responseBody.data[0].id;
    initialQuantity = responseBody.data[0].availableQuantity;

    console.log("Initial purchase:", {id: purchase.id, quantity: initialQuantity});

    expect(initialQuantity).toBe(10000000);
  });

  // Step 2
  await test.step("First user creates first nomination", async () => {
    const nominationResponse = await createNomination(request,token2,purchase.id);

    console.log(
      "First user - First nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token2);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After first nomination:", {purchaseId: purchase.id, newQuantity, expectedQuantity: 9975000});

    expect(newQuantity).toBe(9975000);
  });

  // Step 3
  await test.step("Second user creates first nomination", async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    const nominationResponse = await createNomination(request,token3,purchase.id);

    console.log(
      "Second user - First nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token3);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After second nomination:", {purchaseId: purchase.id, newQuantity, expectedQuantity: 9950000});

    expect(newQuantity).toBe(9950000);
  });

  // Step 4
  await test.step("Third user creates first nomination", async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const nominationResponse = await createNomination(request,token4,purchase.id);

    console.log(
      "Third user - First nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token4);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After third nomination:", {purchaseId: purchase.id, newQuantity, expectedQuantity: 9925000});

    expect(newQuantity).toBe(9925000);
  });

  // Step 5
  await test.step("First user creates second nomination", async () => {
    await new Promise((resolve) => setTimeout(resolve, 6000));
    const nominationResponse = await createNomination(request, token2, purchase.id);

    console.log(
      "First user - Second nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token2);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After fourth nomination:", {purchaseId: purchase.id, newQuantity, expectedQuantity: 9900000});

    expect(newQuantity).toBe(9900000);
  });

  // Step 6
  await test.step("Second user creates second nomination", async () => {
    await new Promise((resolve) => setTimeout(resolve, 7000));
    const nominationResponse = await createNomination(request, token3,purchase.id);

    console.log(
      "Second user - Second nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token3);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After fifth nomination:", {purchaseId: purchase.id, newQuantity, expectedQuantity: 9875000});

    expect(newQuantity).toBe(9875000);
  });

  // Step 7
  await test.step("Third user creates second nomination", async () => {
    await new Promise((resolve) => setTimeout(resolve, 8000));
    const nominationResponse = await createNomination(request, token4, purchase.id);

    console.log(
      "Third user - Second nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token4);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After sixth nomination:", {purchaseId: purchase.id, newQuantity, expectedQuantity: 9850000});

    expect(newQuantity).toBe(9850000);
  });
});

test.afterAll(async ({ request }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const nominationIds = await getNominations(request, token2, purchase.id);

  console.log("Nomination IDs:", nominationIds);
  console.log("Found nominations to delete:", nominationIds.length);

  for (const id of nominationIds) {
    await deleteNomination(request, token2, id.toString());
  }

  // Verify final quantity is back to initial
  const finalPurchase = await getPurchases(request, token2);
  const finalQuantity = finalPurchase.data[0].availableQuantity;

  console.log("Final state:", { purchaseId: purchase.id, finalQuantity, initialQuantity });

  expect(finalQuantity).toBe(initialQuantity);
});
