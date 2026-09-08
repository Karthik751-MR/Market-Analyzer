const request = require("supertest");

const { savePortfolio } = require("../src/services/portfolio.service");

jest.mock("../src/services/portfolio.service");

const app = require("../src/app");

describe("POST /api/portfolios", () => {
  test("saves a portfolio and returns the saved portfolio", async () => {
    const portfolioData = {
      portfolioName: "My Portfolio",
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

    const savedPortfolio = {
      _id: "portfolio123",
      ...portfolioData,
    };

    savePortfolio.mockResolvedValue(savedPortfolio);

    const response = await request(app)
      .post("/api/portfolios")
      .send(portfolioData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(savedPortfolio);

    expect(savePortfolio).toHaveBeenCalledWith(portfolioData);
  });
});
