import { useEffect, useState } from "react";
import { getSummary } from "../api/mockApi";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getSummary().then(setStats);
  }, []);

  if (!stats) return null;

  const formatSeconds = (s) => {
    if (s == null) return '-';
    const mins = Math.floor(s / 60);
    const secs = Math.round(s % 60);
    return `${mins}m ${secs}s`;
  };

  const total = stats.total_errors || 0;
  const resolved = stats.resolved || 0;
  const open = stats.open || 0;
  const repeated = stats.repeated_errors || 0;
  const avgFix = stats.avg_fix_time_seconds || 0;

  const resolvedPct = total ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Overview — quick metrics about recent errors</p>
      </div>

      <div className="cards-wrapper">
        <div className="stat-card">
          <h4>Total Errors</h4>
          <p className="stat-value">{total}</p>
        </div>

        <div className="stat-card">
          <h4>Resolved</h4>
          <p className="stat-value">{resolved} <span className="muted">({resolvedPct}%)</span></p>
        </div>

        <div className="stat-card">
          <h4>Open</h4>
          <p className="stat-value">{open}</p>
        </div>

        <div className="stat-card">
          <h4>Repeated Errors</h4>
          <p className="stat-value">{repeated}</p>
        </div>

        <div className="stat-card">
          <h4>Avg Fix Time</h4>
          <p className="stat-value">{formatSeconds(avgFix)}</p>
        </div>

        <div className="stat-card">
          <h4>Avg Fix Time (s)</h4>
          <p className="stat-value">{avgFix}s</p>
        </div>
      </div>
    </div>
  );
}
