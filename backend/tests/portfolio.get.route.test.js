const request = require("supertest");

const Portfolio = require("../src/models/portfolio.model");

jest.mock("../src/models/portfolio.model");

const app = require("../src/app");

describe("GET /api/portfolios", () => {
  test("returns all saved portfolios", async () => {
    const portfolios = [
      {
        _id: "portfolio1",
        portfolioName: "Portfolio A",
        funds: [],
      },
      {
        _id: "portfolio2",
        portfolioName: "Portfolio B",
        funds: [],
      },
    ];

    Portfolio.find.mockResolvedValue(portfolios);

    const response = await request(app).get("/api/portfolios");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(portfolios);

    expect(Portfolio.find).toHaveBeenCalledWith({});
  });
});
