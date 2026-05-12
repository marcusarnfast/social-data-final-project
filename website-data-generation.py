#!/usr/bin/env python3
"""Build website data assets from raw CSVs.

Currently produces:
  * `www/public/map-geojsons/conflict_monthly_map_icons.geojson`
    Filtered monthly conflict icon GeoJSON for the Mapbox symbol layer
    (Americas ACLED regions omitted to limit file size).
  * `www/public/data/propellant-prices.json`
    Monthly average petrol/diesel prices (DKK/L) for the story timeline chart.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent

# Match notebook.ipynb: restrict heatmap / map markers to these buckets.
FOCUS_EVENT_TYPES = [
    "Battles",
    "Explosions/Remote violence",
    "Riots",
    "Violence against civilians",
]
FOCUS_SUB_EVENT_TYPES = [
    "Air/drone strike",
    "Armed clash",
    "Attack",
    "Chemical weapon",
    "Disrupted weapons use",
    "Government regains territory",
    "Grenade",
    "Looting/property destruction",
    "Non-state actor overtakes territory",
    "Non-violent transfer of territory",
    "Remote explosive/landmine/IED",
    "Shelling/artillery/missile attack",
    "Suicide bomb",
]

# ACLED `REGION` values for the Americas — excluded to keep the map GeoJSON small.
EXCLUDED_AMERICAS_REGIONS = frozenset(
    {
        "Caribbean",
        "Central America",
        "North America",
        "South America",
    }
)

# ACLED `EVENT_TYPE` -> map `icon` (must be one of MAP_MONTHLY_EVENT_ICONS in the web app).
EVENT_TYPE_TO_ICON: dict[str, str] = {
    "Battles": "battles",
    "Explosions/Remote violence": "explosions-remote-violence",
    "Protests": "protest",
    "Riots": "riots",
    "Strategic developments": "strategic-developments",
    "Violence against civilians": "violence-against-civilians",
}


# --------------------------------------------------------------------------- #
# Conflict monthly icons GeoJSON
# --------------------------------------------------------------------------- #

def utc_month_bounds_ms(year: int, month: int) -> tuple[int, int]:
    """First ms of month (inclusive) and last ms of month (inclusive), UTC."""
    start = datetime(year, month, 1, tzinfo=timezone.utc)
    if month == 12:
        next_month = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
    else:
        next_month = datetime(year, month + 1, 1, tzinfo=timezone.utc)
    end = next_month - timedelta(milliseconds=1)
    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)


def features_from_rows(df: pd.DataFrame) -> list[dict]:
    """GeoJSON Feature dicts with valid JSON-native values."""
    out: list[dict] = []
    for row in df.itertuples(index=False):
        month_str = row.month
        y, m = int(month_str[:4]), int(month_str[5:7])
        month_start_ts, month_end_ts = utc_month_bounds_ms(y, m)
        lon = float(row.CENTROID_LONGITUDE)
        lat = float(row.CENTROID_LATITUDE)
        out.append(
            {
                "type": "Feature",
                "properties": {
                    "month": month_str,
                    "month_start_ts": month_start_ts,
                    "month_end_ts": month_end_ts,
                    "icon": row.icon,
                },
                "geometry": {"type": "Point", "coordinates": [lon, lat]},
            }
        )
    return out


def build_conflict_geojson(*, dedupe: bool) -> dict:
    csv_path = REPO_ROOT / "data" / "conflict-index.csv"
    conflict = pd.read_csv(csv_path)
    conflict["WEEK"] = pd.to_datetime(conflict["WEEK"], utc=True)
    conflict = conflict[~conflict["REGION"].isin(EXCLUDED_AMERICAS_REGIONS)]
    conflict = conflict[
        conflict["EVENT_TYPE"].isin(FOCUS_EVENT_TYPES)
        & conflict["SUB_EVENT_TYPE"].isin(FOCUS_SUB_EVENT_TYPES)
    ].copy()

    conflict["month"] = conflict["WEEK"].dt.strftime("%Y-%m")

    mapped = conflict["EVENT_TYPE"].map(EVENT_TYPE_TO_ICON)
    unknown = conflict.loc[mapped.isna(), "EVENT_TYPE"].dropna().unique()
    if len(unknown):
        print(
            "Warning: skipping rows with unknown EVENT_TYPE (no icon mapping):",
            list(unknown),
            file=sys.stderr,
        )
    conflict = conflict.loc[mapped.notna()].copy()
    conflict["icon"] = mapped[mapped.notna()].astype(str)

    conflict = conflict.dropna(subset=["CENTROID_LATITUDE", "CENTROID_LONGITUDE"])

    # Stable order for reproducible diffs.
    conflict = conflict.sort_values(
        ["month", "CENTROID_LONGITUDE", "CENTROID_LATITUDE", "icon"]
    )

    if dedupe:
        conflict = conflict.drop_duplicates(
            subset=["month", "CENTROID_LONGITUDE", "CENTROID_LATITUDE", "icon"],
            keep="first",
        )

    return {"type": "FeatureCollection", "features": features_from_rows(conflict)}


def write_conflict_icons(out_path: Path, *, dedupe: bool) -> int:
    geojson = build_conflict_geojson(dedupe=dedupe)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(geojson, f, separators=(",", ":"), ensure_ascii=False)
    return len(geojson["features"])


# --------------------------------------------------------------------------- #
# Propellant prices JSON
# --------------------------------------------------------------------------- #

# Match the consumer (`story-timeline.tsx`): only petrol & diesel are charted.
# The CSV does not contain electricity prices, so we omit the `electric` field.
PRICE_FUEL_TYPES = ("petrol", "diesel")

# Story timeline only reads dates inside [STORY_START, STORY_END]; the CSV runs
# from 2007, but earlier data lets the existing chart zoom out cleanly.
PRICE_START_YEAR = 2010


def build_propellant_prices() -> list[dict]:
    csv_path = REPO_ROOT / "data" / "fuel-prices.csv"
    df = pd.read_csv(csv_path)
    df["date"] = pd.to_datetime(df["date"], utc=False)
    df["fuel_type"] = df["fuel_type"].str.strip().str.lower()
    df = df[df["fuel_type"].isin(PRICE_FUEL_TYPES)]
    df = df.dropna(subset=["price"])

    # Daily prices -> monthly mean per fuel, anchored to first day of month.
    df["month"] = df["date"].dt.to_period("M").dt.to_timestamp()
    monthly = (
        df.groupby(["month", "fuel_type"], as_index=False)["price"]
        .mean()
        .pivot(index="month", columns="fuel_type", values="price")
        .sort_index()
    )

    monthly = monthly.loc[monthly.index.year >= PRICE_START_YEAR]
    monthly = monthly.dropna(subset=list(PRICE_FUEL_TYPES))
    monthly = monthly.round(3)

    rows: list[dict] = []
    for ts, row in monthly.iterrows():
        rows.append(
            {
                "date": ts.strftime("%Y-%m-%d"),
                "petrol": float(row["petrol"]),
                "diesel": float(row["diesel"]),
            }
        )
    return rows


def write_propellant_prices(out_path: Path) -> int:
    rows = build_propellant_prices()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(rows, f, separators=(",", ":"), ensure_ascii=False)
    return len(rows)


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #

DATASETS = ("conflict-icons", "propellant-prices")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--only",
        choices=DATASETS,
        action="append",
        help="Build a subset of datasets. May be passed multiple times. "
        "Default: build all.",
    )
    parser.add_argument(
        "--conflict-output",
        type=Path,
        default=Path("www/public/map-geojsons/conflict_monthly_map_icons.geojson"),
        help="Output path for conflict icons GeoJSON.",
    )
    parser.add_argument(
        "--prices-output",
        type=Path,
        default=Path("www/public/data/propellant-prices.json"),
        help="Output path for propellant prices JSON.",
    )
    parser.add_argument(
        "--no-dedupe",
        action="store_true",
        help="For conflict icons: emit one feature per filtered CSV row "
        "(much larger). Default merges identical month+coordinates+icon.",
    )
    args = parser.parse_args()

    selected = set(args.only) if args.only else set(DATASETS)

    if "conflict-icons" in selected:
        out = (
            args.conflict_output
            if args.conflict_output.is_absolute()
            else REPO_ROOT / args.conflict_output
        )
        n = write_conflict_icons(out, dedupe=not args.no_dedupe)
        print(f"Wrote {n} features to {out}")

    if "propellant-prices" in selected:
        out = (
            args.prices_output
            if args.prices_output.is_absolute()
            else REPO_ROOT / args.prices_output
        )
        n = write_propellant_prices(out)
        print(f"Wrote {n} monthly rows to {out}")


if __name__ == "__main__":
    main()
