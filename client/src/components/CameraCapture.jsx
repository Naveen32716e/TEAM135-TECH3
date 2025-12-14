import { useEffect, useRef, useState } from "react";
import api from "../api";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🎥 Start camera when component mounts
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
      } catch (err) {
        setError("Camera access denied or unavailable");
      }
    };

    startCamera();

    // 🔴 Stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 📸 Capture image + send to backend
  const captureAndAnalyze = async () => {
    setLoading(true);
    setError(null);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageBase64 = canvas.toDataURL("image/jpeg");

      // Send image to backend (Node → Flask)
      const res = await api.post("/api/ai/analyze-face", {
        image: imageBase64,
      });

      // Stop camera after capture
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      // Send result back to App.jsx
      onCapture(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze face. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header text-center fw-semibold">
        📸 Facial Analysis
      </div>

      <div className="card-body text-center">
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-100 rounded mb-3"
          style={{ maxHeight: "320px", objectFit: "cover" }}
        />

        <canvas ref={canvasRef} hidden />

        <button
          className="btn btn-primary btn-lg w-100"
          onClick={captureAndAnalyze}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Capture & Analyze"}
        </button>

        <small className="text-muted d-block mt-2">
          Please face the camera clearly
        </small>
      </div>
    </div>
  );
}
