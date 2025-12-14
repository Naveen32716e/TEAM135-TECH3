from flask import Flask, request, jsonify
import cv2
import base64
import numpy as np

app = Flask(__name__)

# 🔹 Load Haar Cascades
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)
eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_eye.xml"
)

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        if "image" not in data:
            return jsonify({"error": "No image provided"}), 400

        # 🔹 Decode base64 image
        image_data = data["image"].split(",")[1]
        img_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 🔍 Face detection
        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.3, minNeighbors=5
        )

        face_detected = len(faces) > 0
        eye_count = 0
        fatigue_indicator = False
        nose_redness_level = "Low"

        if face_detected:
            for (x, y, w, h) in faces:
                roi_gray = gray[y:y+h, x:x+w]
                roi_color = img[y:y+h, x:x+w]

                # 👁️ Eye detection
                eyes = eye_cascade.detectMultiScale(roi_gray)
                eye_count = len(eyes)

                # 😴 Fatigue heuristic (simple)
                if eye_count < 2:
                    fatigue_indicator = True

                # 🔴 Nose redness estimation (simple color average)
                nose_region = roi_color[int(h*0.55):int(h*0.75), int(w*0.4):int(w*0.6)]
                if nose_region.size > 0:
                    avg_color = nose_region.mean(axis=(0,1))
                    red_intensity = avg_color[2]  # Red channel

                    if red_intensity > 160:
                        nose_redness_level = "High"
                    elif red_intensity > 120:
                        nose_redness_level = "Medium"
                    else:
                        nose_redness_level = "Low"

                break  # analyze first face only

        return jsonify({
            "face_detected": face_detected,
            "eye_count": eye_count,
            "fatigue_indicator": fatigue_indicator,
            "nose_redness_level": nose_redness_level
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Image processing failed"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002, debug=True)
