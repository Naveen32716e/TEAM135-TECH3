import { useState, useRef } from "react";

const SymptomForm = ({ onSubmit, loading }) => {
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [age, setAge] = useState("");
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  const startListening = () => {
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
        prev ? prev + ", " + transcript : transcript
      );
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ symptoms, duration, age });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Symptoms */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          Symptoms (Type or Speak)
        </label>

        <div className="input-group">
          <textarea
            className="form-control"
            rows="3"
            placeholder="e.g., fever, headache"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />

          <button
            type="button"
            className={`btn ${
              listening ? "btn-danger" : "btn-outline-primary"
            }`}
            onClick={startListening}
            disabled={loading}
          >
            {listening ? "Listening..." : "🎤 Speak"}
          </button>
        </div>
      </div>

      {/* Duration */}
      <div className="mb-3">
        <label className="form-label fw-semibold">Duration</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g., 3 days"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      {/* Age */}
      <div className="mb-4">
        <label className="form-label fw-semibold">Age</label>
        <input
          type="number"
          className="form-control"
          min="0"
          max="120"
          placeholder="Enter age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary w-100 fw-semibold"
        disabled={loading}
      >
        {loading ? "Processing..." : "Get Guidance"}
      </button>
    </form>
  );
};

export default SymptomForm;
