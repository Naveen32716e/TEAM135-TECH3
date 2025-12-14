export default function Disclaimer({ onAccept }) {
  return (
    <div className="card mt-4">
      {/* Header */}
      <div className="card-header text-center bg-danger bg-opacity-10">
        <div className="mb-2">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-25"
            style={{ width: 44, height: 44 }}
          >
            ⚠️
          </span>
        </div>
        <h5 className="fw-semibold text-danger mb-1">
          Medical Disclaimer
        </h5>
        <small className="text-muted">
          Please read carefully before proceeding
        </small>
      </div>

      {/* Body */}
      <div className="card-body px-4">
        <p className="text-center mb-3">
          This application provides <strong>health awareness and early guidance only</strong>.
          By proceeding, you acknowledge the following:
        </p>

        <ul className="list-unstyled bg-light rounded p-3 mb-4">
          <li className="mb-2 text-danger">
            • This tool <strong>does NOT diagnose</strong> diseases or conditions.
          </li>
          <li className="mb-2 text-danger">
            • It <strong>does NOT prescribe</strong> medications or treatments.
          </li>
          <li className="mb-2 text-danger">
            • It is <strong>NOT a substitute</strong> for professional medical advice,
            diagnosis, or treatment.
          </li>
        </ul>

        <p className="text-center disclaimer">
          Always seek the advice of your physician or other qualified healthcare provider
          with any questions you may have regarding a medical condition.
        </p>

        {/* Button */}
        <div className="d-grid mt-4">
          <button
            className="btn btn-success btn-lg"
            onClick={onAccept}
          >
            ✔ I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
