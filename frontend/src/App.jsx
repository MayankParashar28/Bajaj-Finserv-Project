import React, { useState } from 'react';
import './App.css';
import { TreeViewer } from './components/TreeViewer';
import { VisualGraph } from './components/VisualGraph';

function App() {
  const [apiUrl, setApiUrl] = useState('http://localhost:3001/bfhl');
  // Just throwing in some default test cases to make debugging easier
  const [inputData, setInputData] = useState('A->B\nA->C\nB->D\nD->E\nE->F\nX->Y\nY->Z\nZ->X\nP->Q\nQ->R\nR->S\nS->T\nG->H\nG->H\nG->I\nH->I\nA->B\nhello\n1->2\nAB->C\nA-B\nA->\nA->A\n""\n M->N \nO->P\nP->Q\nQ->R\nR->O');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  // Helper to split by newlines OR commas
  const parseInput = (raw) => {
    return raw.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    const data = parseInput(inputData);

    try {
      // Hit our backend API
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} — ${res.statusText}`);
      }
      
      const json = await res.json();
      setResult(json); // Bam, we have our graph data
    } catch (e) {
      setError(e.message || 'Failed to fetch API. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="container">
        <header>
          <div className="badge">POST /bfhl</div>
          <h1>Node <span>Hierarchy</span><br />Explorer</h1>
          <p className="subtitle"> Round 1</p>
        </header>

        <div className="panel">
          <div className="panel-label">API Endpoint</div>
          <div className="url-row">
            <input 
              type="text" 
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:3001/bfhl"
            />
          </div>

          <div className="panel-label">Node Edges <span style={{fontWeight: 400}}>(one per line, or comma-separated)</span></div>
          <textarea 
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="A->B&#10;A->C&#10;B->D"
          ></textarea>
          <div className="hint">Format: X-&gt;Y where X and Y are single uppercase letters (A–Z)</div>

          <div className="btn-row">
            <button 
              className="btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <><span className="spinner"></span>Calling API…</> : '▶ Submit'}
            </button>
            <button 
              className="btn-ghost" 
              onClick={() => {
                setInputData('');
                setError(null);
                setResult(null);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {error && <div className="error-box">⚠ {error}</div>}

        {result && (
          <div className="results">
            <div className="section-title">Summary</div>
            <div className="summary-grid">
              <div className="stat-card">
                <div className="stat-val">{result.summary.total_trees}</div>
                <div className="stat-label">Valid Trees</div>
              </div>
              <div className="stat-card">
                <div className="stat-val" style={{color: 'var(--accent2)'}}>{result.summary.total_cycles}</div>
                <div className="stat-label">Cycles</div>
              </div>
              <div className="stat-card">
                <div className="stat-val" style={{color: 'var(--accent3)'}}>{result.summary.largest_tree_root || '—'}</div>
                <div className="stat-label">Deepest Root</div>
              </div>
            </div>

            <div className="section-title">Identity Details</div>
            <div className="user-info">
              <div>User ID: <span>{result.user_id}</span></div>
              <div>Email: <span>{result.email_id}</span></div>
              <div>Roll No: <span>{result.college_roll_number}</span></div>
            </div>

            <div className="section-title">Interactive Graph</div>
            <VisualGraph hierarchies={result.hierarchies} />

            <div className="section-title">Hierarchies (Text View)</div>
            <div className="hierarchies-grid">
              {(result.hierarchies || []).map((h, idx) => (
                <TreeViewer key={idx} hierarchy={h} />
              ))}
              {result.hierarchies.length === 0 && <span className="none-text">No valid hierarchies found.</span>}
            </div>

            <div className="section-title">Invalid Entries</div>
            <div className="pill-list">
              {result.invalid_entries?.length > 0 ? 
                result.invalid_entries.map((e, idx) => <span key={idx} className="pill pill-invalid">{e}</span>) :
                <span className="none-text">None</span>
              }
            </div>

            <div className="section-title">Duplicate Edges</div>
            <div className="pill-list">
              {result.duplicate_edges?.length > 0 ? 
                result.duplicate_edges.map((e, idx) => <span key={idx} className="pill pill-dupe">{e}</span>) :
                <span className="none-text">None</span>
              }
            </div>

            <div className="section-title">Raw Response</div>
            <button className="raw-toggle" onClick={() => setShowRaw(!showRaw)}>
              {showRaw ? 'Hide JSON' : 'Show JSON'}
            </button>
            {showRaw && <pre className="raw">{JSON.stringify(result, null, 2)}</pre>}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
