import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal
from app.models import Product, Category

BANGLE_SIZES = ["2.2", "2.4", "2.6", "2.8"]
BANGLE_CATEGORY_SLUGS = ["thread-bangles", "bridal-bangle-sets"]

def update():
    db = SessionLocal()
    try:
        categories = db.query(Category).filter(Category.slug.in_(BANGLE_CATEGORY_SLUGS)).all()
        cat_ids = [c.id for c in categories]

        if not cat_ids:
            print("No bangle categories found. Make sure the DB is seeded first.")
            return

        products = db.query(Product).filter(Product.category_id.in_(cat_ids)).all()
        print(f"Found {len(products)} bangle products. Updating sizes...")

        for product in products:
            product.sizes = BANGLE_SIZES
            print(f"  OK {product.name}")

        db.commit()
        print(f"\nDone! Sizes {BANGLE_SIZES} set on {len(products)} products.")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    update()
