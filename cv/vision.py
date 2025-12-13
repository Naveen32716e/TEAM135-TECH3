import cv2
import numpy as np

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye.xml"
)

cap = cv2.VideoCapture(0)

def analyze_face():
    ret, frame = cap.read()
    if not ret:
        return {"error": "Camera not accessible"}

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    results = {
        "face_detected": False,
        "eye_count": 0,
        "fatigue_indicator": False,
        "nose_redness_level": "Unknown"
    }

    for (x, y, w, h) in faces:
        results["face_detected"] = True

        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]

        eyes = eye_cascade.detectMultiScale(roi_gray, 1.1, 5)
        results["eye_count"] = len(eyes)

        if len(eyes) <= 1:
            results["fatigue_indicator"] = True

        # Nose ROI
        nose_y1, nose_y2 = int(h*0.45), int(h*0.75)
        nose_x1, nose_x2 = int(w*0.3), int(w*0.7)
        nose_roi = roi_color[nose_y1:nose_y2, nose_x1:nose_x2]

        hsv = cv2.cvtColor(nose_roi, cv2.COLOR_BGR2HSV)

        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 50, 50])
        upper_red2 = np.array([180, 255, 255])

        mask = cv2.inRange(hsv, lower_red1, upper_red1) + \
               cv2.inRange(hsv, lower_red2, upper_red2)

        redness_ratio = cv2.countNonZero(mask) / (nose_roi.size / 3)

        if redness_ratio > 0.25:
            results["nose_redness_level"] = "High"
        elif redness_ratio > 0.12:
            results["nose_redness_level"] = "Moderate"
        else:
            results["nose_redness_level"] = "Low"

        break  # only first face

    return results
