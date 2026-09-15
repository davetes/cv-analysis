import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Briefcase,
  PlusCircle,
  Copy,
  Check,
  ExternalLink,
  Users,
  Building,
  MapPin,
  Sparkles,
  Search,
  CheckCircle2,
  XOctagon,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Database,
  ArrowRight,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { VerdictHeader } from '../components/VerdictHeader';
import { GatekeeperQuiz } from '../components/GatekeeperQuiz';
import { DiffInspector } from '../components/DiffInspector';
import { GitHubDeepDive } from '../components/GitHubDeepDive';
import { InterviewScriptCard } from '../components/InterviewScriptCard';
import { JsonOutputViewer } from '../components/JsonOutputViewer';
import { CANDIDATE_PRESETS } from '../data/presets';
import { CandidateAnalysisResponse } from '../types';

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Post Job Modal State
  const [showPostJobModal, setShowPostJobModal] = useState<boolean>(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobCompany, setNewJobCompany] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('Remote (US/Canada)');
  const [newJobDescription, setNewJobDescription] = useState(CANDIDATE_PRESETS[0].jobDescription);
  const [newJobInstructions, setNewJobInstructions] = useState('Please complete all application sections. An automated pre-screen test will be administered upon submission.');
  const [isPostingJob, setIsPostingJob] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [jobsRes, subsRes] = await Promise.all([
        fetch('/api/jobs').catch(() => null),
        fetch('/api/submissions').catch(() => null),
      ]);

      if (jobsRes && jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      } else {
        // Fallback default jobs
        setJobs([
          { id: 'job-scalewave-backend', title: 'Staff Backend Engineer - Core Infrastructure', company: 'ScaleWave Systems', location: 'San Francisco, CA (Hybrid)', applicantCount: 1 },
          { id: 'job-hypergrowth-frontend', title: 'Lead Frontend Architect - Design Systems & Web Apps', company: 'HyperGrowth Enterprise', location: 'New York, NY (Hybrid)', applicantCount: 1 },
          { id: 'job-neurotech-fullstack', title: 'Senior Full-Stack Engineer (Next.js & NestJS)', company: 'NeuroTech Systems', location: 'Remote (US/Canada)', applicantCount: 1 },
        ]);
      }

      if (subsRes && subsRes.ok) {
        const subsData = await subsRes.json();
        setSubmissions(subsData);
        if (subsData.length > 0 && !selectedSubmission) {
          setSelectedSubmission(subsData[0]);
        }
      } else {
        loadFallbackSubmissions();
      }
    } catch (err) {
      loadFallbackSubmissions();
    } finally {
      setIsLoading(false);
    }
  };

  const loadFallbackSubmissions = () => {
    const fallbackList = CANDIDATE_PRESETS.map((p, idx) => ({
      id: `sub-${p.id}`,
      jobId: idx === 0 ? 'job-scalewave-backend' : idx === 1 ? 'job-hypergrowth-frontend' : 'job-neurotech-fullstack',
      candidateName: p.name,
      candidateEmail: `${p.id}@example.com`,
      targetRole: p.title,
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
  };

  const copyShareableLink = (jobId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const link = `${origin}/apply/${jobId}`;
    navigator.clipboard.writeText(link);
    setCopiedJobId(jobId);
    setTimeout(() => setCopiedJobId(null), 2500);
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostingJob(true);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newJobTitle,
          company: newJobCompany,
          location: newJobLocation,
          jobDescription: newJobDescription,
          instructions: newJobInstructions,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setJobs([created, ...jobs]);
        setShowPostJobModal(false);
        setNewJobTitle('');
        setNewJobCompany('');
      }
    } catch (e) {
      const fake = {
        id: `job-${Date.now()}`,
        title: newJobTitle,
        company: newJobCompany,
        location: newJobLocation,
        jobDescription: newJobDescription,
        instructions: newJobInstructions,
        applicantCount: 0,
      };
      setJobs([fake, ...jobs]);
      setShowPostJobModal(false);
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleDeleteSubmission = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
    } catch (e) {}
    const next = submissions.filter(s => s.id !== id);
    setSubmissions(next);
    if (selectedSubmission?.id === id) {
      setSelectedSubmission(next[0] || null);
    }
  };

  // Filter submissions
  const filteredSubmissions = submissions.filter(s => {
    const matchesJob = selectedJobId === 'all' || s.jobId === selectedJobId;
    const matchesSearch = (s.candidateName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.targetRole || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesJob && matchesSearch;
  });

  const currentAnalysis: CandidateAnalysisResponse | null = selectedSubmission?.fullAnalysisJson || null;

  return (
    <>
      <Head>
        <title>Employer & Recruiter Dashboard | HireAssist AI</title>
      </Head>

      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <div className="brand-wrapper">
            <div className="brand-icon">
              <Briefcase size={24} color="#ffffff" />
            </div>
            <div>
              <div className="brand-title">
                HireAssist AI
                <span className="brand-badge">Employer Hub</span>
              </div>
              <div className="brand-subtitle">
                Post Jobs, Share Google Form-Style Links & Review Candidate Pre-Screens
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-primary" onClick={() => setShowPostJobModal(true)} style={{ padding: '9px 18px', fontSize: '0.84rem' }}>
              <PlusCircle size={15} />
              Post a New Job
            </button>
            <Link href="/apply" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.84rem' }}>
              <ExternalLink size={14} />
              Candidate Portal
            </Link>
          </div>
        </header>

        {/* Section 1: Active Posted Jobs Strip with Shareable Links */}
        <div className="glass-card" style={{ marginBottom: '24px' }}>
          <div className="section-header" style={{ marginBottom: '14px' }}>
            <h2 className="section-title">
              <Building size={18} color="var(--accent-primary)" />
              Active Job Postings & Shareable Application Links
            </h2>
            <button className="btn-secondary" onClick={fetchInitialData} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
              <RefreshCw size={12} />
              Refresh
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            {jobs.map((job) => {
              const isSelected = selectedJobId === job.id;
              const isCopied = copiedJobId === job.id;

              return (
                <div
                  key={job.id}
                  style={{
                    background: isSelected ? '#eef2ff' : '#ffffff',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase' }}>
                        {job.company}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                        {job.applicantCount ?? 1} Applicants
                      </span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', marginTop: '4px' }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <MapPin size={13} />
                      {job.location}
                    </div>
                  </div>

                  {/* Actions Strip */}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                    <button
                      className="btn-secondary"
                      onClick={() => copyShareableLink(job.id)}
                      style={{ flex: 1, fontSize: '0.76rem', padding: '6px 10px', justifyContent: 'center' }}
                      title="Copy shareable Google Form-style application link"
                    >
                      {isCopied ? <Check size={13} color="var(--color-success)" /> : <Copy size={13} />}
                      {isCopied ? 'Link Copied!' : 'Copy Form Link'}
                    </button>

                    <Link
                      href={`/apply/${job.id}`}
                      target="_blank"
                      className="btn-secondary"
                      style={{ fontSize: '0.76rem', padding: '6px 10px', textDecoration: 'none' }}
                      title="Open Candidate Application Form in new tab"
                    >
                      <ExternalLink size={13} />
                    </Link>

                    <button
                      className="btn-secondary"
                      onClick={() => setSelectedJobId(selectedJobId === job.id ? 'all' : job.id)}
                      style={{
                        fontSize: '0.76rem',
                        padding: '6px 12px',
                        background: isSelected ? 'var(--accent-primary)' : '#ffffff',
                        color: isSelected ? '#ffffff' : '#0f172a'
                      }}
                    >
                      {isSelected ? 'Viewing' : 'Filter'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Applicant Pipeline & Deep AI Inspector */}
        <div className="workspace-grid">
          {/* Left Column: Candidates List */}
          <div className="glass-card" style={{ height: 'fit-content', maxHeight: '880px', overflowY: 'auto' }}>
            <div className="section-header" style={{ marginBottom: '12px' }}>
              <h3 className="section-title">
                <Users size={16} color="var(--accent-primary)" />
                Applicant Pipeline ({filteredSubmissions.length})
              </h3>
              {selectedJobId !== 'all' && (
                <button className="btn-secondary" onClick={() => setSelectedJobId('all')} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                  Show All
                </button>
              )}
            </div>

            {/* Search Filter */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
              <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search candidates by name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '8px 12px 8px 34px',
                  color: '#0f172a',
                  fontSize: '0.84rem'
                }}
              />
            </div>

            {/* Candidate Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredSubmissions.map((sub) => {
                const isSelected = selectedSubmission?.id === sub.id;
                const verdict = sub.overallVerdict;

                let verdictBg = '#ecfdf5';
                let verdictColor = '#065f46';
                let verdictBorder = '#a7f3d0';

                if (verdict === 'Red Flag') {
                  verdictBg = '#fff1f2';
                  verdictColor = '#9f1239';
                  verdictBorder = '#fecdd3';
                } else if (verdict === 'Maybe') {
                  verdictBg = '#fffbeb';
                  verdictColor = '#92400e';
                  verdictBorder = '#fde68a';
                }

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: isSelected ? '#eef2ff' : '#ffffff',
                      border: isSelected ? '1px solid var(--accent-primary)' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 0 12px rgba(79, 70, 229, 0.15)' : 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#0f172a' }}>
                          {sub.candidateName}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {sub.targetRole}
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: verdictBg,
                        color: verdictColor,
                        border: `1px solid ${verdictBorder}`,
                        textTransform: 'uppercase'
                      }}>
                        {verdict}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <span>
                        Diff Match: <strong style={{ color: sub.linkedinMatchScore >= 85 ? '#059669' : sub.linkedinMatchScore >= 65 ? '#d97706' : '#e11d48' }}>
                          {sub.linkedinMatchScore}%
                        </strong>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}</span>
                        <button
                          onClick={(e) => handleDeleteSubmission(sub.id, e)}
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
                <div style={{ padding: '30px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No candidates found. Share the application link with candidates to receive submissions.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Complete HireAssist AI 4-Step Report */}
          <div>
            {currentAnalysis ? (
              <div className="results-stack">
                <VerdictHeader analysis={currentAnalysis} />
                <GatekeeperQuiz questions={currentAnalysis.gatekeeper_questions} />
                <DiffInspector verification={currentAnalysis.verification} />
                <GitHubDeepDive githubAnalysis={currentAnalysis.github_analysis} />
                <InterviewScriptCard
                  confrontationScript={currentAnalysis.confrontation_script}
                  behavioralQuestions={currentAnalysis.behavioral_questions}
                />
                <JsonOutputViewer analysis={currentAnalysis} />
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <Users size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                <h3>No Candidate Selected</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '6px' }}>
                  Select an applicant from the left list to review their full 4-step AI evaluation report.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Post a New Job */}
        {showPostJobModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '20px'
          }}>
            <div className="glass-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
              <div className="section-header" style={{ marginBottom: '16px' }}>
                <h2 className="section-title">
                  <Building size={18} color="var(--accent-primary)" />
                  Post a New Job & Generate Application Link
                </h2>
                <button
                  type="button"
                  onClick={() => setShowPostJobModal(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Job Title *
                  </label>
                  <input
                    type="text"
                    className="custom-textarea"
                    style={{ height: '42px', padding: '10px 14px' }}
                    placeholder="e.g. Senior Cloud Architect"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      className="custom-textarea"
                      style={{ height: '42px', padding: '10px 14px' }}
                      placeholder="e.g. ScaleWave Systems"
                      value={newJobCompany}
                      onChange={(e) => setNewJobCompany(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Location / Policy
                    </label>
                    <input
                      type="text"
                      className="custom-textarea"
                      style={{ height: '42px', padding: '10px 14px' }}
                      placeholder="e.g. San Francisco, CA (Hybrid)"
                      value={newJobLocation}
                      onChange={(e) => setNewJobLocation(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Job Description & Requirements *
                  </label>
                  <textarea
                    className="custom-textarea"
                    style={{ height: '140px' }}
                    placeholder="Enter detailed role requirements, technologies, years of experience, and scale..."
                    value={newJobDescription}
                    onChange={(e) => setNewJobDescription(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Instructions for Developers
                  </label>
                  <input
                    type="text"
                    className="custom-textarea"
                    style={{ height: '42px', padding: '10px 14px' }}
                    value={newJobInstructions}
                    onChange={(e) => setNewJobInstructions(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowPostJobModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" style={{ maxWidth: '200px' }} disabled={isPostingJob || !newJobTitle || !newJobCompany}>
                    {isPostingJob ? 'Publishing...' : 'Publish Job'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
