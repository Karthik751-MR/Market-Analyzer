def calculate_hhi(sector_exposure: dict[str, float]) -> float:
    """
    Calculate Herfindahl-Hirschman Index.

    Sector exposure is expected as percentages,
    e.g. 44.0 means 44%.
    """

    hhi = 0.0

    for percentage in sector_exposure.values():

        decimal = percentage / 100

        hhi += decimal**2

    return hhi


def calculate_sector_score(hhi: float) -> float:
    """
    Convert HHI into a diversification score.

    Lower concentration = higher score.
    """

    return (1 - hhi) * 100
