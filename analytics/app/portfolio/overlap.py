from itertools import combinations
from typing import Any


def calculate_pairwise_overlap(fund_a: dict[str, Any], fund_b: dict[str, Any]) -> float:
    """
    Calculate overlap between two funds.

    For every stock held by both funds:

        overlap += min(weight_a, weight_b)

    Returns:
        Overlap percentage.
    """

    holdings_a = {
        holding["stockSymbol"]: holding["weight"] for holding in fund_a["holdings"]
    }

    holdings_b = {
        holding["stockSymbol"]: holding["weight"] for holding in fund_b["holdings"]
    }

    overlap = 0.0

    common_stocks = set(holdings_a) & set(holdings_b)

    for stock in common_stocks:
        overlap += min(holdings_a[stock], holdings_b[stock])

    return overlap


def calculate_all_overlaps(funds: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Calculate overlap for every unique pair of funds.
    """

    results = []

    for fund_a, fund_b in combinations(funds, 2):

        overlap = calculate_pairwise_overlap(fund_a, fund_b)

        results.append(
            {
                "fundA": fund_a["name"],
                "fundB": fund_b["name"],
                "overlap": round(overlap, 2),
            }
        )

    return results


def calculate_average_overlap(pairwise_overlaps: list[dict[str, Any]]) -> float:

    if not pairwise_overlaps:
        return 0.0

    total = sum(result["overlap"] for result in pairwise_overlaps)

    return total / len(pairwise_overlaps)


def calculate_overlap_score(average_overlap: float) -> float:
    """
    Convert average overlap into an overlap score.

    Higher overlap = lower score.
    """

    return (1 - average_overlap / 100) * 100
