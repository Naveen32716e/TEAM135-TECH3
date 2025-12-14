export default function AwarenessTags({ tags = [] }) {
  if (!tags.length) return null;

  return (
    <div className="mb-3">
      <h6>Possible Awareness Categories</h6>
      {tags.map((tag, i) => (
        <span key={i} className="badge bg-success me-2">
          {tag}
        </span>
      ))}
    </div>
  );
}
