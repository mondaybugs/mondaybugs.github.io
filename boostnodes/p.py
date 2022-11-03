import cv2
import numpy as np
import os
import sys
import shutil

c = sys.argv[1]
d = f'./assets/classes/{c}'

icons = []
nodes = []

image= cv2.imread('assets/a.png')
template= cv2.imread('assets/b.png')

res = cv2.matchTemplate(image,template,cv2.TM_CCOEFF_NORMED)
threshold = 0.98
loc = np.where( res >= 0.98)

rounded_corner = np.array([
    [85, 85, 51, 255],
    [85, 85, 68, 255],
    [85, 68, 68, 255],
    [85, 85, 68, 255],
    [85, 68, 68, 255],
    [85, 68, 51, 255]
])

diff = os.listdir(d)
dirr = os.listdir(d)

for pt in zip(*loc[::-1]):
    x = pt[0] - 2
    y = pt[1] + 10
    sl = 32
    crop = image[y:y+sl, x:x+sl]
    crop = cv2.cvtColor(crop, cv2.COLOR_BGR2BGRA)

    transparant = np.array([0, 0, 0, 0])

    # Don't mind the hardcoding check of 24 pixels I am just being lazy
    if np.array_equal(rounded_corner[0], crop[0, 0]):
        offset = 0
        crop[0, offset] = transparant
        crop[0, 31 - offset] = transparant
        crop[31, offset] = transparant
        crop[31, 31 - offset] = transparant

    if np.array_equal(rounded_corner[1], crop[0, 1]):
        offset = 1
        crop[0, offset] = transparant
        crop[0, 31 - offset] = transparant
        crop[31, offset] = transparant
        crop[31, 31 - offset] = transparant

    if np.array_equal(rounded_corner[2], crop[0, 2]):
        offset = 2
        crop[0, offset] = transparant
        crop[0, 31 - offset] = transparant
        crop[31, offset] = transparant
        crop[31, 31 - offset] = transparant     

    if np.array_equal(rounded_corner[3], crop[1, 0]):
        offset = 0
        crop[1, offset] = transparant
        crop[1, 31 - offset] = transparant
        crop[30, offset] = transparant
        crop[30, 31 - offset] = transparant

    if np.array_equal(rounded_corner[4], crop[1, 1]):
        offset = 1
        crop[1, offset] = transparant
        crop[1, 31 - offset] = transparant
        crop[30, offset] = transparant
        crop[30, 31 - offset] = transparant

    if np.array_equal(rounded_corner[5], crop[2, 0]):
        crop[2, 0] = transparant
        crop[2, 31] = transparant
        crop[29, 0] = transparant
        crop[29, 31] = transparant
    
    nodes.append(crop)
    cv2.imwrite(f'{d}/0_alt_{x}_{y}.png', crop)

for pt in dirr:
    if pt.startswith('0_'):
        continue
    p = f'{d}/{pt}'
    img = cv2.imread(p)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    
    for q in nodes:
        r = cv2.matchTemplate(img,q,cv2.TM_CCOEFF_NORMED)
        l = np.where( r >= 0.955)
        
        for ptt in zip(*l[::-1]):
            diff.remove(pt)
    
for pt in diff:
    if pt.startswith('0_'):
        continue
    
    print(pt)

    p = f'{d}/{pt}'
    img = cv2.imread(p)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    max = 0
    match = img

    for q in nodes:
        r = cv2.matchTemplate(img,q,cv2.TM_CCOEFF_NORMED)
        if r[0][0] > max:
            max = r[0][0]
            match = q

    if max > 0.9:
        shutil.copyfile(p, f'{d}/0_old_{pt}')
        cv2.imwrite(p, match)

input('Press enter to delete temporary images.')

dirlist = os.listdir(d)

for e in dirlist:
    if e.startswith('0_alt'):
        os.remove(f'{d}/{e}')

    