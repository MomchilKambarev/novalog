import { test, expect } from "@playwright/test";

test("has title", async ({ request }) => {
  const response = await request.post(
    "https://novalog-lxg5z.ondigitalocean.app/api/api/login",
    {
      data: {
        username: "admin",
        password: "admin123",
      },
    }
  );
  const responseBody = await response.json();
  const token = responseBody.token;
  console.log(token);
});
