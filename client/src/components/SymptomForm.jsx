import { useState, useRef } from "react";
import api from "../api";

export default function SymptomForm({ onSubmit }) {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // 🎤 Start Speech Recognition
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms((prev) =>
        prev ? prev + ", " + transcript : transcript
      );
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 🚀 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      symptoms,
      duration,
      age,
    };

    try {
      const res = await api.post("/api/ai/guidance", payload);
      onSubmit(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend not reachable. Please check server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header bg-primary text-white text-center fw-semibold">
        📝 Symptom Checker
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Symptoms */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Describe Symptoms
            </label>

            <div className="d-flex gap-2">
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. fever, headache, cold"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                required
              />

              <button
                type="button"
                className={`btn ${
                  listening ? "btn-danger" : "btn-outline-secondary"
                }`}
                onClick={startListening}
                title="Speak symptoms"
              >
                🎤
              </button>
            </div>

            {listening && (
              <small className="text-danger">
                Listening... speak now
              </small>
            )}
          </div>

          {/* Duration */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Duration (days)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 3"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Age (years)
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 btn-lg"
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Get Guidance"}
          </button>
        </form>
      </div>
    </div>
  );
}
