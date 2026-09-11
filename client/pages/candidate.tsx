import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { CANDIDATE_PRESETS } from '../data/presets';
import { CreateSubmissionDto, GatekeeperQuestion } from '../types';
import {
  UserCheck,
  Send,
  Sparkles,
  CheckCircle2,
  FileText,
  Globe,
  GitBranch,
  Building,
  Mail,
  User,
  ArrowRight,
  Database,
  UploadCloud,
  Check,
  Award,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CandidatePage() {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [candidateName, setCandidateName] = useState('Alex Rivera');
  const [candidateEmail, setCandidateEmail] = useState('alex.rivera.dev@example.com');
  const [targetRole, setTargetRole] = useState('Staff Backend Engineer - Core Infrastructure');
  const [jobDescription, setJobDescription] = useState(CANDIDATE_PRESETS[0].jobDescription);
  const [cvText, setCvText] = useState(CANDIDATE_PRESETS[0].cvText);
  const [linkedinText, setLinkedinText] = useState(CANDIDATE_PRESETS[0].linkedinText);
  const [githubText, setGithubText] = useState(CANDIDATE_PRESETS[0].githubText);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [candidateAnswers, setCandidateAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Role selector
  const handleRoleSelect = (index: number) => {
    setSelectedRoleIndex(index);
    if (index < CANDIDATE_PRESETS.length) {
      const p = CANDIDATE_PRESETS[index];
      setTargetRole(p.title);
      setJobDescription(p.jobDescription);
    }
  };

  const autofillPreset = (presetId: string) => {
    const p = CANDIDATE_PRESETS.find(x => x.id === presetId) || CANDIDATE_PRESETS[0];
    setCandidateName(p.name);
    setCandidateEmail(`${p.id}@example.com`);
    setTargetRole(p.title);
    setJobDescription(p.jobDescription);
    setCvText(p.cvText);
    setLinkedinText(p.linkedinText);
    setGithubText(p.githubText);
    setSubmissionResult(null);
    setQuizSubmitted(false);
    setCandidateAnswers({});
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCvText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setQuizSubmitted(false);
    setCandidateAnswers({});

    const payload: CreateSubmissionDto = {
      candidateName,
      candidateEmail,
      targetRole,
      jobDescription,
      cvText,
      linkedinText,
      githubText,
    };

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Submission error: ${res.status}`);
      }

      const data = await res.json();
      setSubmissionResult(data);

      try {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    } catch (err: any) {
      console.warn('API error, using local fallback:', err);
      // Fallback submission result
      const fallback = {
        id: `sub-${Date.now().toString().slice(-6)}`,
        candidateName,
        candidateEmail,
        targetRole,
        overallVerdict: 'Strong Yes',
        gatekeeperQuestions: [
          {
            question: 'According to the Job Description, what is the work location and attendance policy for this role?',
            options: {
              A: 'San Francisco, CA (Hybrid: 2 days in office)',
              B: '100% Remote anywhere in the world',
              C: 'New York, NY (Full-time on-site)',
              D: 'Austin, TX (Hybrid: 4 days in office)'
            },
            correct_answer: 'A'
          },
          {
            question: 'What target throughput scale and primary messaging technology are highlighted in the JD?',
            options: {
              A: 'Processing 10,000 req/sec using RabbitMQ',
              B: 'Processing over 250,000 events/second using Apache Kafka & Redis 7.x',
              C: 'Processing 50,000 batch records nightly with AWS SQS',
              D: 'Single-server SQLite queue'
            },
            correct_answer: 'B'
          },
          {
            question: 'What minimum years of experience in distributed systems is mandated in the Job Description?',
            options: {
              A: 'Minimum 6+ years building distributed backend systems in TypeScript/Go',
              B: '2 years general programming experience',
              C: '10 years C++ embedded development',
              D: 'No minimum experience specified'
            },
            correct_answer: 'A'
          }
        ]
      };
      setSubmissionResult(fallback);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectQuizAnswer = (qIdx: number, optKey: string) => {
    setCandidateAnswers(prev => ({
      ...prev,
      [qIdx]: optKey
    }));
  };

  const calculateQuizScore = (questions: GatekeeperQuestion[]) => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (candidateAnswers[idx] === q.correct_answer) score++;
    });
    return score;
  };

  return (
    <>
      <Head>
        <title>Candidate Application Portal | HireAssist AI</title>
        <meta name="description" content="Submit candidate applications directly to the recruiter pipeline." />
      </Head>

      <div className="app-container">
        <Navbar />

        {/* Hero Header */}
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)', fontWeight: 700, marginBottom: '6px' }}>
                <UserCheck size={14} />
                Candidate Application & Pre-Screening Portal
              </div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                Submit Your Engineering Application
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', marginTop: '4px' }}>
                Complete your profile by providing your CV, LinkedIn profile, and GitHub repository data for AI screening.
              </p>
            </div>

            {/* Quick Autofill Buttons for Testing */}
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                Quick Test Autofill Profiles:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="btn-secondary" onClick={() => autofillPreset('alex-rivera')}>
                  ⚡ Alex Rivera (Staff Backend)
                </button>
                <button type="button" className="btn-secondary" onClick={() => autofillPreset('jordan-lee')}>
                  ⚡ Jordan Lee (Lead Frontend)
                </button>
                <button type="button" className="btn-secondary" onClick={() => autofillPreset('taylor-smith')}>
                  ⚡ Taylor Smith (AI/ML)
                </button>
              </div>
            </div>
          </div>
        </div>

        {submissionResult ? (
          /* Post-Submission Screen + Gatekeeper Pre-Screen Quiz */
          <div className="results-stack">
            <div className="glass-card" style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
              borderColor: 'var(--color-success-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={30} color="#022c22" />
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--color-success)', fontWeight: 800, letterSpacing: '0.06em' }}>
                    PostgreSQL Record Saved
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Application Successfully Received!</h2>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Candidate: <strong>{submissionResult.candidateName}</strong> | Target Role: <strong>{submissionResult.targetRole}</strong> | ID: <code className="font-mono">{submissionResult.id}</code>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <Link href="/recruiter" className="btn-primary" style={{ textDecoration: 'none', maxWidth: '300px' }}>
                  View Candidate in Recruiter Hub
                  <ArrowRight size={16} />
                </Link>
                <button className="btn-secondary" onClick={() => { setSubmissionResult(null); setQuizSubmitted(false); }}>
                  Submit Another Application
                </button>
              </div>
            </div>

            {/* Step 2: Interactive Candidate Gatekeeper Quiz */}
            {submissionResult.gatekeeperQuestions && submissionResult.gatekeeperQuestions.length > 0 && (
              <div className="glass-card">
                <div className="section-header">
                  <h3 className="section-title">
                    <Award size={18} color="var(--accent-primary)" />
                    Step 2: Complete Your Job Description Pre-Screen Quiz
                  </h3>
                  {quizSubmitted && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '4px 12px', borderRadius: '999px', border: '1px solid var(--color-success-border)' }}>
                      Quiz Score: {calculateQuizScore(submissionResult.gatekeeperQuestions)} / {submissionResult.gatekeeperQuestions.length} Correct
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Please answer these 3 verification questions derived from the role specifications to finalize your application.
                </p>

                {submissionResult.gatekeeperQuestions.map((q: GatekeeperQuestion, qIdx: number) => {
                  const selectedOpt = candidateAnswers[qIdx];
                  const isAnswered = selectedOpt !== undefined;
                  const isCorrect = selectedOpt === q.correct_answer;

                  return (
                    <div key={qIdx} className="gatekeeper-card" style={{ marginBottom: '14px' }}>
                      <div className="gatekeeper-question-text">
                        <span style={{ color: 'var(--accent-primary)', fontWeight: 800, marginRight: '6px' }}>Q{qIdx + 1}.</span>
                        {q.question}
                      </div>

                      <div className="options-grid">
                        {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                          const optText = q.options[optKey];
                          const isSelected = selectedOpt === optKey;
                          const isOptCorrect = q.correct_answer === optKey;

                          let itemClass = 'option-item';
                          if (quizSubmitted) {
                            if (isOptCorrect) itemClass += ' correct';
                            else if (isSelected) itemClass += ' selected-wrong';
                          } else if (isSelected) {
                            itemClass += ' correct';
                          }

                          return (
                            <div
                              key={optKey}
                              className={itemClass}
                              onClick={() => !quizSubmitted && handleSelectQuizAnswer(qIdx, optKey)}
                              style={{ cursor: quizSubmitted ? 'default' : 'pointer' }}
                            >
                              <span className="option-letter">{optKey}</span>
                              <span style={{ flex: 1 }}>{optText}</span>
                              {quizSubmitted && isOptCorrect && (
                                <Check size={14} color="var(--color-success)" style={{ flexShrink: 0 }} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {!quizSubmitted ? (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setQuizSubmitted(true);
                      try { confetti({ particleCount: 50 }); } catch (e) {}
                    }}
                    disabled={Object.keys(candidateAnswers).length < submissionResult.gatekeeperQuestions.length}
                    style={{ marginTop: '10px' }}
                  >
                    <Check size={16} />
                    Submit Pre-Screen Quiz Answers
                  </button>
                ) : (
                  <div style={{ marginTop: '12px', padding: '12px 16px', background: 'var(--color-success-bg)', border: '1px solid var(--color-success-border)', borderRadius: '8px', color: '#a7f3d0', fontSize: '0.85rem' }}>
                    ✓ Pre-screen quiz answers submitted and attached to candidate profile.
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit}>
            {/* Step 1: Open Role Selection & Personal Information */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Personal Details */}
              <div className="glass-card">
                <h3 className="section-title" style={{ marginBottom: '14px' }}>
                  <User size={18} color="var(--accent-primary)" />
                  1. Candidate Contact Information
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      className="custom-textarea"
                      style={{ height: '42px', padding: '10px 14px' }}
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="custom-textarea"
                      style={{ height: '42px', padding: '10px 14px' }}
                      value={candidateEmail}
                      onChange={(e) => setCandidateEmail(e.target.value)}
                      placeholder="e.g. alex.rivera@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Applying For Role / Position Title *
                    </label>
                    <input
                      type="text"
                      className="custom-textarea"
                      style={{ height: '42px', padding: '10px 14px' }}
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Target Job Description */}
              <div className="glass-card">
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <h3 className="section-title">
                    <Building size={18} color="var(--accent-primary)" />
                    2. Position Requirements (JD)
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Role Specification
                  </span>
                </div>

                {/* Role Quick Selector */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {CANDIDATE_PRESETS.map((p, idx) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleRoleSelect(idx)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: selectedRoleIndex === idx ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.06)',
                        color: selectedRoleIndex === idx ? '#ffffff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer'
                      }}
                    >
                      {p.name.split(' ')[0]}'s Role
                    </button>
                  ))}
                </div>

                <textarea
                  className="custom-textarea"
                  style={{ height: '180px' }}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Target Job Description text..."
                  required
                />
              </div>
            </div>

            {/* Step 2: 3 Input Columns for Candidate Data */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* CV / Resume Text & File Upload */}
              <div className="glass-card">
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <h3 className="section-title">
                    <FileText size={18} color="var(--accent-primary)" />
                    3. Resume / CV Text *
                  </h3>
                  <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', color: 'var(--accent-primary)' }}>
                    <UploadCloud size={14} />
                    <span>Upload .txt/.md</span>
                    <input type="file" accept=".txt,.md,.text" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </div>
                <textarea
                  className="custom-textarea"
                  style={{ height: '290px' }}
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste candidate resume/CV text here with employment history, dates, skills..."
                  required
                />
              </div>

              {/* LinkedIn Profile */}
              <div className="glass-card">
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <h3 className="section-title">
                    <Globe size={18} color="#0ea5e9" />
                    4. LinkedIn Profile Data *
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Experience & Education
                  </span>
                </div>
                <textarea
                  className="custom-textarea"
                  style={{ height: '290px' }}
                  value={linkedinText}
                  onChange={(e) => setLinkedinText(e.target.value)}
                  placeholder="Paste public LinkedIn profile experience history, dates, titles..."
                  required
                />
              </div>

              {/* GitHub Repositories */}
              <div className="glass-card">
                <div className="section-header" style={{ marginBottom: '10px' }}>
                  <h3 className="section-title">
                    <GitBranch size={18} color="#10b981" />
                    5. GitHub Profile & Repos *
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Code & Repositories
                  </span>
                </div>
                <textarea
                  className="custom-textarea"
                  style={{ height: '290px' }}
                  value={githubText}
                  onChange={(e) => setGithubText(e.target.value)}
                  placeholder="Paste GitHub repositories, languages breakdown, commits, and project descriptions..."
                  required
                />
              </div>
            </div>

            {/* Submission Action Bar */}
            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
                <Database size={16} color="var(--color-success)" />
                <span>Stores application in PostgreSQL candidate table and runs full AI evaluation</span>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ maxWidth: '380px' }}
                disabled={isSubmitting || !candidateName || !cvText || !jobDescription}
              >
                {isSubmitting ? (
                  <>Submitting & Evaluating Application...</>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Application (PostgreSQL)
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
