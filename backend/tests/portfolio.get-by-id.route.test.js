const request = require("supertest");

const Portfolio = require("../src/models/portfolio.model");

jest.mock("../src/models/portfolio.model");

const app = require("../src/app");

describe("GET /api/portfolios/:id", () => {
  test("returns a portfolio by its id", async () => {
    const portfolio = {
      _id: "6a9bb0b8dcabb9148cc205d3",
      portfolioName: "Atlas Test Portfolio",
      funds: [
        {
          name: "Fund A",
          value: 1000000,
          holdings: [
            {
              stockSymbol: "INFY",
              weight: 50,
              sector: "IT",
            },
            {
              stockSymbol: "HDFCBANK",
              weight: 50,
              sector: "Banking",
            },
          ],
        },
      ],
    };

    Portfolio.findById.mockResolvedValue(portfolio);

    const response = await request(app).get(
      "/api/portfolios/6a9bb0b8dcabb9148cc205d3",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(portfolio);

    expect(Portfolio.findById).toHaveBeenCalledWith("6a9bb0b8dcabb9148cc205d3");
  });
});
