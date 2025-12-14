import { useState } from "react";
import AppHeader from "./components/AppHeader";
import Disclaimer from "./components/Disclaimer";
import SymptomForm from "./components/SymptomForm";
import CameraCapture from "./components/CameraCapture";
import ResultLayout from "./components/ResultLayout";
import api from "./api";

export default function App() {
  const [accepted, setAccepted] = useState(false);

  // 📝 USER INPUT (ONLY symptoms, duration, age)
  const [formData, setFormData] = useState(null);

  // 📸 Camera state
  const [showCamera, setShowCamera] = useState(false);

  // 📊 FINAL AI RESULT
  const [finalResult, setFinalResult] = useState(null);

  /* ---------------- DISCLAIMER PAGE ---------------- */
  if (!accepted) {
    return (
      <>
        <AppHeader />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <Disclaimer onAccept={() => setAccepted(true)} />
        </div>
      </>
    );
  }

  /* ---------------- SYMPTOM FORM PAGE ---------------- */
  if (!showCamera && !finalResult) {
    return (
      <>
        <AppHeader />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <SymptomForm
            onSubmit={(data) => {
              console.log("📝 FORM DATA:", data); // MUST show symptoms/duration/age
              setFormData(data);                  // ✅ ONLY FORM DATA
              setShowCamera(true);               // open camera
            }}
          />
        </div>
      </>
    );
  }

  /* ---------------- CAMERA PAGE ---------------- */
  if (showCamera && !finalResult) {
    return (
      <>
        <AppHeader />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <CameraCapture
            onCapture={async (visualIndicators) => {
              try {
                const payload = {
                  symptoms: formData.symptoms,
                  duration: formData.duration,
                  age: formData.age,
                  visualIndicators,
                };

                console.log("📤 PAYLOAD TO BACKEND:", payload);

                const res = await api.post("/api/ai/guidance", payload);

                setFinalResult({
                  guidance: res.data.guidance,
                  visualIndicators,
                });
              } catch (err) {
                console.error(err);
                alert("Failed to fetch AI guidance");
              }
            }}
          />
        </div>
      </>
    );
  }

  /* ---------------- RESULT PAGE ---------------- */
  if (finalResult) {
    return (
      <>
        <AppHeader />
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <ResultLayout
            data={finalResult}
            onReset={() => {
              setFinalResult(null);
              setFormData(null);
              setShowCamera(false);
            }}
          />
        </div>
      </>
    );
  }

  return null;
}
