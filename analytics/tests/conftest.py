import sys
from pathlib import Path

ANALYTICS_ROOT = Path(__file__).resolve().parents[1]

if str(ANALYTICS_ROOT) not in sys.path:
    sys.path.insert(0, str(ANALYTICS_ROOT))
