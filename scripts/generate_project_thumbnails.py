from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageFilter, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "project-photos"
TARGET_DIR = ROOT / "public" / "project-photos-thumbs"

MAX_WIDTH = 760
MAX_HEIGHT = 560
QUALITY = 58


def convert_image(source: Path) -> tuple[Path, int, int]:
    relative = source.relative_to(SOURCE_DIR).with_suffix(".webp")
    target = TARGET_DIR / relative
    target.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.Resampling.LANCZOS)
        image = image.filter(ImageFilter.GaussianBlur(radius=0.12))
        image.save(target, "WEBP", quality=QUALITY, method=6)
        return target, image.width, image.height


def main() -> None:
    if not SOURCE_DIR.exists():
        raise SystemExit(f"Missing source directory: {SOURCE_DIR}")

    images = [
        path
        for path in SOURCE_DIR.rglob("*")
        if path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    ]

    for source in images:
        target, width, height = convert_image(source)
        print(f"{source.relative_to(ROOT)} -> {target.relative_to(ROOT)} ({width}x{height})")

    print(f"Generated {len(images)} thumbnails in {TARGET_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
