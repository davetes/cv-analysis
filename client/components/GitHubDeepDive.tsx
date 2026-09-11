import React from 'react';
import { GitBranch, Terminal, Layers, Cpu, TrendingUp } from 'lucide-react';
import { GitHubAnalysisResult } from '../types';

interface GitHubDeepDiveProps {
  githubAnalysis: GitHubAnalysisResult;
}

export const GitHubDeepDive: React.FC<GitHubDeepDiveProps> = ({ githubAnalysis }) => {
  const { top_languages, best_project, technical_questions } = githubAnalysis;

  const getQuestionIcon = (idx: number) => {
    switch (idx) {
      case 0: return <Layers size={16} color="#818cf8" />;
      case 1: return <Cpu size={16} color="#38bdf8" />;
      case 2: return <TrendingUp size={16} color="#34d399" />;
      default: return <Terminal size={16} color="#818cf8" />;
    }
  };

  const getQuestionLabel = (idx: number) => {
    switch (idx) {
      case 0: return 'Architecture Choices:';
      case 1: return 'Function / Library Implementation:';
      case 2: return 'Scaling & Performance What-If:';
      default: return `Technical Q${idx + 1}:`;
    }
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <span className="section-number-pill">3</span>
          GitHub Analysis (The "Deep Dive")
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
          <GitBranch size={14} />
          Code Repository Evaluation
        </div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Extracted Top Stack / Languages:
        </div>
        <div className="gh-tech-badge-container">
          {top_languages.map((lang, idx) => (
            <span key={idx} className="gh-tech-badge">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: idx === 0 ? '#6366f1' : idx === 1 ? '#06b6d4' : '#10b981' }} />
              {lang}
            </span>
          ))}
        </div>
      </div>

      <div className="gh-best-project">
        <div className="gh-project-label">Most Impressive Open-Source Project</div>
        <div className="gh-project-desc">{best_project}</div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
          Targeted Technical Interview Questions (Code-Specific):
        </div>

        {technical_questions.map((q, idx) => {
          // Clean question prefix if duplicate
          const cleanedText = q.replace(/^(Architecture|Function\/Library|Scaling & Performance|Question \d+):\s*/i, '');

          return (
            <div key={idx} className="gh-question-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                {getQuestionIcon(idx)}
                <span className="gh-q-tag">{getQuestionLabel(idx)}</span>
              </div>
              <div style={{ color: '#e2e8f0', paddingLeft: '24px' }}>{cleanedText}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
