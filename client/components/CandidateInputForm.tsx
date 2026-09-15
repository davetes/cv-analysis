import React, { useState } from 'react';
import { FileText, UserCheck, Globe, GitBranch, Sparkles, RefreshCw, Database, Check, User } from 'lucide-react';
import { AnalyzeCandidateRequest } from '../types';

interface CandidateInputFormProps {
  inputData: AnalyzeCandidateRequest;
  setInputData: React.Dispatch<React.SetStateAction<AnalyzeCandidateRequest>>;
  onAnalyze: () => void;
  isLoading: boolean;
  onSavedToDatabase?: () => void;
}

type TabType = 'jd' | 'cv' | 'linkedin' | 'github';

export const CandidateInputForm: React.FC<CandidateInputFormProps> = ({
  inputData,
  setInputData,
  onAnalyze,
  isLoading,
  onSavedToDatabase,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('jd');
  const [candidateName, setCandidateName] = useState<string>('Alex Rivera');
  const [isSavingDb, setIsSavingDb] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

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

  const handleSaveToDatabase = async () => {
    setIsSavingDb(true);
    setSaveSuccess(false);

    try {
      const payload = {
        candidateName: candidateName || 'Candidate',
        jobDescription: inputData.jobDescription,
        cvText: inputData.cvText,
        linkedinText: inputData.linkedinText,
        githubText: inputData.githubText,
        targetRole: 'Software Engineer',
      };

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveSuccess(true);
        if (onSavedToDatabase) onSavedToDatabase();
        if (onAnalyze) onAnalyze();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.warn('Database save error:', err);
      if (onAnalyze) onAnalyze();
    } finally {
      setIsSavingDb(false);
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

      {/* Candidate Name Input */}
      <div style={{ marginBottom: '14px' }}>
        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
          Candidate Name
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="custom-textarea"
            style={{ height: '40px', padding: '8px 12px 8px 34px' }}
            placeholder="e.g. Alex Rivera"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
          />
          <User size={14} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
        </div>
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
              style={{ height: '320px' }}
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
              style={{ height: '320px' }}
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
              style={{ height: '320px' }}
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
              style={{ height: '320px' }}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          className="btn-primary"
          onClick={handleSaveToDatabase}
          disabled={isSavingDb || isLoading || !inputData.jobDescription || !inputData.cvText}
        >
          {isSavingDb ? (
            <>Saving to Database & Running AI...</>
          ) : (
            <>
              <Database size={16} />
              Save Candidate into Database & Analyze
            </>
          )}
        </button>

        {saveSuccess && (
          <div style={{ padding: '8px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Check size={14} />
            Successfully saved candidate profile into database!
          </div>
        )}
      </div>
    </div>
  );
};
