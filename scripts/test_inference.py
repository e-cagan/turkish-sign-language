"""
Module for testing out the trained model by real-time inference using webcam.
"""

from ultralytics import YOLO
import cv2


if __name__ == '__main__':
    # Define the camera and adjust frame width, height
    # Index 0 for webcam
    cap = cv2.VideoCapture(0)
    cap.set(propId=cv2.CAP_PROP_FRAME_WIDTH, value=640.0)
    cap.set(propId=cv2.CAP_PROP_FRAME_HEIGHT, value=480.0)

    # Define the model
    model = YOLO()