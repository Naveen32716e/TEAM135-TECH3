export default function DosDonts({ dos = [], donts = [] }) {
  return (
    <div className="row mt-3">
      <div className="col-md-6">
        <div className="card border-success shadow">
          <div className="card-header bg-success text-white">Do's</div>
          <ul className="list-group list-group-flush">
            {dos.map((d, i) => (
              <li key={i} className="list-group-item">{d}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card border-secondary shadow">
          <div className="card-header bg-secondary text-white">Don'ts</div>
          <ul className="list-group list-group-flush">
            {donts.map((d, i) => (
              <li key={i} className="list-group-item">{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
