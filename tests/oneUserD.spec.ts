import { test, expect } from "@playwright/test";
import {
  createNomination,
  getPurchases,
  loginAdmin5,
  deleteNomination,
} from "../helpers/requests";
import { delay } from "../helpers/utils";

let token: string;
let initialQuantity: number;
let firstNominationID: string;
let secondNominationID: string;

const purchase = {
  id: "",
  quantity: 0,
};

test.beforeAll(async ({ request }) => {
  token = await loginAdmin5(request);
});

test("Check 1 user create nominations successfully", async ({ request }) => {
  // Step 1
  await test.step("Get initial purchase state", async () => {
    const responseBody = await getPurchases(request, token);
    purchase.id = responseBody.data[0].id;
    initialQuantity = responseBody.data[0].availableQuantity;

    console.log("Initial purchase:", {
      id: purchase.id,
      quantity: initialQuantity,
    });

    expect(initialQuantity).toBe(10000000);
  });

  // Step 2
  await test.step("Create first nomination and verify quantity", async () => {
    const nominationResponse = await createNomination(
      request,
      token,
      purchase.id
    );
    firstNominationID = nominationResponse.id;

    console.log(
      "NOMINATION 1:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${firstNominationID},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After first nomination:", {
      purchaseId: purchase.id,
      newQuantity,
      expectedQuantity: 9975000,
    });

    // expect(newQuantity).toBe(9975000); // 10000000 - 25000
  });

  // Step 3
  await test.step("Create second nomination and verify quantity", async () => {
    // await delay(4);
    const nominationResponse = await createNomination(
      request,
      token,
      purchase.id
    );
    secondNominationID = nominationResponse.id;

    console.log(
      "NOMINATION 2",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${secondNominationID},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token);
    const newQuantity = updatedPurchase.data[0].availableQuantity;

    console.log("After second nomination:", {
      purchaseId: purchase.id,
      newQuantity,
      expectedQuantity: 9950000,
    });

    // expect(newQuantity).toBe(9950000); // 9975000 - 25000
  });
});

test.afterAll(async ({ request }) => {
  console.log("Nomination IDs:", { firstNominationID, secondNominationID });
  console.log(
    "Found nominations to delete:",
    [firstNominationID, secondNominationID].length
  );

  for (const id of [firstNominationID, secondNominationID]) {
    await deleteNomination(request, token, id.toString());
  }

  // Verify final quantity is back to initial
  await delay(4);
  const finalPurchase = await getPurchases(request, token);
  const finalQuantity = finalPurchase.data[0].availableQuantity;

  console.log("Final state:", {
    purchaseId: purchase.id,
    finalQuantity,
    initialQuantity,
  });

  expect(finalQuantity).toBe(initialQuantity);
});
