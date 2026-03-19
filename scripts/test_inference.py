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
    model = YOLO("runs/detect/runs/tsl-yolov8/weights/best.pt")

    # Start the inference loop
    while cap.isOpened():
        # Read the camera frame
        ret, frame = cap.read()
        if not ret:
            print("Couldn't open the camera.")
            break

        # Predict detections using frame
        results = model.predict(
            source=frame,
            stream=True,
            conf=0.30
        )

        # Iterate trough results to visualize detections on frame
        for result in results:
            # Iterate trough bboxes
            for box in result.boxes:
                # Take x, y coordinates, confidence score and label id and label for result
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                # Cast coordinates to integers
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                conf = float(box.conf[0])
                cls = box.cls
                label = model.names[int(cls)]

                # Draw bounding box (bbox) for detection
                cv2.rectangle(img=frame, pt1=(x1, y1), pt2=(x2, y2), color=(255, 0, 0), thickness=2)

                # Add label name to the frame
                cv2.putText(img=frame, text=f"{label} %{conf:.2f}", org=(x1, y1 - 10), fontFace=cv2.FONT_HERSHEY_SIMPLEX, thickness=2, fontScale=0.6, color=(0, 255, 0))

        # Display the frame
        cv2.imshow(winname="Hand sign inference", mat=frame)

        # Add quitting option
        if cv2.waitKey(1) & 0xFF == ord('q'):
            print("Quitting...")
            break
    
    # Release the camera pointer and destroy window
    cap.release()
    cv2.destroyAllWindows()