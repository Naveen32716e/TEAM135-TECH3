import { useState } from "react";
import SymptomForm from "./components/SymptomForm";
import ResultBox from "./components/ResultBox";

function App() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);

    const response = await fetch("http://localhost:5001/api/ai/guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    setResult(resData.guidance);

    setLoading(false);
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg border-0 rounded-4 p-4">

              <h2 className="text-center text-primary fw-bold">
                GenAI Health Awareness System
              </h2>

              <p className="text-center text-muted mb-4">
                Early guidance for common illnesses (Not diagnosis)
              </p>

              {/* FORM */}
              <SymptomForm onSubmit={handleSubmit} loading={loading} />

              {/* LOADING */}
              {loading && (
                <div className="alert alert-info mt-3 text-center">
                  🤖 Analyzing symptoms... Please wait
                </div>
              )}

              {/* RESULT */}
              <ResultBox result={result} />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
