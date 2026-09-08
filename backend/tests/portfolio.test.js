const request = require("supertest");

const app = require("../src/app");

jest.mock("../src/services/analytics.service", () => ({
  analyzePortfolio: jest.fn(),
}));

const { analyzePortfolio } = require("../src/services/analytics.service");

describe("POST /api/portfolio/analyze", () => {
  test("analyzes a portfolio using the analytics service", async () => {
    const portfolio = {
      portfolioName: "Test Portfolio",
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



    const analysisResult = {
      portfolioValue: 1000000,
      overlap: {},
      sectors: {
        IT: 50,
        Banking: 50,
      },
      hhi: 0.5,
      sectorScore: 50,
      diversificationScore: 50,
    };

    analyzePortfolio.mockResolvedValue(analysisResult);

    const response = await request(app)
      .post("/api/portfolio/analyze")
      .send(portfolio);

    expect(response.statusCode).toBe(200);

    expect(analyzePortfolio).toHaveBeenCalledWith(portfolio);

    expect(response.body).toEqual(analysisResult);
  });
  test("returns 503 when analytics service is unavailable", async () => {
    const error = new Error("connect ECONNREFUSED");
    error.code = "ECONNREFUSED";

    analyzePortfolio.mockRejectedValue(error);

    const portfolio = {
      portfolioName: "Test Portfolio",
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

    const response = await request(app)
      .post("/api/portfolio/analyze")
      .send(portfolio);

    expect(response.statusCode).toBe(503);

    expect(response.body).toEqual({
      error: "Analytics service unavailable",
    });
  });
});
