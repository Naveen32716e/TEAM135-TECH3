export default function ResultLayout({ data, onReset }) {

  const speakGuidanceEnglish = () => {
    window.speechSynthesis.cancel();

    const text = `
      Severity level is ${data.severity}.
      ${data.summary}.
      Emergency warning signs include:
      ${data.redFlags?.join(", ")}.
      Recommended actions:
      ${data.dos?.join(", ")}.
      Please avoid:
      ${data.donts?.join(", ")}.
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

          <div
            className={`alert alert-${severityColor[data.severity] || "secondary"} text-center fw-semibold`}
          >
            Severity Level: {data.severity}
          </div>

          <p><strong>Summary:</strong><br />{data.summary}</p>

          {data.redFlags?.length > 0 && (
            <div className="alert alert-danger">
              <strong>🚨 Emergency Red Flags</strong>
              <ul className="mb-0">
                {data.redFlags.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          <div className="row mt-4">
            <div className="col-md-6">
              <div className="card border-success">
                <div className="card-header bg-success text-white">✅ Do’s</div>
                <ul className="list-group list-group-flush">
                  {data.dos?.map((d, i) => <li key={i} className="list-group-item">{d}</li>)}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card border-secondary">
                <div className="card-header bg-secondary text-white">❌ Don’ts</div>
                <ul className="list-group list-group-flush">
                  {data.donts?.map((d, i) => <li key={i} className="list-group-item">{d}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-outline-dark" onClick={onReset}>
              🔄 New Assessment
            </button>
          </div>

          <div className="alert alert-light text-center mt-4 disclaimer">
            ⚠️ This system does not diagnose diseases or replace doctors.
            It provides awareness and guidance only.
          </div>
        </div>
      </div>
    </div>
  );
}
