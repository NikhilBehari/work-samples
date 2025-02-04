**market-detection**: Code release for AAAI W3PHIAI-21 [paper](https://teamcore.seas.harvard.edu/files/teamcore/files/w3phiai_21_workshop_paper.pdf) "Satellite-Based Food Market Detection for Micronutrient Deficiency Prediction." Micronutrient deficiency (MND) is a nutritional disorder caused by a lack of essential vitamins and minerals, often leading to severe physical and mental developmental impairment. This research aims to identify locations of food markets from satellite imagery, as part of a larger project using remote sensing and georeferenced data as proxies to determine regions susceptible to MND. 

The proposed methodology augments existing geographic information data from [OpenStreetMap](https://www.openstreetmap.org/#map=4/38.01/-95.84), which is often inaccurate or sparse for rural areas susceptible to MND, using a satellite image-based vision pipeline. Training data is automatically generated using existing OSM labels in nearby regions, and used to train a U-Net segmentation model to detect building/housing infrastructure. This approach showed good results for satellite image segmentation, and improved the precision of market detection by 80%. 

> *included concepts:  computer vision, TensorFlow, Keras, U-Net+ResNet segmentation, GIS framework, machine learning*

<img align="center" src="../images/market-det.png" width="100%">
