import os
import json
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

IMAGES_DIR = Path(__file__).parent.parent / "frontend" / "src" / "assests" / "images"
OUTPUT_FILE = Path(__file__).parent / "cloudinary_urls.json"

def upload_all_images():
    results = {}
    images = list(IMAGES_DIR.iterdir())
    total = len(images)

    print(f"Found {total} images. Starting upload...\n")

    for i, image_path in enumerate(images, 1):
        if not image_path.is_file():
            continue

        filename = image_path.stem
        print(f"[{i}/{total}] Uploading: {image_path.name}")

        try:
            response = cloudinary.uploader.upload(
                str(image_path),
                folder="threadtales/products",
                public_id=filename,
                overwrite=True,
                resource_type="image",
            )
            url = response["secure_url"]
            results[image_path.name] = url
            print(f"  ✓ {url}\n")
        except Exception as e:
            print(f"  ✗ Failed: {e}\n")
            results[image_path.name] = None

    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)

    success = sum(1 for v in results.values() if v)
    print(f"\nDone! {success}/{total} images uploaded successfully.")
    print(f"URLs saved to: {OUTPUT_FILE}")

if __name__ == "__main__":
    upload_all_images()
