import React, { useState } from 'react';
import { FileText, UserCheck, Globe, GitBranch, Sparkles, RefreshCw } from 'lucide-react';
import { AnalyzeCandidateRequest } from '../types';

interface CandidateInputFormProps {
  inputData: AnalyzeCandidateRequest;
  setInputData: React.Dispatch<React.SetStateAction<AnalyzeCandidateRequest>>;
  onAnalyze: () => void;
  isLoading: boolean;
}

type TabType = 'jd' | 'cv' | 'linkedin' | 'github';

export const CandidateInputForm: React.FC<CandidateInputFormProps> = ({
  inputData,
  setInputData,
  onAnalyze,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('jd');

  const handleTextChange = (field: keyof AnalyzeCandidateRequest, value: string) => {
    setInputData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearCurrentTab = () => {
    switch (activeTab) {
      case 'jd': handleTextChange('jobDescription', ''); break;
      case 'cv': handleTextChange('cvText', ''); break;
      case 'linkedin': handleTextChange('linkedinText', ''); break;
      case 'github': handleTextChange('githubText', ''); break;
    }
  };

  return (
    <div className="glass-card">
      <div className="section-header">
        <h3 className="section-title">
          <Sparkles size={18} color="var(--accent-primary)" />
          Candidate Data Studio
        </h3>
        <button
          className="btn-secondary"
          onClick={clearCurrentTab}
          style={{ fontSize: '0.75rem', padding: '4px 8px' }}
        >
          <RefreshCw size={12} />
          Clear Tab
        </button>
      </div>

      {/* Tabs */}
      <div className="input-tabs">
        <button
          className={`input-tab-btn ${activeTab === 'jd' ? 'active' : ''}`}
          onClick={() => setActiveTab('jd')}
        >
          <FileText size={14} />
          1. JD ({inputData.jobDescription ? '✓' : '0'})
        </button>
        <button
          className={`input-tab-btn ${activeTab === 'cv' ? 'active' : ''}`}
          onClick={() => setActiveTab('cv')}
        >
          <UserCheck size={14} />
          2. CV ({inputData.cvText ? '✓' : '0'})
        </button>
        <button
          className={`input-tab-btn ${activeTab === 'linkedin' ? 'active' : ''}`}
          onClick={() => setActiveTab('linkedin')}
        >
          <Globe size={14} />
          3. LinkedIn ({inputData.linkedinText ? '✓' : '0'})
        </button>
        <button
          className={`input-tab-btn ${activeTab === 'github' ? 'active' : ''}`}
          onClick={() => setActiveTab('github')}
        >
          <GitBranch size={14} />
          4. GitHub ({inputData.githubText ? '✓' : '0'})
        </button>
      </div>

      {/* Textareas */}
      <div className="textarea-container">
        {activeTab === 'jd' && (
          <>
            <textarea
              className="custom-textarea"
              placeholder="Paste Job Description (JD) text here... Include role requirements, tech stack, team expectations, locations..."
              value={inputData.jobDescription}
              onChange={(e) => handleTextChange('jobDescription', e.target.value)}
            />
            <div className="textarea-meta">
              <span>Input 1 of 4: Target Job Description</span>
              <span>{inputData.jobDescription.length} characters</span>
            </div>
          </>
        )}

        {activeTab === 'cv' && (
          <>
            <textarea
              className="custom-textarea"
              placeholder="Paste Candidate CV / Resume plain text here... Include summary, employment history with dates, education, achievements..."
              value={inputData.cvText}
              onChange={(e) => handleTextChange('cvText', e.target.value)}
            />
            <div className="textarea-meta">
              <span>Input 2 of 4: Candidate CV / Resume Text</span>
              <span>{inputData.cvText.length} characters</span>
            </div>
          </>
        )}

        {activeTab === 'linkedin' && (
          <>
            <textarea
              className="custom-textarea"
              placeholder="Paste Scraped LinkedIn profile text here... Include headline, experience history, dates, skills, education..."
              value={inputData.linkedinText}
              onChange={(e) => handleTextChange('linkedinText', e.target.value)}
            />
            <div className="textarea-meta">
              <span>Input 3 of 4: LinkedIn Profile Text</span>
              <span>{inputData.linkedinText.length} characters</span>
            </div>
          </>
        )}

        {activeTab === 'github' && (
          <>
            <textarea
              className="custom-textarea"
              placeholder="Paste GitHub profile analysis / repository data here... Include repo names, descriptions, languages breakdown, commit messages..."
              value={inputData.githubText}
              onChange={(e) => handleTextChange('githubText', e.target.value)}
            />
            <div className="textarea-meta">
              <span>Input 4 of 4: GitHub Repositories & Commits</span>
              <span>{inputData.githubText.length} characters</span>
            </div>
          </>
        )}
      </div>

      <button
        className="btn-primary"
        onClick={onAnalyze}
        disabled={isLoading || !inputData.jobDescription || !inputData.cvText}
      >
        {isLoading ? (
          <>
            <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Running HireAssist AI Analysis...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Run HireAssist AI Analysis
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
