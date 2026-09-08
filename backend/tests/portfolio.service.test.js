const Portfolio = require("../src/models/portfolio.model");

const { savePortfolio } = require("../src/services/portfolio.service");

jest.mock("../src/models/portfolio.model");

describe("portfolio service", () => {
  test("saves a portfolio and returns the saved document", async () => {
    const portfolioData = {
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

    const savedPortfolio = {
      _id: "portfolio123",
      ...portfolioData,
    };

    Portfolio.create.mockResolvedValue(savedPortfolio);

    const result = await savePortfolio(portfolioData);

    expect(Portfolio.create).toHaveBeenCalledWith(portfolioData);
    expect(result).toEqual(savedPortfolio);
  });
});
