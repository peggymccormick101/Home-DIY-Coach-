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
