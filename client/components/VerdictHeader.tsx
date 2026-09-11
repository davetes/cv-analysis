import React from 'react';
import { CheckCircle2, AlertTriangle, XOctagon, Copy, Check, Download, FileText } from 'lucide-react';
import { CandidateAnalysisResponse } from '../types';
import confetti from 'canvas-confetti';

interface VerdictHeaderProps {
  analysis: CandidateAnalysisResponse;
}

export const VerdictHeader: React.FC<VerdictHeaderProps> = ({ analysis }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (analysis.overall_verdict === 'Strong Yes') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [analysis]);

  const copyFullReport = () => {
    navigator.clipboard.writeText(JSON.stringify(analysis, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysis, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${analysis.candidate_name.replace(/\s+/g, '_')}_hireassist_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getVerdictClass = () => {
    switch (analysis.overall_verdict) {
      case 'Strong Yes': return 'strong-yes';
      case 'Red Flag': return 'red-flag';
      case 'Maybe': return 'maybe';
      default: return 'maybe';
    }
  };

  const getVerdictPill = () => {
    switch (analysis.overall_verdict) {
      case 'Strong Yes':
        return (
          <span className="verdict-pill pill-strong-yes">
            <CheckCircle2 size={20} />
            Strong Yes
          </span>
        );
      case 'Red Flag':
        return (
          <span className="verdict-pill pill-red-flag">
            <XOctagon size={20} />
            Red Flag
          </span>
        );
      case 'Maybe':
        return (
          <span className="verdict-pill pill-maybe">
            <AlertTriangle size={20} />
            Maybe
          </span>
        );
    }
  };

  return (
    <div className={`verdict-hero ${getVerdictClass()}`}>
      <div className="verdict-main">
        <div className="verdict-candidate-info">
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
            Candidate Evaluation Summary
          </span>
          <h2 className="verdict-candidate-name">{analysis.candidate_name}</h2>
        </div>

        <div className="verdict-badge-wrapper">
          <div className="score-badge">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>LinkedIn Diff Match:</span>
            <span
              className="score-value"
              style={{
                color: analysis.verification.linkedin_match_score >= 85
                  ? 'var(--color-success)'
                  : analysis.verification.linkedin_match_score >= 65
                    ? 'var(--color-warning)'
                    : 'var(--color-danger)'
              }}
            >
              {analysis.verification.linkedin_match_score}%
            </span>
          </div>

          {getVerdictPill()}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
        <button className="btn-secondary" onClick={copyFullReport}>
          {copied ? <Check size={14} color="var(--color-success)" /> : <Copy size={14} />}
          {copied ? 'Copied JSON' : 'Copy JSON Report'}
        </button>
        <button className="btn-secondary" onClick={downloadJson}>
          <Download size={14} />
          Export JSON
        </button>
      </div>
    </div>
  );
};
