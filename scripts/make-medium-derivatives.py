"""Create the medium WebP derivative for every photograph and record it in the asset manifest.

The original masters live outside this repository, so the medium size is resampled from the
large derivative: two thirds of its dimensions, Lanczos, WebP quality 80, ICC profile kept.
Run from the repository root: python3 scripts/make-medium-derivatives.py
"""
import json
import os

from PIL import Image

MANIFEST = 'public/assets/manifest.json'
SCALE = 2 / 3

with open(MANIFEST) as file:
    manifest = json.load(file)

for asset in manifest:
    large_path = 'public' + asset['large']['src']
    medium_src = asset['large']['src'].replace('-large.webp', '-medium.webp')
    with Image.open(large_path) as image:
        profile = image.info.get('icc_profile')
        size = (round(image.width * SCALE), round(image.height * SCALE))
        image.resize(size, Image.LANCZOS).save('public' + medium_src, 'WEBP', quality=80, method=6, icc_profile=profile)
    asset['medium'] = {'src': medium_src, 'width': size[0], 'height': size[1]}



def with_medium_after_large(asset):
    ordered = {}
    for key, value in asset.items():
        if key == 'medium':
            continue
        ordered[key] = value
        if key == 'large':
            ordered['medium'] = asset['medium']
    return ordered


manifest = [with_medium_after_large(asset) for asset in manifest]
with open(MANIFEST, 'w') as file:
    json.dump(manifest, file, indent=2, ensure_ascii=False)
    file.write('\n')
print(f'Wrote {len(manifest)} medium derivatives.')
