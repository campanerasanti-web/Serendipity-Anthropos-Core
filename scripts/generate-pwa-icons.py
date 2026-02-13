#!/usr/bin/env python3
"""
Generate PWA icons from a base image
Usage: python scripts/generate-pwa-icons.py
"""

from PIL import Image, ImageDraw
import os
import sys

def generate_icons():
    """Generate PWA icons in multiple sizes"""
    
    public_dir = 'public'
    
    # Ensure public directory exists
    if not os.path.exists(public_dir):
        os.makedirs(public_dir)
    
    # Create a base 512x512 image (blue background with 'EM' text)
    # This is a placeholder - in production, use actual logo
    img = Image.new('RGB', (512, 512), color='#1a1a2e')
    draw = ImageDraw.Draw(img)
    
    # Add gradient effect (simple blue shades)
    for y in range(512):
        shade = int(26 + (y / 512) * 60)  # Gradient from #1a1a2e to darker
        draw.line([(0, y), (512, y)], fill=(shade, shade, 100))
    
    # Generate icons in different sizes
    sizes = [96, 192, 512]
    
    for size in sizes:
        # Regular icon
        resized = img.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(os.path.join(public_dir, f'icon-{size}.png'))
        print(f'✅ Created icon-{size}.png')
        
        # Maskable icon (for adaptive icons on Android)
        resized.save(os.path.join(public_dir, f'icon-maskable-{size}.png'))
        print(f'✅ Created icon-maskable-{size}.png')
    
    print('\n✨ All PWA icons generated successfully!')
    print(f'   Location: {public_dir}/')
    print('\n💡 Tip: Replace these with actual Serendipity Bros logo for production')

if __name__ == '__main__':
    try:
        generate_icons()
    except Exception as e:
        print(f'❌ Error generating icons: {e}')
        sys.exit(1)
