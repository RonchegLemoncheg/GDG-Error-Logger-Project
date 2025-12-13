import { useState } from 'react';
import './ErrorTable.css';

export default function ErrorTable({ errors }) {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedCauseId, setExpandedCauseId] = useState(null);

  const toggleCodeSnippet = (bugId) => {
    setExpandedId(expandedId === bugId ? null : bugId);
  };

  const toggleCause = (bugId) => {
    setExpandedCauseId(expandedCauseId === bugId ? null : bugId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const formatSeconds = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      <table className="error-table">
        <thead>
          <tr>
            <th>Bug ID</th>
            <th>Code</th>
            <th>Module</th>
            <th>Function</th>
            <th>Message</th>
            <th>Type</th>
            <th>Score</th>
            <th>Status</th>
            <th>First Seen</th>
            <th>Duration</th>
            <th>Cause</th>
            <th>Code Snippet</th>
          </tr>
        </thead>
        <tbody>
          {errors.map(e => (
            <tr key={e.bug_id}>
              <td className="bug-id">{e.bug_id}</td>
              <td className="error-code">{e.error.code}</td>
              <td className="module">{e.module}</td>
              <td className="function">{e.function}</td>
              <td className="message" title={e.error.message}>{e.error.message}</td>
              <td className={`type type-${e.type}`}>{e.type}</td>
              <td className="score">
                <span>
                  {e.analysis.weighted_score.toFixed(2)}
                </span>
              </td>
              <td className={`status status-${e.status}`}>{e.status}</td>
              <td className="date">{formatDate(e.time.first_seen)}</td>
              <td className="duration">{formatSeconds(e.time.duration_seconds)}</td>
              <td className="cause" title={e.analysis.cause}>
                <div className="cause-preview">
                  <span className="cause-text">
                    {e.analysis.cause.length > 25 ? e.analysis.cause.slice(0, 25) + '...' : e.analysis.cause}
                  </span>
                  {e.analysis.cause.length > 25 && (
                    <button
                      className="readmore-btn"
                      onClick={(ev) => { ev.stopPropagation(); toggleCause(e.bug_id); }}
                      aria-expanded={expandedCauseId === e.bug_id}
                    >
                      Read
                    </button>
                  )}
                </div>
              </td>
              <td className="action">
                <button 
                  className={`snippet-btn ${expandedId === e.bug_id ? 'active' : ''}`}
                  onClick={() => toggleCodeSnippet(e.bug_id)}
                >
                  {expandedId === e.bug_id ? 'Hide' : 'Click here'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Expanded code snippet section */}
      {expandedId && (
        <div className="code-snippet-container">
          {errors.find(e => e.bug_id === expandedId) && (
            <div className="snippet-details">
              <h3>Code Snippet - {expandedId}</h3>
              <div className="snippet-section">
                <h4>Before:</h4>
                <pre className="code-before">
                  {errors.find(e => e.bug_id === expandedId).code_snippet.before.join('\n')}
                </pre>
              </div>
              <div className="snippet-section">
                <h4>After:</h4>
                <pre className="code-after">
                  {errors.find(e => e.bug_id === expandedId).code_snippet.after.join('\n')}
                </pre>
              </div>
              <div className="snippet-section">
                <h4>Fix Applied:</h4>
                <p>{errors.find(e => e.bug_id === expandedId).analysis.fix}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cause popup */}
      {expandedCauseId && (
        <div className="cause-overlay" onClick={() => setExpandedCauseId(null)}>
          {errors.find(e => e.bug_id === expandedCauseId) && (
            <div className="cause-popup-inner" onClick={(ev) => ev.stopPropagation()} role="dialog" aria-modal="true">
              <div className="cause-popup-header">
                <h4>Cause — {expandedCauseId}</h4>
                <button className="close-popup" onClick={() => setExpandedCauseId(null)}>×</button>
              </div>
              <p className="cause-full">{errors.find(e => e.bug_id === expandedCauseId).analysis.cause}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
