import constants
import glob
import pandas as pd
import numpy as np
import shutil
import os

def clear_out_folder():
    try:
        shutil.rmtree(constants.OUTPUT_FOLDER + 'image_output')
    except:
        pass
    try:
        os.makedirs(constants.OUTPUT_FOLDER + 'image_output')
        os.makedirs(constants.OUTPUT_FOLDER + 'image_output/test')
        os.makedirs(constants.OUTPUT_FOLDER + 'image_output/test/object')
        os.makedirs(constants.OUTPUT_FOLDER + 'image_output/test/no_object')
        os.makedirs(constants.OUTPUT_FOLDER + 'image_output/train')
        os.makedirs(constants.OUTPUT_FOLDER + 'image_output/train/object')
        os.makedirs(constants.OUTPUT_FOLDER + 'image_output/train/no_object')
    except:
        pass

def discretize():
    annot_files = glob.glob('../Real/annotations/*.csv')
    object_sizes = []

    for annotation in annot_files:

        labels = pd.read_csv(filepath_or_buffer=annotation, header=None)
        labels.columns = [
            'fr',
            'id',
            'x',
            'y',
            'w',
            'h',
            'class',
            'species',
            'occluded',
            'noisy'
        ]
        labels['w'] = pd.to_numeric(labels['w'])
        labels['h'] = pd.to_numeric(labels['h'])

        avg_obj_size = 0

        for ind, row in labels.iterrows():
            avg_obj_size += row['w']*row['w']

        avg_obj_size /= labels.shape[0]
        object_sizes.append(avg_obj_size)

    disc_arr = []
    small = []
    med = []
    large = []

    for i in range(len(annot_files)):
        if object_sizes[i] < 200:
            small.append(os.path.splitext(os.path.basename(annot_files[i]))[0])
        elif object_sizes[i] < 1000:
            med.append(os.path.splitext(os.path.basename(annot_files[i]))[0])
        else:
            large.append(os.path.splitext(os.path.basename(annot_files[i]))[0])

    disc_arr.append(small)
    disc_arr.append(med)
    disc_arr.append(large)

    return disc_arr

