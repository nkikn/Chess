from ultralytics import YOLO
import cv2

# Load the pre-trained YOLOv8 model
model = YOLO('yolov8n.pt')  # yolov8n is the smallest model, you can choose others

# Capture a frame from the camera stream (or you can load a saved image)
cap = cv2.VideoCapture(1)  # Change '0' to your camera source

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Run inference on the captured frame
    results = model(frame)

    # Display the results on the frame
    result_img = results[0].plot()  # Plot the detection results on the frame
    cv2.imshow('YOLO Chess Detection', result_img)

    # Break loop on 'q' press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
