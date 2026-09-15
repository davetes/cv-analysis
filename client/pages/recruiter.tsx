import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { VerdictHeader } from '../components/VerdictHeader';
import { GatekeeperQuiz } from '../components/GatekeeperQuiz';
import { DiffInspector } from '../components/DiffInspector';
import { GitHubDeepDive } from '../components/GitHubDeepDive';
import { InterviewScriptCard } from '../components/InterviewScriptCard';
import { CandidateInputForm } from '../components/CandidateInputForm';
import { CANDIDATE_PRESETS } from '../data/presets';
import { CandidateAnalysisResponse, AnalyzeCandidateRequest } from '../types';
import {
  Users,
  CheckCircle2,
  XOctagon,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  Database,
  Search,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

export default function RecruiterPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<'pipeline' | 'manual'>('pipeline');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // For manual ad-hoc analysis tab
  const [manualInput, setManualInput] = useState<AnalyzeCandidateRequest>({
    jobDescription: CANDIDATE_PRESETS[0].jobDescription,
    cvText: CANDIDATE_PRESETS[0].cvText,
    linkedinText: CANDIDATE_PRESETS[0].linkedinText,
    githubText: CANDIDATE_PRESETS[0].githubText,
  });
  const [manualAnalysis, setManualAnalysis] = useState<CandidateAnalysisResponse | null>(null);
  const [isManualLoading, setIsManualLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
        if (data.length > 0 && !selectedSubmission) {
          setSelectedSubmission(data[0]);
        }
      } else {
        throw new Error('API returned ' + res.status);
      }
    } catch (err) {
      console.warn('Could not fetch from /api/submissions, loading preset candidates:', err);
      // Fallback: seed 3 preset candidates
      const fallbackList = CANDIDATE_PRESETS.map((p, idx) => ({
        id: `pg-sub-${idx + 1}`,
        candidateName: p.name,
        candidateEmail: `${p.id}@example.com`,
        targetRole: p.title,
        jobDescription: p.jobDescription,
        cvText: p.cvText,
        linkedinText: p.linkedinText,
        githubText: p.githubText,
        overallVerdict: p.verdictHint,
        linkedinMatchScore: p.id === 'jordan-lee' ? 42 : p.id === 'taylor-smith' ? 90 : 98,
        createdAt: new Date(Date.now() - idx * 3600000).toISOString(),
        fullAnalysisJson: {
          candidate_name: p.name,
          gatekeeper_questions: [
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
          ],
          verification: {
            linkedin_match_score: p.id === 'jordan-lee' ? 42 : p.id === 'taylor-smith' ? 90 : 98,
            discrepancies: p.id === 'jordan-lee' ? [
              'CV claims tenure at HyperGrowth began in 2019, whereas LinkedIn profile indicates employment started in Jan 2022 (3-year mismatch).',
              "CV lists current title as 'Lead Frontend Architect' managing 22 engineers, while LinkedIn profile lists title as 'Frontend Developer'.",
              "CV states M.S. in Computer Science from Columbia University (2015–2017), whereas LinkedIn lists B.S. in IT from City College of New York (CCNY)."
            ] : []
          },
          github_analysis: {
            top_languages: p.id === 'jordan-lee' ? ['HTML/CSS', 'JavaScript', 'TypeScript'] : p.id === 'taylor-smith' ? ['Python', 'C++', 'TypeScript'] : ['TypeScript', 'Go', 'Shell / Dockerfile'],
            best_project: p.id === 'jordan-lee'
              ? 'react-todo-app — A client-side Todo application demonstrating basic React state hooks and LocalStorage persistence.'
              : p.id === 'taylor-smith'
                ? 'transformer-pruning-toolkit — Structured weight pruning and quantization library for HuggingFace Transformers.'
                : 'distributed-task-orchestrator — A distributed task queue and workflow engine with leader election, priority scheduling, and circuit breaker patterns built on NestJS & Redis Streams.',
            technical_questions: [
              'Architecture: In your primary repository, how did you structure service boundaries and state management to prevent race conditions during concurrent executions?',
              'Function/Library: What was the most technically complex library integration or custom algorithm in this repository, and how did you handle edge cases?',
              'Scaling & Performance: If production workload increases by 20x, how would your architecture adapt to mitigate database write contention and memory bottlenecks?'
            ]
          },
          overall_verdict: p.verdictHint,
          behavioral_questions: [
            'Tell me about a time you led a critical architectural migration under tight deadlines and how you managed cross-team risks.',
            'Describe a scenario where you had to align competing priorities between technical refactoring and product feature delivery.',
            'Can you share an experience where a production incident tested your debugging skills, and what automated guardrails you implemented afterward?'
          ],
          confrontation_script: p.id === 'jordan-lee'
            ? 'During our review, we noted an inconsistency where CV claims tenure at HyperGrowth began in 2019, whereas LinkedIn profile indicates employment started in Jan 2022. Could you walk us through the timeline and clarify the specific scope of responsibilities you held during this period?'
            : 'No discrepancies found.'
        }
      }));
      setSubmissions(fallbackList);
      if (!selectedSubmission) setSelectedSubmission(fallbackList[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
      const nextList = submissions.filter(s => s.id !== id);
      setSubmissions(nextList);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(nextList[0] || null);
      }
    } catch (err) {
      const nextList = submissions.filter(s => s.id !== id);
      setSubmissions(nextList);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(nextList[0] || null);
      }
    }
  };

  const runManualAnalysis = async () => {
    setIsManualLoading(true);
    try {
      const res = await fetch('/api/analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualInput),
      });
      const data = await res.json();
      setManualAnalysis(data);
    } catch (err) {
      console.warn('Manual analysis fallback:', err);
    } finally {
      setIsManualLoading(false);
    }
  };

  // Metrics
  const strongYesCount = submissions.filter(s => s.overallVerdict === 'Strong Yes').length;
  const redFlagCount = submissions.filter(s => s.overallVerdict === 'Red Flag').length;
  const maybeCount = submissions.filter(s => s.overallVerdict === 'Maybe').length;
  const avgMatch = submissions.length
    ? Math.round(submissions.reduce((acc, curr) => acc + (curr.linkedinMatchScore || 90), 0) / submissions.length)
    : 0;

  const filteredSubmissions = submissions.filter(s =>
    (s.candidateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentAnalysis: CandidateAnalysisResponse | null = selectedSubmission?.fullAnalysisJson || (selectedSubmission ? {
    candidate_name: selectedSubmission.candidateName,
    gatekeeper_questions: selectedSubmission.gatekeeperQuestions || [],
    verification: selectedSubmission.verification || { linkedin_match_score: selectedSubmission.linkedinMatchScore, discrepancies: [] },
    github_analysis: selectedSubmission.githubAnalysis || { top_languages: ['TypeScript', 'Go'], best_project: 'Repository', technical_questions: ['Q1', 'Q2', 'Q3'] },
    overall_verdict: selectedSubmission.overallVerdict,
    behavioral_questions: selectedSubmission.behavioralQuestions || [],
    confrontation_script: selectedSubmission.confrontationScript || 'No discrepancies found.',
  } : null);

  return (
    <>
      <Head>
        <title>Recruiter Dashboard | HireAssist AI</title>
      </Head>

      <div className="app-container">
        <Navbar candidateCount={submissions.length} />

        {/* Pipeline Metrics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={22} color="var(--accent-primary)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>Total Applicants</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{submissions.length}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderColor: 'var(--color-success-border)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={22} color="var(--color-success)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6ee7b7', textTransform: 'uppercase', fontWeight: 700 }}>Strong Yes</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--color-success)' }}>{strongYesCount}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderColor: 'var(--color-danger-border)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XOctagon size={22} color="var(--color-danger)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#fda4af', textTransform: 'uppercase', fontWeight: 700 }}>Red Flags</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--color-danger)' }}>{redFlagCount}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', borderColor: 'var(--color-warning-border)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'var(--color-warning-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={22} color="var(--color-warning)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#fde68a', textTransform: 'uppercase', fontWeight: 700 }}>Maybe Candidates</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'var(--color-warning)' }}>{maybeCount}</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} color="#06b6d4" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#67e8f9', textTransform: 'uppercase', fontWeight: 700 }}>Avg Match Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'JetBrains Mono', color: '#38bdf8' }}>{avgMatch}%</div>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`input-tab-btn ${activeView === 'pipeline' ? 'active' : ''}`}
              onClick={() => setActiveView('pipeline')}
              style={{ padding: '8px 18px' }}
            >
              <Users size={15} />
              PostgreSQL Candidate Pipeline ({submissions.length})
            </button>
            <button
              className={`input-tab-btn ${activeView === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveView('manual')}
              style={{ padding: '8px 18px' }}
            >
              <PlusCircle size={15} />
              Custom / Manual Analysis Studio
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn-secondary" onClick={fetchSubmissions}>
              <RefreshCw size={14} />
              Refresh PostgreSQL
            </button>
            <Link href="/candidate" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <ExternalLink size={14} />
              Open Candidate Form
            </Link>
          </div>
        </div>

        {activeView === 'pipeline' ? (
          /* Pipeline Layout: Candidate Drawer on Left + Deep Evaluation on Right */
          <div className="workspace-grid">
            {/* Candidate Submissions List */}
            <div className="glass-card" style={{ height: 'fit-content', maxHeight: '850px', overflowY: 'auto' }}>
              <div className="section-header" style={{ marginBottom: '12px' }}>
                <h3 className="section-title">
                  <Database size={16} color="var(--accent-primary)" />
                  Stored Applications
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {filteredSubmissions.length} records
                </span>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '14px' }}>
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter by candidate name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 12px 8px 34px',
                    color: '#f8fafc',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              {/* Candidate Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredSubmissions.map((sub) => {
                  const isSelected = selectedSubmission?.id === sub.id;
                  const verdict = sub.overallVerdict;

                  let verdictBg = 'rgba(16, 185, 129, 0.15)';
                  let verdictColor = '#6ee7b7';
                  if (verdict === 'Red Flag') {
                    verdictBg = 'rgba(244, 63, 94, 0.15)';
                    verdictColor = '#fda4af';
                  } else if (verdict === 'Maybe') {
                    verdictBg = 'rgba(245, 158, 11, 0.15)';
                    verdictColor = '#fde68a';
                  }

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(15, 23, 42, 0.5)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc' }}>
                            {sub.candidateName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {sub.targetRole}
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: verdictBg,
                          color: verdictColor,
                          textTransform: 'uppercase'
                        }}>
                          {verdict}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontFamily: 'JetBrains Mono' }}>
                          Diff Match: <strong style={{ color: sub.linkedinMatchScore >= 85 ? '#34d399' : sub.linkedinMatchScore >= 65 ? '#fbbf24' : '#f87171' }}>
                            {sub.linkedinMatchScore}%
                          </strong>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}</span>
                          <button
                            onClick={(e) => handleDelete(sub.id, e)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                            title="Delete submission"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredSubmissions.length === 0 && (
                  <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    No candidates found. Submit a new application via the <Link href="/candidate" style={{ color: 'var(--accent-primary)' }}>Candidate Portal</Link>.
                  </div>
                )}
              </div>
            </div>

            {/* Candidate Deep Analysis Panels */}
            <div>
              {currentAnalysis ? (
                <div className="results-stack">
                  {/* Verdict Banner */}
                  <VerdictHeader analysis={currentAnalysis} />

                  {/* Step 1: Gatekeeper Questions */}
                  <GatekeeperQuiz questions={currentAnalysis.gatekeeper_questions} />

                  {/* Step 2: Diff Check */}
                  <DiffInspector verification={currentAnalysis.verification} />

                  {/* Step 3: GitHub Deep Dive */}
                  <GitHubDeepDive githubAnalysis={currentAnalysis.github_analysis} />

                  {/* Step 4: Recruiter Guide */}
                  <InterviewScriptCard
                    confrontationScript={currentAnalysis.confrontation_script}
                    behavioralQuestions={currentAnalysis.behavioral_questions}
                  />
                </div>
              ) : (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                  <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <h3>No Candidate Selected</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
                    Select a candidate from the left panel to inspect the full 4-step AI evaluation report.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Manual / Ad-hoc Analysis Workspace */
          <div className="workspace-grid">
            <div>
              <CandidateInputForm
                inputData={manualInput}
                setInputData={setManualInput}
                onAnalyze={runManualAnalysis}
                isLoading={isManualLoading}
              />
            </div>

            <div>
              {manualAnalysis && (
                <div className="results-stack">
                  <VerdictHeader analysis={manualAnalysis} />
                  <GatekeeperQuiz questions={manualAnalysis.gatekeeper_questions} />
                  <DiffInspector verification={manualAnalysis.verification} />
                  <GitHubDeepDive githubAnalysis={manualAnalysis.github_analysis} />
                  <InterviewScriptCard
                    confrontationScript={manualAnalysis.confrontation_script}
                    behavioralQuestions={manualAnalysis.behavioral_questions}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
