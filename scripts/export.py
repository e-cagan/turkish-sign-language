"""
Module for exporting trained YOLOv8 model to make it faster.
"""

from ultralytics import YOLO


if __name__ == '__main__':
    # Load the model with trained model weights
    model = YOLO("runs/detect/runs/tsl-yolov8/weights/best.pt")

    # Export the model to ONNX format which is more suitable for general purpose usage
    model.export(
        format='onnx',
        imgsz=640,
        half=True,      # FP16 precision which allows us to reduce the size of model by half with minimum sacrificed accuracy to make it faster
        dynamic=False,  # Dynamic batch size (For FastAPI, False)
        simplify=True   # Simplifies ONNX model graph
    )