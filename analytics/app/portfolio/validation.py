from typing import Any


def validate_portfolio(portfolio: dict[str, Any]) -> None:
    """
    Validate the structure and values of a portfolio.

    Raises:
        ValueError: If the portfolio is invalid.
    """

    if not isinstance(portfolio, dict):
        raise ValueError("Portfolio must be a JSON object.")

    if "funds" not in portfolio:
        raise ValueError("Portfolio must contain 'funds'.")

    funds = portfolio["funds"]

    if not isinstance(funds, list):
        raise ValueError("'funds' must be an array.")

    if len(funds) == 0:
        raise ValueError("Portfolio must contain at least one fund.")

    fund_names = set()

    for fund in funds:
        _validate_fund(fund, fund_names)


def _validate_fund(fund: dict[str, Any], fund_names: set[str]) -> None:

    if not isinstance(fund, dict):
        raise ValueError("Each fund must be an object.")

    required_fields = ["name", "value", "holdings"]

    for field in required_fields:
        if field not in fund:
            raise ValueError(f"Fund is missing required field: '{field}'.")

    name = fund["name"]

    if not isinstance(name, str) or not name.strip():
        raise ValueError("Fund name must be a non-empty string.")

    if name in fund_names:
        raise ValueError(f"Duplicate fund name: {name}")

    fund_names.add(name)

    value = fund["value"]

    if not isinstance(value, (int, float)) or isinstance(value, bool):
        raise ValueError(f"Fund value must be a number: {name}")

    if value <= 0:
        raise ValueError(f"Fund value must be greater than 0: {name}")

    holdings = fund["holdings"]

    if not isinstance(holdings, list):
        raise ValueError(f"'holdings' must be an array: {name}")

    if len(holdings) == 0:
        raise ValueError(f"Fund must contain holdings: {name}")

    _validate_holdings(holdings, name)


def _validate_holdings(holdings: list[dict[str, Any]], fund_name: str) -> None:

    total_weight = 0.0
    stock_symbols = set()

    for holding in holdings:

        if not isinstance(holding, dict):
            raise ValueError(f"Each holding must be an object: {fund_name}")

        required_fields = ["stockSymbol", "weight", "sector"]

        for field in required_fields:
            if field not in holding:
                raise ValueError(f"Holding is missing '{field}' " f"in {fund_name}.")

        stock_symbol = holding["stockSymbol"]

        if not isinstance(stock_symbol, str) or not stock_symbol.strip():
            raise ValueError(f"Invalid stock symbol in {fund_name}.")

        if stock_symbol in stock_symbols:
            raise ValueError(
                f"Duplicate stock symbol '{stock_symbol}' " f"in {fund_name}."
            )

        stock_symbols.add(stock_symbol)

        weight = holding["weight"]

        if not isinstance(weight, (int, float)) or isinstance(weight, bool):
            raise ValueError(
                f"Weight must be a number for " f"{stock_symbol} in {fund_name}."
            )

        if weight <= 0 or weight > 100:
            raise ValueError(
                f"Weight must be between 0 and 100 for "
                f"{stock_symbol} in {fund_name}."
            )

        sector = holding["sector"]

        if not isinstance(sector, str) or not sector.strip():
            raise ValueError(
                f"Sector must be a non-empty string for "
                f"{stock_symbol} in {fund_name}."
            )

        total_weight += weight

    if abs(total_weight - 100.0) > 1e-9:
        raise ValueError(
            f"Holdings for {fund_name} must total 100%. "
            f"Current total: {total_weight}%."
        )
