from PIL import Image
import numpy as np
from rembg import remove

source_path = '/Users/hello/.gemini/antigravity-ide/brain/724bb7f3-c935-4f64-84ef-98f6b1d6ec2e/resume_review_v4_hologram_1781290099113.png'

print("Running rembg...")
img_original = Image.open(source_path).convert("RGBA")
img_rembg = remove(
    img_original,
    alpha_matting=True,
    alpha_matting_foreground_threshold=240,
    alpha_matting_background_threshold=10,
    alpha_matting_erode_size=10
)

data_orig = np.array(img_original).astype(float)
data_rembg = np.array(img_rembg).astype(float)

h, w, _ = data_orig.shape

# Distance from white
r, g, b, a = data_orig[:,:,0], data_orig[:,:,1], data_orig[:,:,2], data_orig[:,:,3]
dist = np.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2)
alpha_white = np.clip((dist - 5) / 30.0, 0, 1) * 255.0

data_final = np.copy(data_orig)

# The floor starts in the bottom 25-30% of the image.
y_split = int(h * 0.75) 

# Top part (y < y_split): Keep holograms, so use the white-removal logic
data_final[:y_split, :, 3] = np.minimum(data_final[:y_split, :, 3], alpha_white[:y_split, :])

# Bottom part (y >= y_split): Floor is here, so use the AI background remover to cut out the legs
data_final[y_split:, :, 3] = data_rembg[y_split:, :, 3]

img_out = Image.fromarray(data_final.astype(np.uint8))
img_out.save('public/images/jobdetail.webp')
img_out.save('public/images/aboutus.webp')
print("Successfully merged masks to remove floor and keep holograms!")
