import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getErrorById } from "../api/mockApi";
import CodeDiff from "../components/CodeDiff";
import ModuleRisk from "../components/ModuleRisk";

export default function ErrorDetail() {
  const { id } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    getErrorById(id).then(setError);
  }, [id]);

  if (!error) return null;

  return (
    <>
      <h1>{error.error.code}</h1>
      <p>{error.error.message}</p>
      <p>
        Risk: <ModuleRisk score={error.analysis.weighted_score} />
      </p>

      <CodeDiff
        before={error.code_snippet.before}
        after={error.code_snippet.after}
      />
    </>
  );
}
