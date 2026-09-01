import logging

import requests

logger = logging.getLogger(__name__)

OPENVERSE_URL = "https://api.openverse.org/v1/images/"


def search_images(query: str, count: int = 3) -> list[dict]:
    """Search Openverse (openly-licensed images, no API key required) and
    return up to `count` results. Never raises — returns [] on any failure
    so a flaky image search never blocks project creation."""
    try:
        response = requests.get(
            OPENVERSE_URL,
            params={
                "q": query,
                "page_size": count,
                "license_type": "commercial,modification",
            },
            headers={"User-Agent": "HomeDIYCoach/1.0"},
            timeout=8,
        )
        response.raise_for_status()
        data = response.json()
    except (requests.RequestException, ValueError) as e:
        logger.warning("Openverse image search failed for %r: %s", query, e)
        return []

    results = []
    for item in data.get("results", [])[:count]:
        url = item.get("url")
        if not url:
            continue
        results.append(
            {
                "url": url,
                "thumbnail_url": item.get("thumbnail") or url,
                "title": item.get("title"),
                "source_url": item.get("foreign_landing_url"),
                "creator": item.get("creator"),
            }
        )
    return results


_CATEGORY_KEYWORDS = [
    ("deck", ["deck", "patio", "porch"]),
    ("garden", ["garden", "yard", "landscap", "plant", "flower", "lawn", "mulch"]),
    ("kitchen", ["kitchen", "cabinet", "countertop", "backsplash"]),
    ("bathroom", ["bathroom", "bath", "shower", "tile", "vanity"]),
    ("room interior", ["paint", "room", "wall", "interior", "bedroom", "living room"]),
    ("shed storage", ["shed", "storage", "garage", "shelving", "closet"]),
]


def broad_fallback_term(text: str) -> str:
    """Map free text to a short, well-supported search category as a last
    resort when a more specific query returns no Openverse results."""
    lower = text.lower()
    for term, keywords in _CATEGORY_KEYWORDS:
        if any(k in lower for k in keywords):
            return term
    return "home improvement"


def search_images_with_fallback(queries: list[str], count: int = 3) -> list[dict]:
    """Try each query in order, returning the first result set that isn't
    empty. Skips blank/duplicate queries."""
    seen = set()
    for query in queries:
        query = (query or "").strip()
        if not query or query.lower() in seen:
            continue
        seen.add(query.lower())
        results = search_images(query, count=count)
        if results:
            return results
    return []
