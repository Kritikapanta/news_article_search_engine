from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import feedparser
import numpy as np
import re
from collections import defaultdict
from datetime import datetime, timezone
from urllib.parse import quote_plus

app = Flask(__name__)
CORS(app)

# =========================
# CONFIG (MATCH ORIGINAL)
# =========================
NEWS_API_KEY = "12ad376c3d5c4134b493484d2711eb14"
ARTICLES_PER_QUERY = 50
RESULTS_PER_PAGE = 10

NEPALI_SITES = [
    "onlinekhabar.com",
    "kantipurdaily.com",
    "setopati.com",
    "nagariknews.nagariknetwork.com",
    "annapurnapost.com",
    "ratopati.com",
    "ronbpost.com"
]

LOCAL_KEYWORDS = [
    "nepal", "kathmandu", "pokhara", "lalitpur",
    "butwal", "biratnagar", "birgunj",
    "province", "palika",
    "नेपाल", "काठमाडौं", "पोखरा"
]

# =========================
# UTILITIES (UNCHANGED)
# =========================
def preprocess(text):
    return re.findall(r"\b\w+\b", str(text).lower())

def is_local_query(query):
    return any(k in query.lower() for k in LOCAL_KEYWORDS)

def time_decay(published_at, rate=0.04):
    try:
        t = datetime.fromisoformat(published_at.replace("Z", "+00:00"))
        age = (datetime.now(timezone.utc) - t).total_seconds() / 3600
        return np.exp(-rate * age)
    except:
        return 1.0

def source_boost(source, local_query):
    source = (source or "").lower()
    if any(site in source for site in NEPALI_SITES):
        return 1.25 if local_query else 0.9
    return 1.0

# =========================
# FETCH NEWS (UNCHANGED)
# =========================
def fetch_international_news(query):
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "language": "en",
        "pageSize": ARTICLES_PER_QUERY,
        "sortBy": "publishedAt",
        "apiKey": NEWS_API_KEY
    }

    data = requests.get(url, params=params).json()
    docs, meta = {}, {}
    idx = 0

    for a in data.get("articles", []):
        text = (a.get("title") or "") + " " + (a.get("description") or "")
        if not text.strip():
            continue

        docs[idx] = text
        meta[idx] = {
            "title": a.get("title"),
            "url": a.get("url"),
            "source": a.get("source", {}).get("name"),
            "publishedAt": a.get("publishedAt")
        }
        idx += 1

    return docs, meta

def fetch_nepal_news(query):
    encoded = quote_plus(query)
    docs, meta = {}, {}
    idx = 0

    for site in NEPALI_SITES:
        rss = (
            f"https://news.google.com/rss/search?"
            f"q={encoded}+site:{site}&hl=en-NP&gl=NP&ceid=NP:en"
        )

        feed = feedparser.parse(rss)
        for e in feed.entries:
            text = (e.get("title", "") + " " + e.get("summary", "")).strip()
            if not text:
                continue

            docs[idx] = text
            meta[idx] = {
                "title": e.get("title"),
                "url": e.get("link"),
                "source": site,
                "publishedAt": e.get("published")
            }
            idx += 1

    return docs, meta

# =========================
# BM25 (UNCHANGED)
# =========================
def build_index(docs):
    index = defaultdict(list)
    lengths = {}
    total = 0

    for i, text in docs.items():
        terms = preprocess(text)
        lengths[i] = len(terms)
        total += len(terms)

        freq = defaultdict(int)
        for t in terms:
            freq[t] += 1

        for t, f in freq.items():
            index[t].append((i, f))

    avg_dl = total / max(1, len(docs))
    return index, lengths, avg_dl

def bm25(query, index, lengths, avg_dl):
    scores = defaultdict(float)
    N = len(lengths)

    for term in preprocess(query):
        if term not in index:
            continue

        df = len(index[term])
        idf = np.log((N - df + 0.5) / (df + 0.5) + 1)

        for doc, f in index[term]:
            denom = f + 1.5 * (1 - 0.75 + 0.75 * lengths[doc] / avg_dl)
            scores[doc] += idf * (f * 2.5) / denom

    return scores

# =========================
# API (MATCHES ORIGINAL SEARCH)
# =========================
@app.route("/api/search")
def api_search():
    query = request.args.get("q", "")
    page = int(request.args.get("page", 1))

    if not query:
        return jsonify({"results": [], "total": 0})

    local_query = is_local_query(query)
    docs, meta = fetch_international_news(query)

    if local_query:
        np_docs, np_meta = fetch_nepal_news(query)
        offset = len(docs)
        docs.update({k + offset: v for k, v in np_docs.items()})
        meta.update({k + offset: v for k, v in np_meta.items()})

    index, lengths, avg_dl = build_index(docs)
    bm25_scores = bm25(query, index, lengths, avg_dl)

    # EXACT SAME FINAL SCORE LOGIC
    final_scores = {}
    for d in docs:
        score = bm25_scores.get(d, 0)
        decay = time_decay(meta[d]["publishedAt"])
        boost = source_boost(meta[d]["source"], local_query)
        final_scores[d] = boost * (0.7 * score + 0.3 * decay)

    ranked = sorted(final_scores.items(), key=lambda x: x[1], reverse=True)

    total = len(ranked)
    start = (page - 1) * RESULTS_PER_PAGE
    end = start + RESULTS_PER_PAGE

    results = []
    for doc_id, score in ranked[start:end]:
        item = meta[doc_id]
        results.append({
            "title": item["title"],
            "url": item["url"],
            "source": item["source"],
            "publishedAt": item["publishedAt"],
            "score": score
        })

    return jsonify({
        "query": query,
        "results": results,
        "total": total,
        "page": page,
        "total_pages": (total + RESULTS_PER_PAGE - 1) // RESULTS_PER_PAGE
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)
