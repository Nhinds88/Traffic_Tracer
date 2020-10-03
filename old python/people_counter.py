from pyimagesearch.centroidtracker import CentroidTracker
from pyimagesearch.trackableobject import TrackableObject
from imutils.video import VideoStream
from imutils.video import FPS
import numpy as np
import argparse
import imutils
import time
import dlib
import cv2

ap = argparse.ArgumentParser()
ap.add_argument("-p", "--prototxt", required=True, help="path to caffe 'deloy' prototxt file")
ap.add_argument("-m", "--model", required=True, help="path to caffe pre-trained model")
ap.add_argument("-i", "--input", type=str, help="path to optional input video file")
ap.add_argument("-o", "--output", type=str, help="path to optional output video file")
ap.add_argument("-c", "--confidence", type=float, default=0.4, help="minimum probability to filter weak detections")
ap.add_argument("-s", "--skip-frames", type=int, default=30, help="number of skip frames bwteen detections")
args = vars(ap.parse_args())

# initialize the list of class labels MobileNet SSD was trained to
# detect
CLASSES = ["background", "aeroplane", "bicycle", "bird", "boat", "bottle", "bus", "car", "cat", "chair", "cow", "diningtable", "dog", "horse", "motorbike", "person", "pottedplant", "sheep", "sofa", "train", "tvmonitor"]
# load our serialized model from disk
print("[INFO] loading...")
net = cv2.dnn.readNetFromCaffe(args["prototxt"], args["model"])

# if no video path provided then point to webcam stream
if not args.get("input", False):
    print("[INFO] starting video stream...")
    vs = VideoStream(src=0).start.start()
    time.sleep(2.0)

# else use the video file
else :
    print("[INFO] opening video file...")
    vs = cv2.VideoCapture(args["input"])

# Video writer
writer = None

# init frame dimensions
W = None
H = None

# init our centroid tracker
ct = CentroidTracker(maxDisappeared = 40, maxDistance = 50)
trackers = []
TrackableObjects = {}

# init total frames processed and num of objects that have moved up and down
totalFrames = 0
totalDown = 0
totalUp = 0

# start the frames per second throughput estimator
fps = FPS().start()

# loop through frames
while True:
    