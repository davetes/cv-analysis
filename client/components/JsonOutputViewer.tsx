import React, { useState } from 'react';
import { Code, Copy, Check, Download } from 'lucide-react';
import { CandidateAnalysisResponse } from '../types';

interface JsonOutputViewerProps {
  analysis: CandidateAnalysisResponse;
}

export const JsonOutputViewer: React.FC<JsonOutputViewerProps> = ({ analysis }) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(analysis, null, 2);

  const copyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${analysis.candidate_name.replace(/\s+/g, '_')}_hireassist.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <Code size={18} color="var(--accent-primary)" />
          Structured JSON Output (API Response)
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={copyJson} style={{ fontSize: '0.75rem' }}>
            {copied ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
          <button className="btn-secondary" onClick={downloadJson} style={{ fontSize: '0.75rem' }}>
            <Download size={12} />
            Download
          </button>
        </div>
      </div>

      <div className="json-viewer-container">
        <pre className="json-code">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};
