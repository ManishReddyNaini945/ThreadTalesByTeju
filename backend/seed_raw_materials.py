"""
Seeds the Raw Materials parent category and all sub-categories.
Run AFTER migrate_add_parent_id.py:
  python seed_raw_materials.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal
from app.models.category import Category

RAW_MATERIALS_SLUG = "raw-materials"

# Each entry: (name, slug)
SUB_CATEGORIES = [
    ("Kundans",                     "kundans"),
    ("Bangles",                     "raw-bangles"),
    ("Silk Threads",                "silk-threads"),
    ("Glues",                       "glues"),
    ("Charms",                      "charms"),
    ("Craft Chains",                 "raw-chains"),
    ("Lakshmi Coins",               "lakshmi-coins"),
    ("Tools",                       "tools"),
    ("Beads",                       "beads"),
    ("Raw Saree Pins",              "raw-saree-pins"),
    ("Hair Accessories (Raw)",      "raw-hair-accessories"),
    ("Transparent Sheets",          "transparent-sheets"),
    ("Wax Sheets",                  "wax-sheets"),
    ("Loreal Pearls",               "loreal-pearls"),
    ("Earring Material",            "earring-material"),
    ("Wire",                        "wire"),
    ("MDF",                         "mdf"),
    ("Bracelet & Necklace Material","bracelet-necklace-material"),
    ("Sequins",                     "sequins"),
    ("Clip Stones",                 "clip-stones"),
]

def seed():
    db = SessionLocal()
    try:
        # Create or fetch the Raw Materials parent category
        parent = db.query(Category).filter(Category.slug == RAW_MATERIALS_SLUG).first()
        if not parent:
            parent = Category(
                name="Raw Materials",
                slug=RAW_MATERIALS_SLUG,
                description="Craft supplies and raw materials for jewellery making",
                sort_order=10,
            )
            db.add(parent)
            db.flush()
            print(f"  + Created parent: Raw Materials")
        else:
            print(f"  - Parent already exists: Raw Materials (id={parent.id})")

        # Create sub-categories
        created = 0
        for name, slug in SUB_CATEGORIES:
            existing = db.query(Category).filter(Category.slug == slug).first()
            if existing:
                # Make sure parent_id is set
                if existing.parent_id != parent.id:
                    existing.parent_id = parent.id
                    print(f"  ~ Updated parent_id for: {name}")
                else:
                    print(f"  - Already exists: {name}")
                continue
            cat = Category(
                name=name,
                slug=slug,
                parent_id=parent.id,
                sort_order=created,
            )
            db.add(cat)
            db.flush()
            created += 1
            print(f"  + Created: {name}")

        db.commit()
        print(f"\nDone! {created} sub-categories seeded under Raw Materials.")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
