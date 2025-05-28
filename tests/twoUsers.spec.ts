import { test, expect } from "@playwright/test";
import {
  createNomination,
  getPurchases,
  loginAdmin,
  loginAdmin0,
  getNominations,
  deleteNomination,
} from "../helpers/requests";

let token: string;
let token1: string;
let initialQuantity: number;

const purchase = {
  id: "",
  quantity: 0,
};

test.beforeAll(async ({ request }) => {
  token = await loginAdmin(request);
  token1 = await loginAdmin0(request);
});

test("Create and verify 2 users create nominations with delays", async ({
  request,
}) => {
  // Step 1
  await test.step("Login users and get initial state", async () => {
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
  await test.step("First user creates first nomination", async () => {
    const nominationResponse = await createNomination(
      request,
      token,
      purchase.id
    );
    console.log(
      "First user - First nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token);
    const newQuantity = updatedPurchase.data[0].availableQuantity;
    console.log("After first user first nomination:", {
      purchaseId: purchase.id,
      newQuantity,
      expectedQuantity: 9975000,
    });
    expect(newQuantity).toBe(9975000);
  });

  // Step 3
  await test.step("First user creates second nomination", async () => {
    const nominationResponse = await createNomination(
      request,
      token,
      purchase.id
    );
    console.log(
      "First user - Second nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token);
    const newQuantity = updatedPurchase.data[0].availableQuantity;
    console.log("After first user second nomination:", {
      purchaseId: purchase.id,
      newQuantity,
      expectedQuantity: 9950000,
    });
    expect(newQuantity).toBe(9950000);
  });

  // Step 4: Wait for 4 seconds before second user starts
  await test.step("Wait before second user starts", async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000));
  });

  // Step 5: Second user creates first nomination
  await test.step("Second user creates first nomination", async () => {
    const nominationResponse = await createNomination(
      request,
      token1,
      purchase.id
    );
    console.log(
      "Second user - First nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token1);
    const newQuantity = updatedPurchase.data[0].availableQuantity;
    console.log("After second user first nomination:", {
      purchaseId: purchase.id,
      newQuantity,
      expectedQuantity: 9925000,
    });
    expect(newQuantity).toBe(9925000);
  });

  // Step 6: Second user creates second nomination
  await test.step("Second user creates second nomination", async () => {
    const nominationResponse = await createNomination(
      request,
      token1,
      purchase.id
    );
    console.log(
      "Second user - Second nomination:",
      `\noriginatingPurchase.id: ${nominationResponse.originatingPurchase.id},
      \nnomination.id: ${nominationResponse.id},
      \navailableQuantity: ${nominationResponse.originatingPurchase.availableQuantity}`
    );

    const updatedPurchase = await getPurchases(request, token1);
    const newQuantity = updatedPurchase.data[0].availableQuantity;
    console.log("After second user second nomination:", {
      purchaseId: purchase.id,
      newQuantity,
      expectedQuantity: 9900000,
    });
    expect(newQuantity).toBe(9900000);
  });
});

test.afterAll(async ({ request }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const nominationIds = await getNominations(request, token, purchase.id);
  console.log("Nomination IDs:", nominationIds);
  console.log("Found nominations to delete:", nominationIds.length);

  for (const id of nominationIds) {
    await deleteNomination(request, token, id.toString());
  }

  // Verify final quantity is back to initial
  const finalPurchase = await getPurchases(request, token);
  const finalQuantity = finalPurchase.data[0].availableQuantity;
  console.log("Final state:", {
    purchaseId: purchase.id,
    finalQuantity,
    initialQuantity,
  });
  expect(finalQuantity).toBe(initialQuantity);
});
