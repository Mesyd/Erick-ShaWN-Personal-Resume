from pathlib import Path
import shutil
import subprocess
import tempfile

from PIL import Image, ImageOps


SOURCE_ROOT = Path(r"I:\Blog_Sites\项目照片")
OUTPUT_ROOT = Path(r"I:\Blog_Sites\public\project-photos")
MAX_DIMENSION = 1400
JPEG_QUALITY = 84
PDFTOPPM = (
    shutil.which("pdftoppm.exe")
    or r"C:\Users\Erick\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe"
    or shutil.which("pdftoppm")
    or shutil.which("pdftoppm.cmd")
)

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

ORDERED_EXPORTS = {
    "200W-DAB样机": [
        "DAB拓扑图.pdf",
        "样机实物.jpg",
        "样机照片.pdf",
        "系统框架.pdf",
        "控制策略框图.pdf",
        "调试环境.jpg",
        "Git代码调试记录.jpg",
        "DOMC动态性能.tif",
        "200W效率曲线.pdf",
    ]
}

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"}


def normalize_image(image: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(image)
    image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
    if image.mode not in {"RGB", "L"}:
        image = image.convert("RGB")
    elif image.mode == "L":
        image = image.convert("RGB")
    return image


def export_image(source: Path, target: Path) -> None:
    with Image.open(source) as image:
        image = normalize_image(image)
        image.save(target, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def export_pdf_first_page(source: Path, target: Path) -> None:
    with tempfile.TemporaryDirectory() as temp_dir:
        temp_prefix = str(Path(temp_dir) / "page")
        subprocess.run(
            [PDFTOPPM, "-jpeg", "-singlefile", "-r", "180", str(source), temp_prefix],
            check=True,
            capture_output=True,
            text=True,
        )
        rendered = Path(f"{temp_prefix}.jpg")
        export_image(rendered, target)


def export_file(source: Path, target: Path) -> None:
    suffix = source.suffix.lower()
    if suffix == ".pdf":
        export_pdf_first_page(source, target)
    elif suffix in IMAGE_EXTENSIONS:
        export_image(source, target)
    else:
        raise ValueError(f"unsupported file type: {source}")


def export_album(source_name: str, slug: str) -> None:
    source_dir = SOURCE_ROOT / source_name
    output_dir = OUTPUT_ROOT / slug
    output_dir.mkdir(parents=True, exist_ok=True)

    if not source_dir.exists():
        print(f"missing: {source_dir}")
        return

    if source_name in ORDERED_EXPORTS:
        files = [source_dir / file_name for file_name in ORDERED_EXPORTS[source_name]]
    else:
        files = sorted(
            [
                file
                for file in source_dir.iterdir()
                if file.is_file() and file.suffix.lower() in IMAGE_EXTENSIONS
            ],
            key=lambda file: file.name,
        )

    for index, file in enumerate(files, start=1):
        if not file.exists():
            print(f"missing file: {file}")
            continue

        target = output_dir / f"{index:02d}.jpg"
        export_file(file, target)
        print(f"{slug}/{index:02d}.jpg <= {file.name}")


def main() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    for source_name, slug in ALBUMS:
        export_album(source_name, slug)


if __name__ == "__main__":
    main()
