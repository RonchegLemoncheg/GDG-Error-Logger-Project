export default function ModuleRisk({ score }) {
  const color =
    score > 0.75 ? "red" :
    score > 0.5 ? "orange" : "green";

  return (
    <span style={{ color, fontWeight: "bold" }}>
      {score}
    </span>
  );
}
