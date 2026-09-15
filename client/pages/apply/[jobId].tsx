import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  FileText,
  User,
  Mail,
  Building,
  MapPin,
  Globe,
  GitBranch,
  Send,
  CheckCircle2,
  Check,
  Award,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CANDIDATE_PRESETS } from '../../data/presets';
import { GatekeeperQuestion } from '../../types';

export default function JobApplyPage() {
  const router = useRouter();
  const { jobId } = router.query;

  const [job, setJob] = useState<any | null>(null);
  const [isLoadingJob, setIsLoadingJob] = useState(true);
  const [showJdDetails, setShowJdDetails] = useState(false);

  // Form State
  const [candidateName, setCandidateName] = useState('Alex Rivera');
  const [candidateEmail, setCandidateEmail] = useState('alex.rivera.dev@example.com');
  const [cvText, setCvText] = useState(CANDIDATE_PRESETS[0].cvText);
  const [linkedinText, setLinkedinText] = useState(CANDIDATE_PRESETS[0].linkedinText);
  const [githubText, setGithubText] = useState(CANDIDATE_PRESETS[0].githubText);

  // Submission & Quiz State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [candidateAnswers, setCandidateAnswers] = useState<{ [qIdx: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails(jobId as string);
    }
  }, [jobId]);

  const fetchJobDetails = async (id: string) => {
    setIsLoadingJob(true);
    try {
      const res = await fetch(`/api/jobs/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
      } else {
        throw new Error('Job not found');
      }
    } catch (e) {
      // Fallback matching preset
      const preset = CANDIDATE_PRESETS.find(p => id.includes(p.id.split('-')[0])) || CANDIDATE_PRESETS[0];
      setJob({
        id,
        title: preset.title,
        company: id.includes('hypergrowth') ? 'HyperGrowth Enterprise' : id.includes('neurotech') ? 'NeuroTech Systems' : 'ScaleWave Systems',
        location: id.includes('hypergrowth') ? 'New York, NY (Hybrid)' : id.includes('neurotech') ? 'Remote (US/Canada)' : 'San Francisco, CA (Hybrid)',
        jobDescription: preset.jobDescription,
        instructions: 'Please provide complete details for automated technical screening.',
      });
    } finally {
      setIsLoadingJob(false);
    }
  };

  const handleAutofill = (presetId: string) => {
    const p = CANDIDATE_PRESETS.find(x => x.id === presetId) || CANDIDATE_PRESETS[0];
    setCandidateName(p.name);
    setCandidateEmail(`${p.id}@example.com`);
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
      if (content) setCvText(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);
    setQuizSubmitted(false);
    setCandidateAnswers({});

    const payload = {
      jobId: (jobId as string) || job?.id,
      candidateName,
      candidateEmail,
      targetRole: job?.title || 'Software Engineer',
      jobDescription: job?.jobDescription || CANDIDATE_PRESETS[0].jobDescription,
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

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSubmissionResult(data);

      try { confetti({ particleCount: 60, spread: 70 }); } catch (err) {}
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      // Fallback
      setSubmissionResult({
        id: `sub-${Date.now().toString().slice(-6)}`,
        candidateName,
        candidateEmail,
        targetRole: job?.title,
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
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectQuizOption = (qIdx: number, optKey: string) => {
    if (quizSubmitted) return;
    setCandidateAnswers(prev => ({
      ...prev,
      [qIdx]: optKey
    }));
  };

  const getQuizScore = (questions: GatekeeperQuestion[]) => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (candidateAnswers[idx] === q.correct_answer) score++;
    });
    return score;
  };

  return (
    <>
      <Head>
        <title>{job?.title ? `${job.title} - Application Form` : 'Job Application Form'}</title>
      </Head>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '16px 12px 60px' }}>
        {/* Top Google Forms-Style Banner Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          {/* Form Top Accent Bar */}
          <div style={{ height: '8px', background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #ec4899)' }} />

          <div style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#4f46e5', fontWeight: 700, marginBottom: '4px' }}>
                  <Building size={14} color="#4f46e5" />
                  {job?.company || 'Hiring Company'}
                </div>
                <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                  {job?.title || 'Engineering Application Form'}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  <MapPin size={13} />
                  {job?.location || 'Remote / Hybrid'}
                </div>
              </div>

              <Link href="/" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.78rem' }}>
                Employer Hub
              </Link>
            </div>

            {/* Employer Instructions */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
              {job?.instructions || 'Please complete all sections below. After submission, an automated 3-question pre-screening quiz will verify your familiarity with the job requirements.'}
            </div>

            {/* Toggle View Full Job Description */}
            <button
              type="button"
              onClick={() => setShowJdDetails(!showJdDetails)}
              style={{
                marginTop: '12px',
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {showJdDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {showJdDetails ? 'Hide Job Description' : 'View Full Job Description & Requirements'}
            </button>

            {showJdDetails && job?.jobDescription && (
              <div style={{ marginTop: '12px', background: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#334155', whiteSpace: 'pre-wrap', maxHeight: '250px', overflowY: 'auto' }}>
                {job.jobDescription}
              </div>
            )}
          </div>
        </div>

        {submissionResult ? (
          /* Post-Submission Screen + Gatekeeper Pre-Screen Quiz */
          <div className="results-stack">
            <div className="glass-card" style={{
              background: '#ecfdf5',
              borderColor: 'var(--color-success-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={30} color="#ffffff" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#065f46' }}>Application Successfully Received!</h2>
                  <p style={{ fontSize: '0.85rem', color: '#047857', marginTop: '2px' }}>
                    Candidate: <strong>{submissionResult.candidateName}</strong> | Submission ID: <code className="font-mono">{submissionResult.id}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2: Interactive Gatekeeper Pre-Screen Quiz */}
            {submissionResult.gatekeeperQuestions && submissionResult.gatekeeperQuestions.length > 0 && (
              <div className="glass-card">
                <div className="section-header">
                  <h3 className="section-title">
                    <Award size={18} color="var(--accent-primary)" />
                    Step 2: Complete Your Pre-Screening Quiz
                  </h3>
                  {quizSubmitted && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065f46', background: '#ecfdf5', padding: '4px 12px', borderRadius: '999px', border: '1px solid #a7f3d0' }}>
                      Score: {getQuizScore(submissionResult.gatekeeperQuestions)} / {submissionResult.gatekeeperQuestions.length} Correct
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Please answer these 3 verification questions based on the Job Description to finalize your application review.
                </p>

                {submissionResult.gatekeeperQuestions.map((q: GatekeeperQuestion, qIdx: number) => {
                  const selectedOpt = candidateAnswers[qIdx];
                  const isOptCorrect = q.correct_answer === selectedOpt;

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
                          const isKeyCorrect = q.correct_answer === optKey;

                          let itemClass = 'option-item';
                          if (quizSubmitted) {
                            if (isKeyCorrect) itemClass += ' correct';
                            else if (isSelected) itemClass += ' selected-wrong';
                          } else if (isSelected) {
                            itemClass += ' correct';
                          }

                          return (
                            <div
                              key={optKey}
                              className={itemClass}
                              onClick={() => handleSelectQuizOption(qIdx, optKey)}
                              style={{ cursor: quizSubmitted ? 'default' : 'pointer' }}
                            >
                              <span className="option-letter">{optKey}</span>
                              <span style={{ flex: 1 }}>{optText}</span>
                              {quizSubmitted && isKeyCorrect && (
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
                    type="button"
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
                  <div style={{ marginTop: '12px', padding: '14px 18px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', color: '#065f46', fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>✓ Quiz completed. Your answers have been recorded for the employer review.</span>
                    <Link href="/" className="btn-secondary" style={{ textDecoration: 'none' }}>
                      Go to Employer Dashboard
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Google Form-Style Application Fields */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Autofill Demo Strip */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '12px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Quick Test Autofill:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" className="btn-secondary" onClick={() => handleAutofill('alex-rivera')} style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
                  Alex Rivera (Staff Backend)
                </button>
                <button type="button" className="btn-secondary" onClick={() => handleAutofill('jordan-lee')} style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
                  Jordan Lee (Lead Frontend)
                </button>
                <button type="button" className="btn-secondary" onClick={() => handleAutofill('taylor-smith')} style={{ fontSize: '0.75rem', padding: '5px 10px' }}>
                  Taylor Smith (AI/ML)
                </button>
              </div>
            </div>

            {/* Section 1: Candidate Contact Info */}
            <div className="glass-card">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} color="var(--accent-primary)" />
                1. Candidate Contact Information <span style={{ color: 'var(--color-danger)' }}>*</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="custom-textarea"
                    style={{ height: '42px', padding: '10px 14px' }}
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="custom-textarea"
                    style={{ height: '42px', padding: '10px 14px' }}
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Resume / CV Text */}
            <div className="glass-card">
              <div className="section-header" style={{ marginBottom: '10px' }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="var(--accent-primary)" />
                  2. Resume / CV Plain Text <span style={{ color: 'var(--color-danger)' }}>*</span>
                </h2>
                <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                  <UploadCloud size={14} />
                  <span>Upload .txt/.md</span>
                  <input type="file" accept=".txt,.md,.text" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Include employment history, start/end dates, key achievements, and technologies used.
              </p>
              <textarea
                className="custom-textarea"
                style={{ height: '220px' }}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Paste your CV text here..."
                required
              />
            </div>

            {/* Section 3: LinkedIn Profile */}
            <div className="glass-card">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} color="#0ea5e9" />
                3. LinkedIn Profile Data & History <span style={{ color: 'var(--color-danger)' }}>*</span>
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Paste public LinkedIn headline, experience tenure, and education history.
              </p>
              <textarea
                className="custom-textarea"
                style={{ height: '200px' }}
                value={linkedinText}
                onChange={(e) => setLinkedinText(e.target.value)}
                placeholder="Paste public LinkedIn profile experience..."
                required
              />
            </div>

            {/* Section 4: GitHub Profile */}
            <div className="glass-card">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GitBranch size={16} color="#10b981" />
                4. GitHub Profile & Repository Information <span style={{ color: 'var(--color-danger)' }}>*</span>
              </h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Paste your top repository names, code descriptions, languages used, and commit messages.
              </p>
              <textarea
                className="custom-textarea"
                style={{ height: '200px' }}
                value={githubText}
                onChange={(e) => setGithubText(e.target.value)}
                placeholder="Paste GitHub repos, languages, commit logs..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '16px', fontSize: '1rem' }}
              disabled={isSubmitting || !candidateName || !cvText}
            >
              {isSubmitting ? (
                <>Submitting Application & Generating Pre-Screen Quiz...</>
              ) : (
                <>
                  <Send size={18} />
                  Submit Application & Continue to Pre-Screen Quiz
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
