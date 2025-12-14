import cv2
import numpy as np

# Load Haar Cascades
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye.xml"
)

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Webcam not accessible")
    exit()

print("✅ Press 'q' to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        # Draw face
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)

        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]

        # Eye detection
        eyes = eye_cascade.detectMultiScale(roi_gray, 1.1, 5)

        for (ex, ey, ew, eh) in eyes:
            cv2.rectangle(
                roi_color,
                (ex, ey),
                (ex+ew, ey+eh),
                (0, 255, 0),
                2
            )

        # -------------------------
        # 👃 NOSE REGION (APPROX)
        # -------------------------
        nose_y_start = int(h * 0.45)
        nose_y_end = int(h * 0.75)
        nose_x_start = int(w * 0.30)
        nose_x_end = int(w * 0.70)

        nose_roi = roi_color[nose_y_start:nose_y_end,
                              nose_x_start:nose_x_end]

        # Draw nose ROI box
        cv2.rectangle(
            roi_color,
            (nose_x_start, nose_y_start),
            (nose_x_end, nose_y_end),
            (0, 255, 255),
            2
        )

        # -------------------------
        # 🔴 REDNESS DETECTION
        # -------------------------
        hsv = cv2.cvtColor(nose_roi, cv2.COLOR_BGR2HSV)

        # Red color range in HSV
        lower_red1 = np.array([0, 50, 50])
        upper_red1 = np.array([10, 255, 255])

        lower_red2 = np.array([170, 50, 50])
        upper_red2 = np.array([180, 255, 255])

        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)

        red_mask = mask1 + mask2

        redness_ratio = cv2.countNonZero(red_mask) / (nose_roi.size / 3)

        # -------------------------
        # 🔔 REDNESS LEVEL
        # -------------------------
        if redness_ratio > 0.25:
            level = "High Redness Indicator"
            color = (0, 0, 255)
        elif redness_ratio > 0.12:
            level = "Moderate Redness Indicator"
            color = (0, 165, 255)
        else:
            level = "Low Redness"
            color = (0, 255, 0)

        cv2.putText(
            frame,
            level,
            (x, y + h + 25),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            color,
            2
        )

        # Fatigue indicator (optional)
        if len(eyes) <= 1:
            cv2.putText(
                frame,
                "Possible fatigue indicator",
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 0, 255),
                2
            )

    cv2.imshow("Facial Visual Indicators (Non-diagnostic)", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
