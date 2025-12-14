import { useState } from "react";
import AppHeader from "./components/AppHeader";
import Disclaimer from "./components/Disclaimer";
import SymptomForm from "./components/SymptomForm";
import ResultLayout from "./components/ResultLayout";

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <>
      {/* 🔥 FULL-WIDTH HEADER */}
      <AppHeader />

      {/* 🔥 CENTERED CONTENT */}
      <div className="container-fluid min-vh-100 d-flex justify-content-center pt-4">
        <div className="row w-100 justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6">

            {!accepted && (
              <Disclaimer onAccept={() => setAccepted(true)} />
            )}

            {accepted && !result && (
              <SymptomForm onSubmit={setResult} />
            )}

            {accepted && result && (
              <ResultLayout
                data={result.guidance}
                onReset={() => setResult(null)}
              />
            )}

          </div>
        </div>
      </div>
    </>
  );
}
