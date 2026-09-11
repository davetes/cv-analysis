import React, { useState } from 'react';
import { MessageSquare, Users, Copy, Check, Quote } from 'lucide-react';

interface InterviewScriptCardProps {
  confrontationScript: string;
  behavioralQuestions: string[];
}

export const InterviewScriptCard: React.FC<InterviewScriptCardProps> = ({
  confrontationScript,
  behavioralQuestions,
}) => {
  const [copied, setCopied] = useState(false);

  const copyScript = () => {
    navigator.clipboard.writeText(confrontationScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasDiscrepancyScript = confrontationScript && !confrontationScript.toLowerCase().includes('no discrepancies found');

  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-number-pill">4</span>
          Recruiter Interview Guide & Scripts
        </h3>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            <Quote size={14} color="var(--accent-primary)" />
            {hasDiscrepancyScript ? 'Recruiter Confrontation Script (2-Sentence Probe):' : 'Discrepancy Verification Status:'}
          </div>
          {hasDiscrepancyScript && (
            <button className="btn-secondary" onClick={copyScript} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              {copied ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy Script'}
            </button>
          )}
        </div>

        <div className="script-box">
          "{confrontationScript}"
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>
          <Users size={14} color="var(--accent-secondary)" />
          Achievement-Based Behavioral Questions (From CV):
        </div>

        {behavioralQuestions.map((bq, idx) => (
          <div key={idx} className="behavioral-item">
            <span style={{ color: 'var(--accent-secondary)', fontWeight: 800 }}>B{idx + 1}.</span>
            <span style={{ color: '#e2e8f0' }}>{bq}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
