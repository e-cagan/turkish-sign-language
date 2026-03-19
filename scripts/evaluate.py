"""
Module for evaluating the trained YOLOv8 model.
"""

from ultralytics import YOLO


if __name__ == '__main__':
    # Load the model with trained weights
    model = YOLO("runs/detect/runs/tsl-yolov8/weights/best.pt")

    # Evaluate the model
    model.val(
        data="dataset/TURK-ISARET-DILI-UYGULAMASI-3/data.yaml",
        split="test",
        conf=0.001,             # To see the entire detections
        iou=0.7,
        plots=True,
        save_json=True
    )