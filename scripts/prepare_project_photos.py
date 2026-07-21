from pathlib import Path

from PIL import Image, ImageOps


SOURCE_ROOT = Path(r"I:\Blog_Sites\项目照片")
OUTPUT_ROOT = Path(r"I:\Blog_Sites\public\project-photos")
MAX_DIMENSION = 1400
JPEG_QUALITY = 84

ALBUMS = [
    ("1000W基于Sic的Cycle周波转换器的单相离网逆变数字电源研发", "sic-inverter"),
    ("200W-DAB样机", "dab-200w"),
    ("信号调制方式识别与参数估计装置", "signal-modulation"),
    ("ESP32手表", "esp32-watch"),
    ("STM32手持式便携示波器", "stm32-oscilloscope"),
    ("放大器非线性失真装置", "amplifier-distortion"),
    ("磁芯元件制作", "magnetic-components"),
    ("香橙派", "orange-pi"),
]


def export_album(source_name: str, slug: str) -> None:
    source_dir = SOURCE_ROOT / source_name
    output_dir = OUTPUT_ROOT / slug
    output_dir.mkdir(parents=True, exist_ok=True)

    if not source_dir.exists():
        print(f"missing: {source_dir}")
        return

    files = sorted(
        [
            file
            for file in source_dir.iterdir()
            if file.is_file() and file.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
        ],
        key=lambda file: file.name,
    )

    for index, file in enumerate(files, start=1):
        target = output_dir / f"{index:02d}.jpg"
        with Image.open(file) as image:
            image = ImageOps.exif_transpose(image)
            image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
            if image.mode not in {"RGB", "L"}:
                image = image.convert("RGB")
            elif image.mode == "L":
                image = image.convert("RGB")

            image.save(target, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)

        print(f"{slug}/{index:02d}.jpg <= {file.name}")


def main() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    for source_name, slug in ALBUMS:
        export_album(source_name, slug)


if __name__ == "__main__":
    main()
