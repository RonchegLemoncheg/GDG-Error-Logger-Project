export default function CodeDiff({ before, after }) {
  return (
    <div className="code-diff">
      <div>
        <h4>Before</h4>
        <pre>{before.join("\n")}</pre>
      </div>
      <div>
        <h4>After</h4>
        <pre>{after.join("\n")}</pre>
      </div>
    </div>
  );
}
