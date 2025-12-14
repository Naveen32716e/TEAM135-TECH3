export default function ResultLayout({ data, onReset }) {
  // 🛑 Absolute safety
  if (!data || !data.guidance) {
    return (
      <div className="alert alert-info text-center mt-4">
        Loading guidance...
      </div>
    );
  }

  const { guidance, visualIndicators } = data;

  const speakGuidanceEnglish = () => {
    window.speechSynthesis.cancel();

    const text = `
      Severity level is ${guidance.severity}.
      ${guidance.summary}.
      Emergency warning signs include:
      ${guidance.redFlags.join(", ")}.
      Recommended actions:
      ${guidance.dos.join(", ")}.
      Please avoid:
      ${guidance.donts.join(", ")}.
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const severityColor = {
    Monitor: "warning",
    "Consult Doctor": "primary",
    Emergency: "danger",
  };

  return (
    <div className="container" style={{ maxWidth: "900px" }}>
      <div className="card shadow-lg">

        <div
          className="card-header text-white text-center fw-bold"
          style={{ background: "linear-gradient(135deg,#11998e,#38ef7d)" }}
        >
          📊 Health Guidance Result
        </div>

        <div className="card-body">
          {/* Voice */}
          <div className="text-center mb-3">
            <button
              className="btn btn-outline-primary me-2"
              onClick={speakGuidanceEnglish}
            >
              🔊 Read Guidance
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => window.speechSynthesis.cancel()}
            >
              ⏹ Stop
            </button>
          </div>

          {/* Severity */}
          <div
            className={`alert alert-${
              severityColor[guidance.severity] || "secondary"
            } text-center fw-semibold`}
          >
            Severity Level: {guidance.severity}
          </div>

          {/* Summary */}
          <p>
            <strong>Summary:</strong><br />
            {guidance.summary}
          </p>

          {/* Red Flags */}
          {guidance.redFlags.length > 0 && (
            <div className="alert alert-danger">
              <strong>🚨 Emergency Red Flags</strong>
              <ul className="mb-0">
                {guidance.redFlags.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Facial Analysis */}
          <div className="alert alert-info">
            <strong>👁️ Facial Analysis</strong>
            <ul className="mb-0">
              <li>Face detected: {visualIndicators.face_detected ? "Yes" : "No"}</li>
              <li>Eye count: {visualIndicators.eye_count}</li>
              <li>Fatigue indicator: {visualIndicators.fatigue_indicator ? "Yes" : "No"}</li>
              <li>Nose redness level: {visualIndicators.nose_redness_level}</li>
            </ul>
          </div>

          {/* Do / Don’t */}
          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <div className="card border-success h-100">
                <div className="card-header bg-success text-white">✅ Do’s</div>
                <ul className="list-group list-group-flush">
                  {guidance.dos.map((d, i) => (
                    <li key={i} className="list-group-item">{d}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card border-secondary h-100">
                <div className="card-header bg-secondary text-white">❌ Don’ts</div>
                <ul className="list-group list-group-flush">
                  {guidance.donts.map((d, i) => (
                    <li key={i} className="list-group-item">{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="text-center mt-4">
            <button className="btn btn-outline-dark" onClick={onReset}>
              🔄 New Assessment
            </button>
          </div>

          <div className="alert alert-light text-center mt-4">
            ⚠️ This system does not diagnose diseases or replace doctors.
            It provides awareness and guidance only.
          </div>
        </div>
      </div>
    </div>
  );
}
