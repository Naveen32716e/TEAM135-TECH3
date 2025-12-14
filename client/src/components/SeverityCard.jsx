export default function SeverityCard({ severity, summary }) {
  return (
    <div className="alert alert-warning text-center shadow">
      <h5 className="fw-bold">Severity Assessment</h5>
      <h4 className="text-uppercase">{severity}</h4>
      <p>{summary}</p>
    </div>
  );
}
