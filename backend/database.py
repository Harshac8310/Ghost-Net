
import sqlite3
from pathlib import Path


DB_PATH = Path(__file__).resolve().parent / "ghostnet.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_filename TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                uploaded_at TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending_review'
            )
        """)


if __name__ == "__main__":
    initialize_database()
    print(f"Database initialized at: {DB_PATH}")

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "ghostnet.db"


def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def initialize_database():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image_filename TEXT NOT NULL,
                latitude REAL,
                longitude REAL,
                uploaded_at TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending_review'
            )
        """)


if __name__ == "__main__":
    initialize_database()
    print(f"Database initialized at: {DB_PATH}")
