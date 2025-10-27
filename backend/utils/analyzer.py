import re
import json
import tldextract
import requests
from urllib.parse import urlparse


SUSPICIOUS_KEYWORDS = [
    "login", "verify", "secure", "account", "bank", "update",
    "confirm", "free", "gift", "bonus", "win", "password",
]


def _score(add: int, reasons: list, reason_text: str, weights: dict):
    reasons.append(reason_text)
    weights[reason_text] = add
    return add


def analyze_url(url: str) -> dict:
    reasons = []
    score_weights = {}
    risk = 0

    try:
        parsed = urlparse(url)

        if parsed.scheme != "https":
            risk += _score(20, reasons, "No HTTPS", score_weights)

        # Extract domain info
        ext = tldextract.extract(url)
        subdomain = ext.subdomain
        domain = ext.domain
        suffix = ext.suffix

        if len(url) > 100:
            risk += _score(10, reasons, "URL is very long", score_weights)

        if "%" in url or "+" in url:
            risk += _score(10, reasons, "Encoded characters in URL", score_weights)

        if subdomain and subdomain.count(".") >= 2:
            risk += _score(10, reasons, "Too many subdomains", score_weights)

        if "-" in domain:
            risk += _score(8, reasons, "Hyphenated domain", score_weights)

        # Suspicious keywords
        lowered = url.lower()
        found_keywords = [k for k in SUSPICIOUS_KEYWORDS if k in lowered]
        if found_keywords:
            risk += _score(15, reasons, f"Suspicious keywords: {', '.join(found_keywords)}", score_weights)

        # Technical check: redirects
        try:
            resp = requests.get(url, timeout=8, allow_redirects=True)
            if len(resp.history) >= 3:
                risk += _score(12, reasons, "Excessive redirects", score_weights)
        except Exception:
            risk += _score(10, reasons, "URL not reachable", score_weights)

        # Clamp score
        if risk >= 70:
            status = "Phishing"
        elif risk >= 40:
            status = "Suspicious"
        else:
            status = "Safe"

        return {
            "url": url,
            "risk_score": int(min(100, max(0, risk))),
            "status": status,
            "reasons": reasons,
        }
    except Exception:
        return {
            "url": url,
            "risk_score": 90,
            "status": "Phishing",
            "reasons": ["Malformed URL or analysis error"],
        }
