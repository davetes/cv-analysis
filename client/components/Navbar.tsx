import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bot, UserCheck, Briefcase, Database, Sparkles } from 'lucide-react';

interface NavbarProps {
  candidateCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ candidateCount }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  const isRecruiter = currentPath === '/' || currentPath === '/recruiter';
  const isCandidate = currentPath === '/candidate';

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <Link href="/recruiter" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div className="brand-icon">
            <Bot size={26} color="#ffffff" />
          </div>
          <div>
            <div className="brand-title">
              HireAssist AI
              <span className="brand-badge">PostgreSQL + NestJS</span>
            </div>
            <div className="brand-subtitle">
              Expert Technical Recruiting Platform & Candidate Intelligence Engine
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <nav style={{ display: 'flex', gap: '6px', background: 'rgba(11, 17, 32, 0.8)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <Link
            href="/recruiter"
            className={`input-tab-btn ${isRecruiter ? 'active' : ''}`}
            style={{ padding: '8px 16px', textDecoration: 'none' }}
          >
            <Briefcase size={15} />
            Recruiter Hub
            {candidateCount !== undefined && candidateCount > 0 && (
              <span style={{
                background: isRecruiter ? 'rgba(255, 255, 255, 0.25)' : 'rgba(99, 102, 241, 0.3)',
                padding: '1px 7px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                {candidateCount}
              </span>
            )}
          </Link>

          <Link
            href="/candidate"
            className={`input-tab-btn ${isCandidate ? 'active' : ''}`}
            style={{ padding: '8px 16px', textDecoration: 'none' }}
          >
            <UserCheck size={15} />
            Candidate Portal
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, color: '#a7f3d0' }}>
          <Database size={13} color="#10b981" />
          <span>PostgreSQL Active</span>
        </div>
      </div>
    </header>
  );
};
