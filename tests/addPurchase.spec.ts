// import { test, expect } from "@playwright/test";
// import { loginAdmin } from "../helpers/requests";
// import { randomNumber } from "../helpers/utils";

// test("Add purchase", async ({ request }) => {
//   const token = await loginAdmin(request);

//   const response = await request.post(
//     "https://novalog-lxg5z.ondigitalocean.app/api/api/purchases",
//     {
//       headers: { Authorization: token },
//       data: {
//         date: "2025-05-29T12:00:00.000Z",
//         terminal: "410cdd8a-7bff-45c9-b182-9c28e33c97c2",
//         description: null,
//         product: "f4e1025e-3ea7-4e2c-94f8-d188ec11cf44",
//         quantity: 10000000,
//         vessel: `Automation ${randomNumber()}`,
//         shipper: "2437183f-a3b6-4d94-b11d-e8815120963e",
//         status: "pending",
//         dvi: 10000000,
//       },
//     }
//   );

//   expect(response.status()).toBe(201);
//   console.log(await response.json());
//   return response.json();
// });
