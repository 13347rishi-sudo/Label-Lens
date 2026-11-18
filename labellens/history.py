"""
history.py - SQLite-backed scan history for LabelLens.
Stores product scans with timestamps and full result data.
"""
import sqlite3
import json
import os
from datetime import datetime
from typing import Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "scan_history.db")


def _get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create tables if they don't exist."""
    with _get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                product_name TEXT,
                grade TEXT,
                score_1_to_10 REAL,
                adjusted_score REAL,
                profile_name TEXT,
                verdict TEXT,
                nutrition_json TEXT,
                ingredients_json TEXT,
                score_result_json TEXT,
                knowledge_result_json TEXT,
                profile_result_json TEXT,
                is_demo INTEGER DEFAULT 0
            )
        """)
        conn.commit()


def save_scan(
    product_name: Optional[str],
    grade: str,
    score_1_to_10: float,
    adjusted_score: float,
    profile_name: str,
    verdict: str,
    nutrition: dict,
    ingredients: list,
    score_result: dict,
    knowledge_result: dict,
    profile_result: dict,
    is_demo: bool = False,
) -> int:
    """Save a scan result. Returns the new row ID."""
    init_db()
    ts = datetime.now().isoformat(sep=" ", timespec="seconds")
    with _get_connection() as conn:
        cursor = conn.execute(
            """INSERT INTO scans
               (timestamp, product_name, grade, score_1_to_10, adjusted_score,
                profile_name, verdict, nutrition_json, ingredients_json,
                score_result_json, knowledge_result_json, profile_result_json, is_demo)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                ts,
                product_name or "Unknown",
                grade,
                score_1_to_10,
                adjusted_score,
                profile_name,
                verdict,
                json.dumps(nutrition),
                json.dumps(ingredients),
                json.dumps(score_result),
                json.dumps(knowledge_result),
                json.dumps(profile_result),
                1 if is_demo else 0,
            ),
        )
        conn.commit()
        return cursor.lastrowid


def get_history(limit: int = 50, include_demo: bool = False) -> list:
    """
    Fetch recent scan history.

    Args:
        limit: max rows to return.
        include_demo: whether to include demo scans.

    Returns:
        List of dicts with scan data.
    """
    init_db()
    with _get_connection() as conn:
        query = "SELECT * FROM scans"
        params = []
        if not include_demo:
            query += " WHERE is_demo = 0"
        query += " ORDER BY timestamp DESC LIMIT ?"
        params.append(limit)
        rows = conn.execute(query, params).fetchall()

    result = []
    for row in rows:
        d = dict(row)
        for field in ("nutrition_json", "ingredients_json", "score_result_json",
                      "knowledge_result_json", "profile_result_json"):
            key = field.replace("_json", "")
            try:
                d[key] = json.loads(d[field]) if d[field] else {}
            except (json.JSONDecodeError, TypeError):
                d[key] = {}
        result.append(d)
    return result


def get_scan(scan_id: int) -> Optional[dict]:
    """Fetch a single scan by ID."""
    init_db()
    with _get_connection() as conn:
        row = conn.execute("SELECT * FROM scans WHERE id = ?", (scan_id,)).fetchone()
    if not row:
        return None
    d = dict(row)
    for field in ("nutrition_json", "ingredients_json", "score_result_json",
                  "knowledge_result_json", "profile_result_json"):
        key = field.replace("_json", "")
        try:
            d[key] = json.loads(d[field]) if d[field] else {}
        except (json.JSONDecodeError, TypeError):
            d[key] = {}
    return d


def delete_scan(scan_id: int) -> bool:
    """Delete a scan by ID. Returns True if deleted."""
    init_db()
    with _get_connection() as conn:
        cursor = conn.execute("DELETE FROM scans WHERE id = ?", (scan_id,))
        conn.commit()
        return cursor.rowcount > 0


def clear_history(include_demo: bool = False):
    """Clear all scan history."""
    init_db()
    with _get_connection() as conn:
        if include_demo:
            conn.execute("DELETE FROM scans")
        else:
            conn.execute("DELETE FROM scans WHERE is_demo = 0")
        conn.commit()


def get_stats() -> dict:
    """Return summary statistics from scan history."""
    init_db()
    with _get_connection() as conn:
        total = conn.execute("SELECT COUNT(*) FROM scans WHERE is_demo=0").fetchone()[0]
        grades = conn.execute(
            "SELECT grade, COUNT(*) as cnt FROM scans WHERE is_demo=0 GROUP BY grade"
        ).fetchall()
        avg_score = conn.execute(
            "SELECT AVG(score_1_to_10) FROM scans WHERE is_demo=0"
        ).fetchone()[0]

    return {
        "total_scans": total,
        "grade_distribution": {r["grade"]: r["cnt"] for r in grades},
        "average_score": round(avg_score, 1) if avg_score else 0.0,
    }
