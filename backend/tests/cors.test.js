const request = require("supertest");

jest.mock("../src/services/portfolio.service", () => ({
  getAllPortfolios: jest.fn().mockResolvedValue([]),
}));

const app = require("../src/app");

describe("CORS", () => {
  test("allows requests from the Next.js frontend", async () => {
    const response = await request(app)
      .get("/api/portfolios")
      .set("Origin", "http://localhost:3000");

    expect(response.headers["access-control-allow-origin"]).toBe(
      "http://localhost:3000",
    );
  });
});
