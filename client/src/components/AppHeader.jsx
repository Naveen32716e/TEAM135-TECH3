export default function AppHeader() {
  return (
    <header
      style={{
        width: "100%",
        background: "linear-gradient(135deg,#667eea,#764ba2)",
      }}
    >
      <div className="container-fluid py-3 text-center text-white">
        <h5 className="mb-1 fw-semibold">
          🧠 GenAI Health Awareness Assistant
        </h5>
        <small className="opacity-75">
          Early guidance • Awareness • Not diagnosis
        </small>
      </div>
    </header>
  );
}
