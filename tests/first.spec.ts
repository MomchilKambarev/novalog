import { test } from "@playwright/test";
import { createNomination, getPurchases, login } from "../helpers/requests";

let token: string;

const purchase = {
  id: "",
  quantity: 0,
};

test.beforeAll(async ({ request }) => {
  token = await login(request);
});

test("Create nomination", async ({ request }) => {
  
  await test.step("Get purchase", async () => {
    const responseBody = await getPurchases(request, token);
    purchase.id = responseBody.data[0].id;
    purchase.quantity = responseBody.data[0].quantity;
  });

  await test.step("Create nomination", async () => {
    const nominationResponse = await createNomination(
      request,
      token,
      purchase.id
    );
    console.log(nominationResponse);
  });
});
