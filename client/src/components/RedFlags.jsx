export default function RedFlags({ flags = [] }) {
  if (!flags.length) return null;

  return (
    <div className="alert alert-danger shadow">
      <h5>🚨 Emergency Red Flags</h5>
      <ul>
        {flags.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
