import React from 'react';
import { AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { VerificationResult } from '../types';

interface DiffInspectorProps {
  verification: VerificationResult;
}

export const DiffInspector: React.FC<DiffInspectorProps> = ({ verification }) => {
  const { linkedin_match_score, discrepancies } = verification;

  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-number-pill">2</span>
          LinkedIn vs CV Verification (The "Diff Check")
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Verification Match:</span>
          <span
            style={{
              fontWeight: 800,
              fontSize: '0.95rem',
              fontFamily: 'JetBrains Mono',
              color:
                linkedin_match_score >= 85
                  ? 'var(--color-success)'
                  : linkedin_match_score >= 65
                    ? 'var(--color-warning)'
                    : 'var(--color-danger)',
            }}
          >
            {linkedin_match_score}/100
          </span>
        </div>
      </div>

      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Cross-referencing employment dates, title inflation, missing credentials, and tenure gaps between CV text and public LinkedIn profile.
      </p>

      {discrepancies && discrepancies.length > 0 ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', color: 'var(--color-danger)', fontWeight: 700, fontSize: '0.82rem' }}>
            <ShieldAlert size={16} />
            {discrepancies.length} Discrepanc{discrepancies.length === 1 ? 'y' : 'ies'} Detected:
          </div>
          {discrepancies.map((disc, idx) => (
            <div key={idx} className="discrepancy-item">
              <AlertOctagon size={18} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{disc}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-discrepancies">
          <CheckCircle2 size={20} color="var(--color-success)" />
          <span>No discrepancies identified. CV employment dates, roles, and education align seamlessly with LinkedIn.</span>
        </div>
      )}
    </div>
  );
};
