import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Building, MapPin, ArrowRight, Briefcase } from 'lucide-react';
import { CANDIDATE_PRESETS } from '../../data/presets';

export default function ApplyIndexPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => setJobs(data))
      .catch(() => {
        setJobs([
          {
            id: 'job-scalewave-backend',
            title: 'Staff Backend Engineer - Core Infrastructure',
            company: 'ScaleWave Systems',
            location: 'San Francisco, CA (Hybrid)',
          },
          {
            id: 'job-hypergrowth-frontend',
            title: 'Lead Frontend Architect - Design Systems & Web Apps',
            company: 'HyperGrowth Enterprise',
            location: 'New York, NY (Hybrid)',
          },
          {
            id: 'job-neurotech-fullstack',
            title: 'Senior Full-Stack Engineer (Next.js & NestJS)',
            company: 'NeuroTech Systems',
            location: 'Remote (US/Canada)',
          },
        ]);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Active Open Positions | Candidate Portal</title>
      </Head>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.15)', padding: '6px 14px', borderRadius: '999px', color: '#c7d2fe', fontSize: '0.8rem', fontWeight: 700, marginBottom: '10px' }}>
            <Briefcase size={14} />
            Candidate Application Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Explore Open Positions & Apply</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
            Select an open role below to open the application form.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {jobs.map((job) => (
            <div key={job.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={14} />
                  {job.company}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px' }}>{job.title}</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={12} />
                  {job.location}
                </div>
              </div>

              <Link href={`/apply/${job.id}`} className="btn-primary" style={{ textDecoration: 'none', maxWidth: '160px', padding: '10px 16px', fontSize: '0.85rem' }}>
                Apply Now
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
