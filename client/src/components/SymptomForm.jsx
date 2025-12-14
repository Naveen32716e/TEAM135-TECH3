import { useState, useRef } from "react";

export default function SymptomForm({ onSubmit }) {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  // 🎤 Start voice input
  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms((prev) =>
        prev ? `${prev}, ${transcript}` : transcript
      );
    };

    recognition.onerror = () => {
      alert("Voice input failed. Please try again.");
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  // 🚀 Submit form (ONLY user input)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!symptoms.trim() || !duration || !age) {
      alert("Please fill all fields");
      return;
    }

    onSubmit({
      symptoms: symptoms.trim(),
      duration: `${duration} days`,
      age: Number(age),
    });
  };

  return (
    <div className="container d-flex justify-content-center">
      <div className="card shadow-lg" style={{ maxWidth: "520px", width: "100%" }}>
        <div className="card-header text-center fw-bold bg-primary text-white">
          📝 Symptom Details
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Symptoms + Speaker */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Symptoms
              </label>

              <div className="input-group">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="e.g. fever, headache, cough"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />

                <button
                  type="button"
                  className={`btn ${
                    listening ? "btn-danger" : "btn-outline-secondary"
                  }`}
                  onClick={startVoiceInput}
                  title="Speak symptoms"
                >
                  🎤
                </button>
              </div>

              {listening && (
                <small className="text-danger">
                  Listening… speak clearly
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
              />
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Age
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 fw-semibold"
            >
              Get Guidance
            </button>
          </form>

          <div className="alert alert-light text-center mt-3 small">
            ⚠️ This system does not diagnose diseases or replace doctors.
          </div>
        </div>
      </div>
    </div>
  );
}
