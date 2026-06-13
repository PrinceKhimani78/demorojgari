from PIL import Image
import numpy as np

def remove_white_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img).astype(float)
    
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Distance from white
    dist = np.sqrt((255-r)**2 + (255-g)**2 + (255-b)**2)
    
    # Make pure white transparent smoothly
    alpha = np.clip((dist - 5) / 30.0, 0, 1) * 255.0
    
    data[:,:,3] = np.minimum(a, alpha)
    
    img_out = Image.fromarray(data.astype(np.uint8))
    img_out.save(output_path)

source = '/Users/hello/.gemini/antigravity-ide/brain/724bb7f3-c935-4f64-84ef-98f6b1d6ec2e/resume_review_v4_hologram_1781290099113.png'
remove_white_bg(source, 'public/images/jobdetail.webp')
remove_white_bg(source, 'public/images/aboutus.webp')
print("Successfully processed images!")
