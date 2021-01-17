OUTPUT_FOLDER = '../output/'

# defined constants

# 0=small, 1=medium, 2=large
SIZES = [0]

# [width, height]
GRID_SIZES = [[20, 20]]
PADDINGS = [10]

# IOU thresh
ious = [0.05]

# resize (choose from 32, 96, 128, 160, 192, 224)
RESIZE = [160]

# interpolation method (for CNN)
INTERPOLATION = ['bilinear']

# batch size
BATCHES = [32]

# epochs
EPOCHS = 20