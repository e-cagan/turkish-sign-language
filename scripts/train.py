"""
Module to train YOLOv8 model.
"""

from ultralytics import YOLO
import torch


if __name__ == '__main__':
    # Check the gpu availability
    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    # Define the model with desired weights
    model = YOLO('yolov8s.pt', task="detect")

    # Train the model
    model.train(
        data="dataset/TURK-ISARET-DILI-UYGULAMASI-3/data.yaml",
        epochs=100,
        batch=16,
        imgsz=640,
        device=device,
        optimizer="SGD",
        lr0=0.001,
        lrf=0.01,
        momentum=0.937,
        weight_decay=0.0005,
        warmup_epochs=3,
        dropout=0.1,
        freeze=None,
        val=True,

        # Augmentations (Mostly using default)
        mosaic=0.0,
        fliplr=0.0,

        # Naming
        project="runs",
        name="tsl-yolov8"
    )