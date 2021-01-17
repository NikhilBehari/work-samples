### Code and work samples
<sup>Nikhil Behari, Class of 2022</sup>

**market-detection**: Code release for AAAI W3PHIAI-21 [paper](https://teamcore.seas.harvard.edu/files/teamcore/files/w3phiai_21_workshop_paper.pdf) "Satellite-Based Food Market Detection for Micronutrient Deficiency Prediction." Micronutrient deficiency (MND) is a nutritional disorder caused by a lack of essential vitamins and minerals, often leading to severe physical and mental developmental impairment. This research aims to identify locations of food markets from satellite imagery, as part of a larger project using remote sensing and georeferenced data as proxies to determine regions susceptible to MND. 

The proposed methodology augments existing geographic information data from [OpenStreetMap](https://www.openstreetmap.org/#map=4/38.01/-95.84), which is often inaccurate or sparse for rural areas susceptible to MND, using a satellite image-based vision pipeline. Training data is automatically generated using existing OSM labels in nearby regions, and used to train a U-Net segmentation model to detect building/housing infrastructure. This approach showed good results for satellite image segmentation, and improved the precision of market detection by 80%. 

> *included concepts:  computer vision, TensorFlow, Keras, U-Net+ResNet segmentation, GIS framework, machine learning*

**tir-vision**: This research aimed to identify effective vision approaches for thermal infrared cameras mounted on unmanned aerial vehicles (UAVs), specifically for use in conservation. This is often a challenging data setting, as objects of interest (humans, elephants, lions, etc.) may be small, occluded, or sparse. 

This repository contains sample code implementing a training methodology to identify and improve small object detection/classification benchmarks, particularly in real-time settings. I used the TensorFlow Object Detection [Model Zoo](https://github.com/tensorflow/models/blob/master/research/object_detection/g3doc/tf2_detection_zoo.md), and tested several augmentation approaches, classification models (Inception, ResNet, MobileNet, etc.), and detection models (CenterNet, SSD, Faster R-CNN, etc.). I saw good results for various accuracy and efficiency tradeoffs, and future research will focus on further improving the vision pipelines using an active learning approach. 

> *included concepts:  object detection, object classification, TensorFlow, Keras*

**edusense-inference**: [EduSense](https://www.edusense.io) is an open-source platform for classroom environment sensing and automatic instructor feedback generation. It uses a computer vision-based system to track instructor and student behaviors throughout class sessions, and provides information to instructors to enable high-quality, independent professional development. 

In this research, I worked on the EduSense team to help develop 1) Novel methodologies for human gaze and location inference from classroom footage, and 2) An intelligent platform for instructors to engage with their data. This repository contains sample code using [Deepgaze](https://github.com/mpatacchiola/deepgaze) and statistical analyses to capture characteristics of student/instructor behavior from lecture recordings. 

> *included concepts:  3D computer vision, CNNs, Tensorflow, Deepgaze, machine/feature learning, statistics* 

**edusense-platform**: [EduSense](https://www.edusense.io) is an open-source platform for classroom environment sensing and automatic instructor feedback generation. It uses a computer vision-based system to track instructor and student behaviors throughout class sessions, and provides information to instructors to enable high-quality, independent professional development. 

This repository contains the code for the EduSense platform, an intelligent interface used to process, interpret, and present automatically generated classroom data to instructors. I developed this web application from scratch using the React.js, Node, Express, GraphQL, and MongoDB (MERNG) stack, and using my developed statistical approach to present insights to instructors. 

> *included concepts:  full stack development, intelligent interfaces, user-centered design* 

**selected-research**: This repository contains examples of my research publications. 