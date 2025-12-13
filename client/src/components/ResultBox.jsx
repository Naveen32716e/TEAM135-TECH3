const ResultBox = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-4">
      <div className="alert alert-success">
        <h5 className="fw-bold">Health Guidance</h5>
        <pre className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
          {result}
        </pre>
      </div>

      <div className="alert alert-danger mt-3 small fw-semibold">
        This system does not diagnose diseases or replace doctors.
        It provides awareness and guidance to encourage timely medical consultation.
      </div>
    </div>
  );
};

export default ResultBox;
