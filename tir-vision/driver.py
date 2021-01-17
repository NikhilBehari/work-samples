import constants
from helper_methods import discretize
from helper_methods import clear_out_folder
from object_crop import ObjectCrop
from classification import classify
import csv
from sklearn.model_selection import ParameterGrid

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


def run_analysis():
    with open(constants.OUTPUT_FOLDER + 'results.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["obj_sizes","grid_size", "padding", "iou", "batch_size", "resize",
                         "interpolation", "loss_0", "accuracy_0", "loss_1", "accuracy_1"])
        file.flush()
        for crop_params in crop_grid:
            print("Clearing current directory...")
            clear_out_folder()
            print("Completed\n")

            print("Deconstructing images...")
            images = discretize()[crop_params['size']]
            print(images)
            exit(0)
            for image in images:
                print("Processing image" + image)
                crop_obj = ObjectCrop(out_folder=constants.OUTPUT_FOLDER, img_label=image)
                crop_obj.deconstruct(gh=crop_params['grid_size'][1], gw=crop_params['grid_size'][0],padding=crop_params['padding'], iou_thresh=crop_params['iou'], test_run=False)
            print("Completed\n")

            print("Running classifications...")
            for classify_params in classify_grid:
                classify_results = classify(classify_params['batch_size'], classify_params['size'], classify_params['interpolation'])
                writer.writerow([crop_params['size'],crop_params['grid_size'], crop_params['padding'],crop_params['iou'],
                                 classify_params['batch_size'],classify_params['size'],classify_params['interpolation'],
                                 classify_results[0], classify_results[1],classify_results[2], classify_results[3]])
                file.flush()
            print("Completed")

run_analysis()

