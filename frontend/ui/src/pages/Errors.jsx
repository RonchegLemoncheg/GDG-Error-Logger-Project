import { useEffect, useState } from "react";
import { getErrors } from "../api/mockApi";
import ErrorTable from "../components/ErrorTable";
import "./Errors.css";

export default function Errors() {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    getErrors().then(setErrors);
  }, []);

  return (
    <div className="errors-container">
      <div className="errors-header">
        <h1>All Errors</h1>
        <p className="errors-subtitle">Overview of recent errors and their analysis</p>
      </div>

      <div className="errors-table-wrapper">
        <ErrorTable errors={errors} />
      </div>
    </div>
  );
}
