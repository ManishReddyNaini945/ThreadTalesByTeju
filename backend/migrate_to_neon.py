import psycopg2
import json
from psycopg2.extras import RealDictCursor
from psycopg2 import extras

LOCAL_URL = "postgresql://postgres:123456789@localhost:5432/threadtalesbyteju"
NEON_URL = "postgresql://neondb_owner:npg_jfIKhZl6r8Pv@ep-empty-heart-a4yat7wf.us-east-1.aws.neon.tech/neondb?sslmode=require"

local = psycopg2.connect(LOCAL_URL)
neon = psycopg2.connect(NEON_URL)

lc = local.cursor(cursor_factory=RealDictCursor)
nc = neon.cursor()

TABLES_INSERT_ORDER = [
    "users", "categories", "products", "addresses", "carts",
    "cart_items", "wishlist_items", "orders", "order_items",
    "reviews", "coupons", "stock_notifications", "newsletter_subscribers",
]
TABLES_DELETE_ORDER = list(reversed(TABLES_INSERT_ORDER))

def sanitize(value):
    if isinstance(value, (dict, list)):
        return json.dumps(value)
    return value

def migrate_table(table):
    try:
        lc.execute(f'SELECT * FROM "{table}"')
        rows = lc.fetchall()
        if not rows:
            print(f"  {table}: empty, skipping")
            return

        cols = list(rows[0].keys())
        col_str = ", ".join(f'"{c}"' for c in cols)
        placeholders = ", ".join(["%s"] * len(cols))

        for row in rows:
            values = [sanitize(row[c]) for c in cols]
            nc.execute(
                f'INSERT INTO "{table}" ({col_str}) VALUES ({placeholders}) ON CONFLICT DO NOTHING',
                values
            )

        neon.commit()
        print(f"  {table}: {len(rows)} rows migrated")
    except Exception as e:
        neon.rollback()
        print(f"  {table}: SKIPPED — {e}")

print("Clearing existing Neon data...\n")
for table in TABLES_DELETE_ORDER:
    try:
        nc.execute(f'DELETE FROM "{table}"')
        neon.commit()
    except:
        neon.rollback()

print("Migrating data...\n")
for table in TABLES_INSERT_ORDER:
    migrate_table(table)

local.close()
neon.close()
print("\nMigration complete!")
