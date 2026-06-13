from rembg import remove
from PIL import Image

input_path = "/Users/hello/.gemini/antigravity-ide/brain/724bb7f3-c935-4f64-84ef-98f6b1d6ec2e/india_map_1781356553625.png"
output_path = "public/images/india-map.png"

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
print("Saved transparent map to", output_path)
