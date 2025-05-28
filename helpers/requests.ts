import { test, request, APIRequestContext, expect } from "@playwright/test";

export const login = async (request: APIRequestContext): Promise<string> => {
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
  expect(response.status()).toBe(200);
  return responseBody.token;
};

export const getPurchases = async (
  request: APIRequestContext,
  token: string
) => {
  const response = await request.get(
    "https://novalog-lxg5z.ondigitalocean.app/api/api/purchases?offset=0&limit=10&withProduct=true&withTerminal=true&withInitialPurchase=true&withDocuments=true&withShipper=true&status=pending",
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.json();
};

export const createNomination = async (
  request: APIRequestContext,
  token: string,
  purchaseId: string
) => {
  const response = await request.post(
    "https://novalog-lxg5z.ondigitalocean.app/api/api/nominations",
    {
      data: {
        nominationType: "sales",
        avizNumber: null,
        deliveryDate: null,
        originatingPurchase: purchaseId,
        contract: 224,
        destination: "sf",
        vehicleType: "train",
        vehicleID: "1",
        vehicleGross: null,
        vehicleWeight: null,
        netWeight: 25000,
        description: null,
        vehicleSubtype: null,
        bagsCount: 0,
        bagsCapacity: 0,
        bagsWeight: 1,
      },
      headers: {
        Authorization: token,
      },
    }
  );
  return response.json();
};

export const deleteNomination = async (
  request: APIRequestContext,
  token: string,
  nominationId: string
) => {
  const response = await request.delete(
    `https://novalog-lxg5z.ondigitalocean.app/api/api/nominations/${nominationId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  expect(response.status()).toBe(204);
};
