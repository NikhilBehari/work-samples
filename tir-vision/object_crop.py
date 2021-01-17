import cv2
import pandas as pd
import os
from os.path import isfile, join
import csv
import sys
import random as rd
from random import random


class ObjectCrop:

    def __init__(self, out_folder, img_label):
        self.img_folder = '../Real/images/' + img_label + '/'
        self.label_file = '../Real/annotations/' + img_label + '.csv'
        self.out_folder = out_folder

        files = [f for f in os.listdir(self.img_folder) if isfile(join(self.img_folder, f))]
        if(len(files) > 100):
            files = rd.sample(files, k=100)
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
        box1 = a
        box2 = b
        x1, y1, w1, h1 = box1
        x2, y2, w2, h2 = box2
        w_intersection = min(x1 + w1, x2 + w2) - max(x1, x2)
        h_intersection = min(y1 + h1, y2 + h2) - max(y1, y2)
        if w_intersection <= 0 or h_intersection <= 0:  # No overlap
            return 0
        I = w_intersection * h_intersection
        U = w1 * h1 + w2 * h2 - I  # Union = Total Area - I
        return I / U > threshold

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
        for image_fn in files:

            image_ind = int(os.path.splitext(image_fn)[0].split('_')[2])
            img_path = img_folder + image_fn
            img = cv2.imread(img_path)

            rand_samples = []
            backlog_train = 0
            backlog_test = 0
            backlog_iter = 0
            # check if frame has object anywhere
            if image_ind in labels.fr.values:
                print(image_ind)
                # iterate through image grid height
                for y in range(0, img_h-gh, gh - padding):
                    # iterate through image grid width
                    for x in range(0, img_w-gh, gw - padding):
                        cropped_img = img[y:y+gh, x:x+gw]

                        # check annotation file
                        contains_obj = False
                        # check if object in grid square using iou threshold
                        for ind, row in labels[labels['fr'] == image_ind].iterrows():
                            if self.__check_overlap('iou', iou_thresh, [row.x, row.y, row.w, row.h], [x, y, gw, gh]):
                                contains_obj = True
                                # use pseudorandom numbers to split into train/test data
                                if random() < 0.8:
                                    cv2.imwrite((out_folder + '/image_output/train/object/' + str(os.path.splitext(image_fn)[0]) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'), cropped_img)
                                    if len(rand_samples) > 0:
                                        cv2.imwrite((out_folder + '/image_output/train/no_object/' + str(os.path.splitext(image_fn)[0]) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'),rand_samples.pop(0))
                                    else:
                                        backlog_train += 1
                                else:
                                    cv2.imwrite((out_folder + '/image_output/test/object/' + str(os.path.splitext(image_fn)[0]) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'), cropped_img)
                                    if len(rand_samples) > 0:
                                        cv2.imwrite((out_folder + '/image_output/test/no_object/' + str(os.path.splitext(image_fn)[0]) + str(image_ind) + "_" + str(y) + '-' + str(x) + '.jpg'), rand_samples.pop(0))
                                    else:
                                        backlog_test += 1

                        if not contains_obj:
                            if backlog_train > 0:
                                cv2.imwrite((out_folder + '/image_output/train/no_object/' + str(
                                    os.path.splitext(image_fn)[0]) + str(image_ind) + "_" + str(y) + '-' + str(
                                    x) + '.jpg'), cropped_img)
                                backlog_train -= 1
                            elif backlog_test > 0:
                                cv2.imwrite((out_folder + '/image_output/test/no_object/' + str(
                                    os.path.splitext(image_fn)[0]) + str(image_ind) + "_" + str(y) + '-' + str(
                                    x) + '.jpg'), cropped_img)
                                backlog_test -= 1
                            elif len(rand_samples) < 20:
                                rand_samples.append(cropped_img)


            if test_run:
                exit(0)