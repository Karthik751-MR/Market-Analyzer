from collections import defaultdict
from typing import Any


def calculate_fund_weights(funds: list[dict[str, Any]]) -> dict[str, float]:

    total_value = sum(fund["value"] for fund in funds)

    return {fund["name"]: fund["value"] / total_value for fund in funds}


def calculate_sector_exposure(funds: list[dict[str, Any]]) -> dict[str, float]:
    """
    Calculate portfolio-level weighted sector exposure.
    """

    fund_weights = calculate_fund_weights(funds)

    sector_exposure = defaultdict(float)

    for fund in funds:

        fund_weight = fund_weights[fund["name"]]

        for holding in fund["holdings"]:

            sector = holding["sector"]

            holding_weight = holding["weight"] / 100

            sector_exposure[sector] += fund_weight * holding_weight

    return {
        sector: round(weight * 100, 2) for sector, weight in sector_exposure.items()
    }
