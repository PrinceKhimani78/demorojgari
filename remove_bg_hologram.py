from rembg import remove
from PIL import Image

for file_name in ["jobdetail.webp", "aboutus.webp"]:
    input_path = f"public/images/{file_name}"
    try:
        input_image = Image.open(input_path)
        output_image = remove(
            input_image,
            alpha_matting=True,
            alpha_matting_foreground_threshold=240,
            alpha_matting_background_threshold=10,
            alpha_matting_erode_size=10
        )
        output_image.save(input_path)
        print(f"Successfully processed {file_name}")
    except Exception as e:
        print(f"Error processing {file_name}: {e}")
