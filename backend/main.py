"""
Main module to contain API endpoints.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ultralytics import YOLO
import numpy as np
import uvicorn
import json
import cv2
import os


# Load the model
model = YOLO("/home/cagan/turkish-sign-language/runs/detect/runs/tsl-yolov8/weights/best.onnx")

# Initialize the app
app = FastAPI()

# Allow every origin to avoid CORS errors
app.add_middleware(CORSMiddleware, allow_origins=["*"])

class Feedback(BaseModel):
    """
    Base feedback model class.
    """
    predicted: str
    correct: str
    confidence: float


# ======================================== ENDPOINTS ========================================


@app.get("/")
async def health_check():
    """
    Endpoint to check system health.
    """
    
    return {"status": "ok"}


@app.get("/classes")
async def get_classes():
    """
    Endpoint to get class names.
    """
    
    return model.names


@app.get("/model/info")
async def model_info():
    """
    Endpoint to return model info to client.
    """

    return {"model": "YOLOv8s", "classes": 24, "version": "1.0"}


@app.post("/feedback")
def feedback(feedback: Feedback):
    """
    Endpoint to return feedback to user.   
    """

    file_path = "feedback.json"
    new_data = feedback.model_dump()

    # Read the current data (if data not exists create a list)
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                content = json.load(f)
                if not isinstance(content, list):
                    content = []
            except json.JSONDecodeError:
                content = []
    else:
        content = []

    # Add new feedback and update the file
    content.append(new_data)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=4)

    return {"message": "Feedback saved successfully"}


@app.post("/predict/image")
async def predict(file: UploadFile = File()):
    """
    Endpoint to predict single image.
    """

    # Recieve data from file
    data = await file.read()

    # Convert data to opencv image
    data = np.frombuffer(buffer=data, dtype=np.uint8)
    frame = cv2.imdecode(buf=data, flags=cv2.IMREAD_UNCHANGED)
    if frame is None:
        return {"error": "Invalid image format"}

    # Predict detections using frame
    results = model.predict(
        source=frame,
        stream=False,
        conf=0.25
    )

    # Return the predictions as JSON format
    predictions = json.loads(results[0].to_json())

    return predictions


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Endpoint to send detections to client.
    """

    await websocket.accept()
    
    while True:
        try:
            # Recieve data from client
            data = await websocket.receive_bytes()
            
            # Convert data to opencv image
            data = np.frombuffer(buffer=data, dtype=np.uint8)
            frame = cv2.imdecode(buf=data, flags=cv2.IMREAD_UNCHANGED)

            # Predict detections using frame
            results = model.predict(
                source=frame,
                stream=False,
                conf=0.25
            )

            # Convert result to json format and send it to client
            result = json.loads(results[0].to_json())

            await websocket.send_json(result)
        except WebSocketDisconnect:
            break


if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)