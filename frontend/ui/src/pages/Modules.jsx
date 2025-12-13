import { useEffect, useState } from "react";
import { getModuleRisk } from "../api/mockApi";
import "./Modules.css";

export default function Modules() {
  const [modules, setModules] = useState(null);

  useEffect(() => {
    getModuleRisk().then(setModules);
  }, []);

    if (!modules) {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Module Risk Assessment</h1>
        <p className="dashboard-subtitle">Loading...</p>
      </div>
    </div>
  );
}

  const formatSeconds = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="modules-container">
      <div className="modules-header">
        <h1>Module Risk Assessment</h1>
        <p className="modules-subtitle">Monitor module health and error patterns</p>
      </div>
      
      <div className="modules-table-wrapper">
        <table className="modules-table">
        <thead>
          <tr>
            <th>Module</th>
            <th>Total Errors</th>
            <th>Repeated Errors</th>
            <th>Avg Score</th>
            <th>Avg Fix Time</th>
            <th>Risk Score</th>
            <th>Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {modules.map(m => (
            <tr key={m.module}>
              <td className="module-name">{m.module}</td>
              <td className="numeric">{m.total_errors}</td>
              <td className="numeric">{m.repeated_errors}</td>
              <td className="numeric">
                <span className={`score-badge score-${Math.round(m.avg_weighted_score * 10)}`}>
                  {m.avg_weighted_score.toFixed(2)}
                </span>
              </td>
              <td className="numeric">{formatSeconds(m.avg_fix_time_seconds)}</td>
              <td className="numeric">
                <span className="risk-score-badge">{m.risk_score.toFixed(2)}</span>
              </td>
              <td className="center">
                <span className={`risk-badge risk-${m.risk_level}`}>
                  {m.risk_level.charAt(0).toUpperCase() + m.risk_level.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
