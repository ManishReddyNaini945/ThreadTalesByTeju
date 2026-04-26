import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.database import SessionLocal, engine, Base
from app.models import Category, Product

Base.metadata.create_all(bind=engine)

CDN = "https://res.cloudinary.com/dilo6efzb/image/upload/threadtales/products"

CATEGORIES = [
    {"name": "Thread Bangles",    "slug": "thread-bangles"},
    {"name": "Bridal Bangle Sets","slug": "bridal-bangle-sets"},
    {"name": "Chains",            "slug": "chains"},
    {"name": "Hair Accessories",  "slug": "hair-accessories"},
    {"name": "Invisible Chains",  "slug": "invisible-chains"},
    {"name": "Saree Pins",        "slug": "saree-pins"},
]

PRODUCTS = [
    # --- Thread Bangles ---
    {"name":"Classic Thread Bangles","slug":"classic-thread-bangles","price":79,"stock":50,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_1.jpg"],"is_featured":True},
    {"name":"Royal Sky Blue Bangles Set of 2","slug":"royal-sky-blue-bangles","price":199,"stock":30,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_2.jpg"]},
    {"name":"Multi-Color Thread Bangles","slug":"multi-color-thread-bangles","price":249,"stock":40,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_3.jpg"]},
    {"name":"Elegant Thread Bangle Set","slug":"elegant-thread-bangle-set","price":199,"stock":35,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_4.jpg"]},
    {"name":"Designer Thread Bangles","slug":"designer-thread-bangles","price":349,"stock":20,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_5.jpg"]},
    {"name":"Traditional Thread Bangles","slug":"traditional-thread-bangles","price":199,"stock":45,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_6.jpg"]},
    {"name":"Festive Thread Bangles","slug":"festive-thread-bangles","price":249,"stock":30,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_7.jpg"]},
    {"name":"Premium Thread Bangle Set","slug":"premium-thread-bangle-set","price":279,"stock":25,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_8.jpg"]},
    {"name":"Bridal Thread Bangles","slug":"bridal-thread-bangles","price":279,"stock":20,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_9.jpg"],"is_bestseller":True},
    {"name":"Contemporary Thread Bangles","slug":"contemporary-thread-bangles","price":149,"stock":50,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_10.jpg"]},
    {"name":"Luxury Thread Bangle Set","slug":"luxury-thread-bangle-set","price":199,"stock":30,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_12.jpg"]},
    {"name":"Artistic Thread Bangles","slug":"artistic-thread-bangles","price":299,"stock":25,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_13.jpg"]},
    {"name":"Minimalist Thread Bangles","slug":"minimalist-thread-bangles","price":599,"stock":15,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_14.jpg"]},
    {"name":"Vibrant Thread Bangles","slug":"vibrant-thread-bangles","price":649,"stock":10,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_15.jpg"]},
    {"name":"Pearl Thread Bangles","slug":"pearl-thread-bangles","price":149,"stock":40,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_16.jpg"]},
    {"name":"Colorful Thread Bangles Set of 4","slug":"colorful-thread-bangles-set-4","price":199,"stock":35,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_17.jpg"]},
    {"name":"Ethnic Thread Bangles Set of 2","slug":"ethnic-thread-bangles-set-2","price":149,"stock":40,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_18.jpg"]},
    {"name":"Delicate Thread Bangles Set","slug":"delicate-thread-bangles-set","price":149,"stock":45,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_19.jpg"]},
    {"name":"Ornate Thread Bangles Set","slug":"ornate-thread-bangles-set","price":259,"stock":30,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_20.jpg"]},
    {"name":"Sophisticated Thread Bangles","slug":"sophisticated-thread-bangles","price":129,"stock":50,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_21.jpg"]},
    {"name":"Charming Thread Bangles Set","slug":"charming-thread-bangles-set","price":249,"stock":25,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_22.jpg"]},
    {"name":"Graceful Thread Bangles Set of 2","slug":"graceful-thread-bangles","price":79,"stock":60,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_23.jpg"]},
    {"name":"Exquisite Thread Bangles","slug":"exquisite-thread-bangles","price":399,"stock":15,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_24.jpg"]},
    {"name":"Stunning Thread Bangles Set of 4","slug":"stunning-thread-bangles","price":349,"stock":20,"category":"thread-bangles","images":[f"{CDN}/thread_bangle_26.png"]},

    # --- Bridal Bangle Sets ---
    {"name":"Golden Bridal Heritage Set","slug":"golden-bridal-heritage-set","price":799,"stock":10,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_1.jpg"],"is_featured":True,"is_bestseller":True},
    {"name":"Classic Bridal Set","slug":"classic-bridal-set","price":899,"stock":8,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_2.jpg"]},
    {"name":"Royal Bridal Collection","slug":"royal-bridal-collection","price":1299,"stock":5,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_3.jpg"]},
    {"name":"Premium Bridal Set","slug":"premium-bridal-set","price":899,"stock":8,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_4.jpg"]},
    {"name":"Designer Bridal Bangles","slug":"designer-bridal-bangles","price":999,"stock":7,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_5.jpg"]},
    {"name":"Elegant Bridal Collection Set of 2","slug":"elegant-bridal-collection","price":999,"stock":6,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_6.jpg"]},
    {"name":"Traditional Bridal Set","slug":"traditional-bridal-set","price":1299,"stock":5,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_7.jpg"]},
    {"name":"Luxury Bridal Collection","slug":"luxury-bridal-collection","price":1299,"stock":4,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_8.jpg"]},
    {"name":"Regal Bridal Set","slug":"regal-bridal-set","price":1399,"stock":3,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_9.jpg"]},
    {"name":"Majestic Bridal Bangles","slug":"majestic-bridal-bangles","price":1099,"stock":6,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_10.jpg"]},
    {"name":"Opulent Bridal Set","slug":"opulent-bridal-set","price":849,"stock":8,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_11.jpg"]},
    {"name":"Graceful Bridal Collection","slug":"graceful-bridal-collection","price":1399,"stock":3,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_12.jpg"]},
    {"name":"Exquisite Bridal Set","slug":"exquisite-bridal-set","price":1049,"stock":5,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_13.jpg"]},
    {"name":"Stunning Bridal Bangles","slug":"stunning-bridal-bangles","price":999,"stock":7,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_14.jpg"]},
    {"name":"Magnificent Bridal Set","slug":"magnificent-bridal-set","price":999,"stock":6,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_15.jpg"]},
    {"name":"Splendid Bridal Set","slug":"splendid-bridal-set","price":799,"stock":9,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_17.png"]},
    {"name":"Divine Bridal Bangles","slug":"divine-bridal-bangles","price":599,"stock":12,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_18.png"]},
    {"name":"Enchanting Bridal Set","slug":"enchanting-bridal-set","price":1049,"stock":5,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_19.jpg"]},
    {"name":"Celestial Bridal Collection","slug":"celestial-bridal-collection","price":799,"stock":10,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_20.jpg"]},
    {"name":"Imperial Bridal Set","slug":"imperial-bridal-set","price":1299,"stock":4,"category":"bridal-bangle-sets","images":[f"{CDN}/bridal_set_21.jpg"]},

    # --- Chains ---
    {"name":"Classic Chain Set","slug":"classic-chain-set","price":349,"stock":25,"category":"chains","images":[f"{CDN}/chiain-set.png"],"is_featured":True},
    {"name":"Premium Chain","slug":"premium-chain","price":449,"stock":20,"category":"chains","images":[f"{CDN}/chain_2.jpg"]},
    {"name":"Designer Chain","slug":"designer-chain","price":199,"stock":35,"category":"chains","images":[f"{CDN}/chain_3.jpg"]},
    {"name":"Elegant Chain","slug":"elegant-chain","price":199,"stock":35,"category":"chains","images":[f"{CDN}/chain_4.jpg"]},

    # --- Hair Accessories ---
    {"name":"Handcrafted Thread Hair Clip Set of 5","slug":"handcrafted-hair-clip","price":149,"stock":40,"category":"hair-accessories","images":[f"{CDN}/hair_clip_1.jpg"],"is_bestseller":True},
    {"name":"Floral Thread Hair Clip Set of 5","slug":"floral-thread-hair-clip","price":149,"stock":40,"category":"hair-accessories","images":[f"{CDN}/hair_clip_2.jpg"]},
    {"name":"Embellished Hair Clip Set of 5","slug":"embellished-hair-clip","price":149,"stock":40,"category":"hair-accessories","images":[f"{CDN}/hair_clip_3.jpg"]},
    {"name":"Designer Hair Clip Set","slug":"designer-hair-clip-set","price":149,"stock":35,"category":"hair-accessories","images":[f"{CDN}/hair_clip_4.jpg"]},
    {"name":"Pearl Embellished Hair Clip Set","slug":"pearl-hair-clip-set","price":199,"stock":30,"category":"hair-accessories","images":[f"{CDN}/hair_clip_5.jpg"]},
    {"name":"Bridal Hair Clip Set","slug":"bridal-hair-clip-set","price":149,"stock":20,"category":"hair-accessories","images":[f"{CDN}/hair_clip_6.jpg"]},
    {"name":"Traditional Hair Clip Set","slug":"traditional-hair-clip-set","price":99,"stock":50,"category":"hair-accessories","images":[f"{CDN}/hair_clip_7.jpg"]},
    {"name":"Festive Hair Clip","slug":"festive-hair-clip","price":149,"stock":35,"category":"hair-accessories","images":[f"{CDN}/hair_clip_8.jpg"]},
    {"name":"Stone Studded Hair Clip","slug":"stone-studded-hair-clip","price":69,"stock":60,"category":"hair-accessories","images":[f"{CDN}/hair_clip_9.png"]},

    # --- Invisible Chains ---
    {"name":"Classic Invisible Chain","slug":"classic-invisible-chain","price":99,"stock":50,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%201.jpg"],"is_featured":True},
    {"name":"Designer Chain Set","slug":"designer-invisible-chain-set","price":199,"stock":30,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%202.jpg"]},
    {"name":"Premium Invisible Chain","slug":"premium-invisible-chain","price":99,"stock":45,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%203.jpg"]},
    {"name":"Delicate Chain Collection","slug":"delicate-chain-collection","price":149,"stock":35,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%204.jpg"]},
    {"name":"Elegant Invisible Chain","slug":"elegant-invisible-chain","price":129,"stock":40,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%205.jpg"]},
    {"name":"Bridal Invisible Chain Set","slug":"bridal-invisible-chain-set","price":749,"stock":10,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%206.jpg"],"is_bestseller":True},
    {"name":"Traditional Chain Design","slug":"traditional-chain-design","price":139,"stock":40,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%207.jpg"]},
    {"name":"Festive Chain Collection","slug":"festive-chain-collection","price":99,"stock":50,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%208.jpg"]},
    {"name":"Royal Invisible Chain","slug":"royal-invisible-chain","price":149,"stock":35,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%209.jpg"]},
    {"name":"Contemporary Chain Set","slug":"contemporary-chain-set","price":149,"stock":30,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%2010.jpg"]},
    {"name":"Luxury Chain Collection","slug":"luxury-chain-collection","price":149,"stock":25,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%2011.jpg"]},
    {"name":"Minimalist Chain Design","slug":"minimalist-chain-design","price":99,"stock":55,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%2012.jpg"]},
    {"name":"Artistic Chain Set","slug":"artistic-chain-set","price":119,"stock":40,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%2013.jpg"]},
    {"name":"Heritage Chain Collection","slug":"heritage-chain-collection","price":149,"stock":30,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%2015.jpg"]},
    {"name":"Elegant Pearl Chain","slug":"elegant-pearl-chain","price":199,"stock":25,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%2017.jpg"]},
    {"name":"Designer Invisible Chain","slug":"designer-invisible-chain","price":199,"stock":20,"category":"invisible-chains","images":[f"{CDN}/invisible%20chain%2018.jpg"]},

    # --- Saree Pins ---
    {"name":"Saree Pin","slug":"saree-pin","price":49,"stock":100,"category":"saree-pins","images":[f"{CDN}/saree_pin.jpg"],"is_featured":True},
]

def seed():
    db = SessionLocal()
    try:
        if db.query(Category).count() > 0:
            print("Database already seeded. Skipping.")
            return

        print("Seeding categories...")
        cat_map = {}
        for c in CATEGORIES:
            cat = Category(name=c["name"], slug=c["slug"])
            db.add(cat)
            db.flush()
            cat_map[c["slug"]] = cat.id
            print(f"  ✓ {c['name']}")

        print("\nSeeding products...")
        for p in PRODUCTS:
            product = Product(
                name=p["name"],
                slug=p["slug"],
                price=p["price"],
                stock_quantity=p.get("stock", 10),
                category_id=cat_map[p["category"]],
                images=p.get("images", []),
                is_featured=p.get("is_featured", False),
                is_bestseller=p.get("is_bestseller", False),
                status="active",
            )
            db.add(product)
            print(f"  ✓ {p['name']}")

        db.commit()
        print(f"\nDone! {len(CATEGORIES)} categories and {len(PRODUCTS)} products seeded.")

    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
