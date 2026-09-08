import { fireEvent, render, screen } from "@testing-library/react";
import CreatePortfolioPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useParams: () => ({}),
}));

describe("Create Portfolio Page", () => {
  test("shows the portfolio name input", () => {
    render(<CreatePortfolioPage />);

    expect(screen.getByLabelText(/portfolio name/i)).toBeInTheDocument();
  });
  test("shows fund name and fund value inputs", () => {
    render(<CreatePortfolioPage />);

    expect(screen.getByLabelText(/fund name/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/fund value/i)).toBeInTheDocument();
  });
  test("shows holding inputs", () => {
    render(<CreatePortfolioPage />);

    expect(screen.getByLabelText(/stock symbol/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/weight/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/sector/i)).toBeInTheDocument();
  });
  test("adds another holding when Add Holding is clicked", () => {
    render(<CreatePortfolioPage />);

    const addHoldingButton = screen.getByRole("button", {
      name: /add holding/i,
    });

    expect(screen.getAllByLabelText(/stock symbol/i)).toHaveLength(1);

    fireEvent.click(addHoldingButton);

    expect(screen.getAllByLabelText(/stock symbol/i)).toHaveLength(2);
  });
  test("removes a holding when Remove Holding is clicked", () => {
    render(<CreatePortfolioPage />);

    const addHoldingButton = screen.getByRole("button", {
      name: /add holding/i,
    });

    fireEvent.click(addHoldingButton);

    expect(screen.getAllByLabelText(/stock symbol/i)).toHaveLength(2);

    const removeButtons = screen.getAllByRole("button", {
      name: /remove holding/i,
    });

    fireEvent.click(removeButtons[1]);

    expect(screen.getAllByLabelText(/stock symbol/i)).toHaveLength(1);
  });
  test("does not remove the last holding", () => {
    render(<CreatePortfolioPage />);

    const removeButton = screen.getByRole("button", {
      name: /remove holding/i,
    });

    fireEvent.click(removeButton);

    expect(screen.getAllByLabelText(/stock symbol/i)).toHaveLength(1);
  });
  test("updates holding fields when the user types", () => {
    render(<CreatePortfolioPage />);

    const stockSymbolInput = screen.getByLabelText(/stock symbol/i);
    const weightInput = screen.getByLabelText(/weight/i);
    const sectorInput = screen.getByLabelText(/sector/i);

    fireEvent.change(stockSymbolInput, {
      target: { value: "INFY" },
    });

    fireEvent.change(weightInput, {
      target: { value: "30" },
    });

    fireEvent.change(sectorInput, {
      target: { value: "IT" },
    });

    expect(stockSymbolInput).toHaveValue("INFY");
    expect(weightInput).toHaveValue(30);
    expect(sectorInput).toHaveValue("IT");
  });
  test("stores holding values in the portfolio data when submitted", () => {
    render(<CreatePortfolioPage />);

    const stockSymbolInput = screen.getByLabelText(/stock symbol/i);
    const weightInput = screen.getByLabelText(/weight/i);
    const sectorInput = screen.getByLabelText(/sector/i);

    fireEvent.change(stockSymbolInput, {
      target: { value: "INFY" },
    });

    fireEvent.change(weightInput, {
      target: { value: "30" },
    });

    fireEvent.change(sectorInput, {
      target: { value: "IT" },
    });

    expect(stockSymbolInput.value).toBe("INFY");
    expect(weightInput.value).toBe("30");
    expect(sectorInput.value).toBe("IT");
  });
  test("shows the Create Portfolio button", () => {
    render(<CreatePortfolioPage />);

    expect(
      screen.getByRole("button", {
        name: /create portfolio/i,
      }),
    ).toBeInTheDocument();
  });
  test("submits the portfolio to the backend", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        _id: "test-id",
        portfolioName: "My Portfolio",
      }),
    });

    render(<CreatePortfolioPage />);

    // Fill the required fields so validation passes
    fireEvent.change(screen.getByLabelText(/portfolio name/i), { target: { value: "Valid Port" } });
    fireEvent.change(screen.getByLabelText(/fund name/i), { target: { value: "Valid Fund" } });
    fireEvent.change(screen.getByLabelText(/fund value/i), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText(/stock symbol/i), { target: { value: "AAPL" } });
    fireEvent.change(screen.getByLabelText(/weight/i), { target: { value: "100" } });
    fireEvent.change(screen.getByLabelText(/sector/i), { target: { value: "Tech" } });

    const createButton = screen.getByRole("button", {
      name: /create portfolio/i,
    });

    fireEvent.click(createButton);

    expect(global.fetch).toHaveBeenCalled();
  });
  test("submits the entered portfolio data", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        _id: "test-id",
      }),
    });

    render(<CreatePortfolioPage />);

    fireEvent.change(screen.getByLabelText(/portfolio name/i), {
      target: { value: "My Portfolio" },
    });

    fireEvent.change(screen.getByLabelText(/fund name/i), {
      target: { value: "Fund A" },
    });

    fireEvent.change(screen.getByLabelText(/fund value/i), {
      target: { value: "1000000" },
    });

    fireEvent.change(screen.getByLabelText(/stock symbol/i), {
      target: { value: "INFY" },
    });

    fireEvent.change(screen.getByLabelText(/weight/i), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByLabelText(/sector/i), {
      target: { value: "IT" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /create portfolio/i,
      }),
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/api/portfolios",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          portfolioName: "My Portfolio",
          funds: [
            {
              name: "Fund A",
              value: 1000000,
              holdings: [
                {
                  stockSymbol: "INFY",
                  weight: 100,
                  sector: "IT",
                },
              ],
            },
          ],
        }),
      }),
    );
  });
  test("shows an error when portfolio name is empty", () => {
    render(<CreatePortfolioPage />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /create portfolio/i,
      }),
    );

    expect(screen.getByText(/portfolio name is required/i)).toBeInTheDocument();
  });
});
