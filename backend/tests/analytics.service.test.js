const axios = require("axios");

const { analyzePortfolio } = require("../src/services/analytics.service");

jest.mock("axios");

describe("analytics service", () => {
  test("sends portfolio to Python analytics service and returns its result", async () => {
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

    const pythonResult = {
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

    axios.post.mockResolvedValue({
      data: pythonResult,
    });

    const result = await analyzePortfolio(portfolio);

    expect(axios.post).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/analyze/portfolio",
      portfolio,
    );

    expect(result).toEqual(pythonResult);
  });
});
