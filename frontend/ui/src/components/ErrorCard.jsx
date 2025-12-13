export default function ErrorCard({ error }) {
  return (
    <div className="card">
      <h3>{error.error.code} — {error.module}</h3>

      <p><b>Function:</b> {error.function}</p>
      <p><b>Occurrences:</b> {error.learning?.previous_occurrences ?? 1}</p>

      <p>
        <b>Risk:</b>
        <span style={{ color: error.analysis.weighted_score > 0.7 ? "red" : "orange" }}>
          {error.analysis.weighted_score}
        </span>
      </p>

      <pre>{error.error.message}</pre>
    </div>
  );
}
