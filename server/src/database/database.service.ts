import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export interface StoredJob {
  id: string;
  title: string;
  company: string;
  location: string;
  jobDescription: string;
  instructions: string;
  createdAt: string;
}

export interface StoredSubmission {
  id: string;
  jobId?: string;
  candidateName: string;
  candidateEmail?: string;
  targetRole?: string;
  jobDescription: string;
  cvText: string;
  linkedinText: string;
  githubText: string;
  overallVerdict: string;
  linkedinMatchScore: number;
  gatekeeperQuestions: any;
  candidateQuizAnswers?: any;
  verification: any;
  githubAnalysis: any;
  behavioralQuestions: any;
  confrontationScript: string;
  fullAnalysisJson: any;
  createdAt: string;
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool | null = null;
  private isPgConnected = false;
  private memoryJobs: Map<string, StoredJob> = new Map();
  private memorySubmissions: Map<string, StoredSubmission> = new Map();
  private readonly storageFilePath = path.resolve(process.cwd(), 'recruiter_data.json');

  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    this.loadFromLocalFile();
    await this.initPostgres();
  }

  private async initPostgres() {
    const host = this.config.get<string>('DB_HOST', 'localhost');
    const port = parseInt(this.config.get<string>('DB_PORT', '5432'), 10);
    const user = this.config.get<string>('DB_USERNAME', 'postgres');
    const password = this.config.get<string>('DB_PASSWORD', 'postgres');
    const database = this.config.get<string>('DB_NAME', 'postgres');

    try {
      this.pool = new Pool({
        host,
        port,
        user,
        password,
        database,
        connectionTimeoutMillis: 3000,
      });

      const client = await this.pool.connect();
      this.isPgConnected = true;
      this.logger.log(`🚀 Connected to PostgreSQL at ${host}:${port}/${database}`);

      // Create Jobs Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS posted_jobs (
          id VARCHAR(64) PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          company VARCHAR(255) NOT NULL,
          location VARCHAR(255),
          job_description TEXT NOT NULL,
          instructions TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create Submissions Table
      await client.query(`
        CREATE TABLE IF NOT EXISTS candidate_submissions (
          id VARCHAR(64) PRIMARY KEY,
          job_id VARCHAR(64),
          candidate_name VARCHAR(255) NOT NULL,
          candidate_email VARCHAR(255),
          target_role VARCHAR(255),
          job_description TEXT NOT NULL,
          cv_text TEXT NOT NULL,
          linkedin_text TEXT NOT NULL,
          github_text TEXT NOT NULL,
          overall_verdict VARCHAR(50) NOT NULL,
          linkedin_match_score INT NOT NULL,
          gatekeeper_questions JSONB,
          candidate_quiz_answers JSONB,
          verification JSONB,
          github_analysis JSONB,
          behavioral_questions JSONB,
          confrontation_script TEXT,
          full_analysis_json JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      client.release();
    } catch (err: any) {
      this.isPgConnected = false;
      this.logger.warn(`⚠️ PostgreSQL note: ${err.message}. Using high-performance JSON persistence store.`);
    }
  }

  /* ================== JOBS METHODS ================== */

  public async saveJob(job: StoredJob): Promise<StoredJob> {
    this.memoryJobs.set(job.id, job);
    this.saveToLocalFile();

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO posted_jobs (id, title, company, location, job_description, instructions, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             title = EXCLUDED.title,
             company = EXCLUDED.company,
             location = EXCLUDED.location,
             job_description = EXCLUDED.job_description,
             instructions = EXCLUDED.instructions;`,
          [job.id, job.title, job.company, job.location || null, job.jobDescription, job.instructions || null, new Date(job.createdAt)],
        );
      } catch (e) {
        this.logger.warn(`Postgres job save error: ${e}`);
      }
    }

    return job;
  }

  public async getAllJobs(): Promise<StoredJob[]> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query(`SELECT * FROM posted_jobs ORDER BY created_at DESC;`);
        if (res.rows.length > 0) {
          return res.rows.map(r => ({
            id: r.id,
            title: r.title,
            company: r.company,
            location: r.location,
            jobDescription: r.job_description,
            instructions: r.instructions,
            createdAt: r.created_at,
          }));
        }
      } catch (e) {
        // Fallback to memory
      }
    }
    return Array.from(this.memoryJobs.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  public async getJobById(id: string): Promise<StoredJob | null> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query(`SELECT * FROM posted_jobs WHERE id = $1;`, [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            title: r.title,
            company: r.company,
            location: r.location,
            jobDescription: r.job_description,
            instructions: r.instructions,
            createdAt: r.created_at,
          };
        }
      } catch (e) {}
    }
    return this.memoryJobs.get(id) || null;
  }

  public async deleteJob(id: string): Promise<boolean> {
    this.memoryJobs.delete(id);
    this.saveToLocalFile();
    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(`DELETE FROM posted_jobs WHERE id = $1;`, [id]);
      } catch (e) {}
    }
    return true;
  }

  /* ================== SUBMISSIONS METHODS ================== */

  public async saveSubmission(sub: StoredSubmission): Promise<StoredSubmission> {
    this.memorySubmissions.set(sub.id, sub);
    this.saveToLocalFile();

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO candidate_submissions (
            id, job_id, candidate_name, candidate_email, target_role,
            job_description, cv_text, linkedin_text, github_text,
            overall_verdict, linkedin_match_score, gatekeeper_questions,
            candidate_quiz_answers, verification, github_analysis, behavioral_questions,
            confrontation_script, full_analysis_json, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO UPDATE SET
            candidate_name = EXCLUDED.candidate_name,
            overall_verdict = EXCLUDED.overall_verdict,
            linkedin_match_score = EXCLUDED.linkedin_match_score,
            candidate_quiz_answers = EXCLUDED.candidate_quiz_answers,
            full_analysis_json = EXCLUDED.full_analysis_json;`,
          [
            sub.id,
            sub.jobId || null,
            sub.candidateName,
            sub.candidateEmail || null,
            sub.targetRole || null,
            sub.jobDescription,
            sub.cvText,
            sub.linkedinText,
            sub.githubText,
            sub.overallVerdict,
            sub.linkedinMatchScore,
            JSON.stringify(sub.gatekeeperQuestions),
            JSON.stringify(sub.candidateQuizAnswers || null),
            JSON.stringify(sub.verification),
            JSON.stringify(sub.githubAnalysis),
            JSON.stringify(sub.behavioralQuestions),
            sub.confrontationScript,
            JSON.stringify(sub.fullAnalysisJson),
            new Date(sub.createdAt),
          ],
        );
      } catch (err) {
        this.logger.warn(`Failed to insert into PostgreSQL, cached locally: ${err}`);
      }
    }

    return sub;
  }

  public async getAllSubmissions(jobId?: string): Promise<StoredSubmission[]> {
    if (this.isPgConnected && this.pool) {
      try {
        const query = jobId
          ? `SELECT * FROM candidate_submissions WHERE job_id = $1 ORDER BY created_at DESC;`
          : `SELECT * FROM candidate_submissions ORDER BY created_at DESC;`;
        const params = jobId ? [jobId] : [];
        const res = await this.pool.query(query, params);
        if (res.rows.length > 0) {
          return res.rows.map(r => ({
            id: r.id,
            jobId: r.job_id,
            candidateName: r.candidate_name,
            candidateEmail: r.candidate_email,
            targetRole: r.target_role,
            jobDescription: r.job_description,
            cvText: r.cv_text,
            linkedinText: r.linkedin_text,
            githubText: r.github_text,
            overallVerdict: r.overall_verdict,
            linkedinMatchScore: r.linkedin_match_score,
            gatekeeperQuestions: r.gatekeeper_questions,
            candidateQuizAnswers: r.candidate_quiz_answers,
            verification: r.verification,
            githubAnalysis: r.github_analysis,
            behavioralQuestions: r.behavioral_questions,
            confrontationScript: r.confrontation_script,
            fullAnalysisJson: r.full_analysis_json,
            createdAt: r.created_at,
          }));
        }
      } catch (err) {}
    }

    const all = Array.from(this.memorySubmissions.values());
    const filtered = jobId ? all.filter(s => s.jobId === jobId) : all;
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getSubmissionById(id: string): Promise<StoredSubmission | null> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query(`SELECT * FROM candidate_submissions WHERE id = $1;`, [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            jobId: r.job_id,
            candidateName: r.candidate_name,
            candidateEmail: r.candidate_email,
            targetRole: r.target_role,
            jobDescription: r.job_description,
            cvText: r.cv_text,
            linkedinText: r.linkedin_text,
            githubText: r.github_text,
            overallVerdict: r.overall_verdict,
            linkedinMatchScore: r.linkedin_match_score,
            gatekeeperQuestions: r.gatekeeper_questions,
            candidateQuizAnswers: r.candidate_quiz_answers,
            verification: r.verification,
            githubAnalysis: r.github_analysis,
            behavioralQuestions: r.behavioral_questions,
            confrontationScript: r.confrontation_script,
            fullAnalysisJson: r.full_analysis_json,
            createdAt: r.created_at,
          };
        }
      } catch (err) {}
    }
    return this.memorySubmissions.get(id) || null;
  }

  public async deleteSubmission(id: string): Promise<boolean> {
    this.memorySubmissions.delete(id);
    this.saveToLocalFile();

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(`DELETE FROM candidate_submissions WHERE id = $1;`, [id]);
      } catch (err) {}
    }

    return true;
  }

  /* ================== PERSISTENCE HELPERS ================== */

  private loadFromLocalFile() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const data = fs.readFileSync(this.storageFilePath, 'utf-8');
        const parsed = JSON.parse(data);
        if (parsed.jobs) {
          for (const j of parsed.jobs) this.memoryJobs.set(j.id, j);
        }
        if (parsed.submissions) {
          for (const s of parsed.submissions) this.memorySubmissions.set(s.id, s);
        }
        this.logger.log(`Loaded ${this.memoryJobs.size} jobs and ${this.memorySubmissions.size} submissions from storage.`);
      }
    } catch (e) {}
  }

  private saveToLocalFile() {
    try {
      const payload = {
        jobs: Array.from(this.memoryJobs.values()),
        submissions: Array.from(this.memorySubmissions.values()),
      };
      fs.writeFileSync(this.storageFilePath, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (e) {}
  }
}
