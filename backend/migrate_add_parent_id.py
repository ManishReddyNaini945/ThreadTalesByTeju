"""
Run this once to add parent_id column to the categories table.
  python migrate_add_parent_id.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.database import engine

def run():
    with engine.connect() as conn:
        # Check if column already exists
        result = conn.execute(text(
            "SELECT column_name FROM information_schema.columns "
            "WHERE table_name='categories' AND column_name='parent_id'"
        ))
        if result.fetchone():
            print("parent_id column already exists. Nothing to do.")
            return

        print("Adding parent_id column to categories...")
        conn.execute(text(
            "ALTER TABLE categories ADD COLUMN parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL"
        ))
        conn.execute(text(
            "CREATE INDEX IF NOT EXISTS ix_categories_parent_id ON categories(parent_id)"
        ))
        conn.commit()
        print("Done.")

if __name__ == "__main__":
    run()
