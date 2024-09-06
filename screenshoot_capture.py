# screenshot_capture.py

import mss
import time
import os
import requests
import cv2
import numpy as np
from upload_helper import upload_image_to_cloudinary

# Directory to save the0 screenshots
save_dir = "./"
if not os.path.exists(save_dir):
    os.makedirs(save_dir)

sct = mss.mss()

def capture_screenshot():
    screenshot_path = os.path.join(save_dir, f"screenshot_{int(time.time())}.png")
    sct.shot(output=screenshot_path)
    print(screenshot_path)
    return screenshot_path

def detect_chess_pieces(image_url):
    # Download the image from Cloudinary
    resp = requests.get(image_url, stream=True).raw
    img_array = np.asarray(bytearray(resp.read()), dtype="uint8")
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply thresholding
    _, thresh = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)

    # Find contours which could be chess pieces
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Draw contours on the original image
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)

    # Show the image with detected pieces
    cv2.imshow('Detected Chess Pieces', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

if __name__ == "__main__":
    try:
        while True:
            # Capture the screenshot
            screenshot_path = capture_screenshot()

            # Upload to Cloudinary
            image_url = upload_image_to_cloudinary(screenshot_path)

            # Detect chess pieces
            detect_chess_pieces(image_url)

            # Wait for 1 second before capturing the next screenshot
            time.sleep(1)

    except KeyboardInterrupt:
        print("Screenshot capture and detection stopped.")
