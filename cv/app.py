from flask import Flask, jsonify
from flask_cors import CORS
from vision import analyze_face

app = Flask(__name__)
CORS(app)

@app.route("/api/vision/analyze", methods=["GET"])
def analyze():
    result = analyze_face()

    return jsonify({
        "success": True,
        "visual_indicators": result,
        "disclaimer": "Facial analysis is non-diagnostic and for awareness only."
    })

if __name__ == "__main__":
    app.run(debug=True, port=7000)
