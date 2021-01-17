import tensorflow as tf
import cv2
from sklearn.model_selection import ParameterGrid
from PIL import Image
import matplotlib.pyplot as plt

import constants
import csv
import glob
import pandas as pd
import numpy as np
from os.path import isfile, join
import shutil
import os
import sys
from random import random
import pathlib

def classify(batchsize, img_size, interp_method):

    BATCH_SIZE = batchsize
    IMG_SIZE = img_size
    IMG_SHAPE = (IMG_SIZE, IMG_SIZE, 3)

    EPOCHS = constants.EPOCHS

    # base model
    base_model = tf.keras.applications.MobileNetV2(input_shape=IMG_SHAPE,
                            include_top=False,
                            weights='imagenet')
    base_model.trainable = False

    data_dir = pathlib.Path(constants.OUTPUT_FOLDER + 'image_output/train/')
    train_dir = pathlib.Path(constants.OUTPUT_FOLDER + 'image_output/train/')
    test_dir = pathlib.Path(constants.OUTPUT_FOLDER + 'image_output/test/')

    image_count = len(list(train_dir.glob('**/*.jpg'))) + len(list(test_dir.glob('**/*.jpg')))
    CLASS_NAMES = np.array([item.name for item in data_dir.glob('*')])

    STEPS_PER_EPOCH = np.ceil(image_count/BATCH_SIZE)

    # data generator from directories
    train_gen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255,
                                                                validation_split=0.2)
    test_gen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255)

    # construct directory flow
    train_data =train_gen.flow_from_directory(directory=str(train_dir),
                                              batch_size=BATCH_SIZE,
                                              target_size=(IMG_SIZE, IMG_SIZE),
                                              interpolation=interp_method,
                                              shuffle=True,
                                              classes = list(CLASS_NAMES),
                                              class_mode='binary',
                                              subset='training')

    val_data =train_gen.flow_from_directory(directory=str(train_dir),
                                            batch_size=BATCH_SIZE,
                                            target_size=(IMG_SIZE, IMG_SIZE),
                                            interpolation=interp_method,
                                            shuffle=True,
                                            classes = list(CLASS_NAMES),
                                            class_mode='binary',
                                            subset='validation')

    test_data =test_gen.flow_from_directory(directory=str(test_dir),
                                            batch_size=BATCH_SIZE,
                                            target_size=(IMG_SIZE, IMG_SIZE),
                                            interpolation=interp_method,
                                            shuffle=True,
                                            classes = list(CLASS_NAMES),
                                            class_mode='binary')

    image_batch, label_batch = next(train_data)

    base_model.trainable = False
    feature_batch = base_model(image_batch)
    average_blocks = tf.keras.layers.GlobalAveragePooling2D()
    predict_layer = tf.keras.layers.Dense(1)
    model = tf.keras.Sequential([base_model,
                                 average_blocks,
                                 predict_layer])


    base_learning_rate = 0.0001
    model.compile(optimizer=tf.keras.optimizers.RMSprop(lr=base_learning_rate),
                  loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
                  metrics=['accuracy'])

    loss0,accuracy0 = model.evaluate(test_data, verbose=0)
    history = model.fit(train_data,
                        epochs=EPOCHS,
                        validation_data=val_data,
                        verbose=0)

    lossf,accuracyf = model.evaluate(test_data, verbose=0)

    return [loss0, accuracy0, lossf, accuracyf]


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

crop_iters = {
    'size': constants.SIZES,
    'grid_size': constants.GRID_SIZES,
    'padding': constants.PADDINGS,
    'iou': constants.ious
}
crop_grid = ParameterGrid(crop_iters)

classify_iters = {
    'batch_size': constants.BATCHES,
    'size': constants.RESIZE,
    'interpolation': constants.INTERPOLATION
}
classify_grid = ParameterGrid(classify_iters)

class ObjectCrop:

    def __init__(self, out_folder, img_label):
        self.img_folder = '../Real/images/' + img_label + '/'
        self.label_file = '../Real/annotations/' + img_label + '.csv'
        self.out_folder = out_folder

        files = [f for f in os.listdir(self.img_folder) if isfile(join(self.img_folder, f))]
        files.sort(key=lambda x: x[5:-4])
        files.sort()

        # load and title annotation csv
        labels = pd.read_csv(filepath_or_buffer=self.label_file, header=None)
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
        labels['x'] = pd.to_numeric(labels['x'])
        labels['y'] = pd.to_numeric(labels['y'])
        labels['w'] = pd.to_numeric(labels['w'])
        labels['h'] = pd.to_numeric(labels['h'])

        self.files = files
        self.labels = labels

    def grid_options(self, padding):
        img_folder = self.img_folder
        files = self.files

        img_path = img_folder + files[0]
        img = cv2.imread(img_path)

        h, w, dim = img.shape
        print("Image height: " + str(h))
        print("Image width: " + str(w))
        print("\nOptions for deconstructed grid height with padding " + str(padding) + " include: ", end="")
        for i in range(padding + 1, h//2):
            temp_h = h - i
            if temp_h % (i - padding) == 0:
                print(str(i) + ", ", end="")

        print("\nOptions for deconstructed grid width with padding " + str(padding) + " include: ", end="")
        for i in range(padding + 1, w // 2):
            temp_w = w - i
            if temp_w % (i - padding) == 0:
                print(str(i) + ", ", end="")

    # determine if rectangles overlap using intersection over union
    @staticmethod
    def __check_overlap(overlap_method, threshold, a, b, epsilon=1e-5):
        x1 = max(a[0], b[0])
        y1 = max(a[1], b[1])
        x2 = min(a[2], b[2])
        y2 = min(a[3], b[3])

        # AREA OF OVERLAP - Area where the boxes intersect
        width = (x2 - x1)
        height = (y2 - y1)
        # handle case where there is NO overlap
        if (width < 0) or (height < 0):
            return 0.0
        area_overlap = width * height

        # COMBINED AREA
        area_a = (a[2] - a[0]) * (a[3] - a[1])
        area_b = (b[2] - b[0]) * (b[3] - b[1])
        area_combined = area_a + area_b - area_overlap

        # RATIO OF AREA OF OVERLAP OVER COMBINED AREA
        iou = area_overlap / (area_combined + epsilon)
        return iou > threshold

    def deconstruct(self, gh, gw, padding, iou_thresh=0.5, test_run=False):
        img_folder = self.img_folder
        out_folder = self.out_folder
        files = self.files
        labels = self.labels

        # calculate appropriate undersampling size
        num_files = len(files)
        num_objs = labels.shape[0]
        img_path = img_folder + files[0]
        img = cv2.imread(img_path)
        img_h, img_w, dim = img.shape
        num_grid = ((img_h - gh)*(img_w-gw) / ((gh-padding)*(gw-padding))) - 20
        under_sample = num_objs / (num_files * num_grid)

        # iterate through images
        for image_ind, image_fn in enumerate(files):
            img_path = img_folder + image_fn
            img = cv2.imread(img_path)

            # iterate through image grid height
            for y in range(0, img_h-gh, gh - padding):
                # iterate through image grid width
                for x in range(0, img_w-gh, gw - padding):
                    cropped_img = img[y:y+gh, x:x+gw]

                    # check annotation file
                    contains_obj = False
                    if image_ind in labels.fr.values:
                        # check if object in grid square using iou threshold
                        for ind, row in labels[labels['fr'] == image_ind].iterrows():
                            if self.__check_overlap('iou', iou_thresh, [row.x, row.y, row.x + row.w, row.y+row.h], [x, y, x+gw, y+gh]):
                                contains_obj = True

                    # use pseudorandom numbers to split into train/test data
                    if random() < 0.8:
                        if contains_obj:
                            cv2.imwrite((out_folder + '/image_output/train/object/' + str(image_fn) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'), cropped_img)
                        else:
                            if random() < under_sample:
                                cv2.imwrite((out_folder + '/image_output/train/no_object/' + str(image_fn) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'), cropped_img)
                    else:
                        if contains_obj:
                            cv2.imwrite((out_folder + '/image_output/test/object/' + str(image_fn) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'), cropped_img)
                        else:
                            if random() < under_sample:
                                cv2.imwrite((out_folder + '/image_output/test/no_object/' + str(image_fn) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'), cropped_img)

            if test_run:
                exit(0)

def run_analysis():
    with open(constants.OUTPUT_FOLDER + 'results.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["obj_sizes","grid_size", "padding", "iou", "batch_size", "resize",
                         "interpolation", "loss_0", "accuracy_0", "loss_1", "accuracy_1"])
        for crop_params in crop_grid:
            print("Clearing current directory...")
            clear_out_folder()
            print("Completed\n")

            print("Deconstructing images...")
            images = ['0000000351_0000000000']#discretize()[crop_params['size']]
            for image in images:
                print("Processing image")
                crop_obj = ObjectCrop(out_folder=constants.OUTPUT_FOLDER, img_label=image)
                crop_obj.deconstruct(gh=crop_params['grid_size'][1], gw=crop_params['grid_size'][0],padding=crop_params['padding'], iou_thresh=crop_params['iou'], test_run=False)
            print("Completed\n")

            print("Running classifications...")
            for classify_params in classify_grid:
                classify_results = classify(classify_params['batch_size'], classify_params['size'], classify_params['interpolation'])
                writer.writerow([crop_params['size'],crop_params['grid_size'], crop_params['padding'],crop_params['iou'],
                                 classify_params['batch_size'],classify_params['size'],classify_params['interpolation'],
                                 classify_results[0], classify_results[1],classify_results[2], classify_results[3]])
            print("Completed")

run_analysis()

