import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export interface StoredSubmission {
  id: string;
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
  private memorySubmissions: Map<string, StoredSubmission> = new Map();
  private readonly storageFilePath = path.resolve(process.cwd(), 'submissions_data.json');

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
      this.logger.log(`🚀 Successfully connected to PostgreSQL database at ${host}:${port}/${database}`);

      // Create table if not exists
      await client.query(`
        CREATE TABLE IF NOT EXISTS candidate_submissions (
          id VARCHAR(64) PRIMARY KEY,
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
      this.logger.warn(`⚠️ PostgreSQL connection not established: ${err.message}. Using persistent JSON store. Configure credentials in server/.env to sync with Postgres.`);
    }
  }

  public async saveSubmission(sub: StoredSubmission): Promise<StoredSubmission> {
    this.memorySubmissions.set(sub.id, sub);
    this.saveToLocalFile();

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(
          `INSERT INTO candidate_submissions (
            id, candidate_name, candidate_email, target_role,
            job_description, cv_text, linkedin_text, github_text,
            overall_verdict, linkedin_match_score, gatekeeper_questions,
            verification, github_analysis, behavioral_questions,
            confrontation_script, full_analysis_json, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (id) DO UPDATE SET
            candidate_name = EXCLUDED.candidate_name,
            overall_verdict = EXCLUDED.overall_verdict,
            linkedin_match_score = EXCLUDED.linkedin_match_score,
            full_analysis_json = EXCLUDED.full_analysis_json;`,
          [
            sub.id,
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
            JSON.stringify(sub.verification),
            JSON.stringify(sub.githubAnalysis),
            JSON.stringify(sub.behavioralQuestions),
            sub.confrontationScript,
            JSON.stringify(sub.fullAnalysisJson),
            new Date(sub.createdAt),
          ],
        );
        this.logger.log(`Saved submission ${sub.id} directly into PostgreSQL table.`);
      } catch (err) {
        this.logger.warn(`Failed to insert into PostgreSQL, cached locally: ${err}`);
      }
    }

    return sub;
  }

  public async getAllSubmissions(): Promise<StoredSubmission[]> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query(
          `SELECT * FROM candidate_submissions ORDER BY created_at DESC;`,
        );
        if (res.rows.length > 0) {
          return res.rows.map(r => ({
            id: r.id,
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
            verification: r.verification,
            githubAnalysis: r.github_analysis,
            behavioralQuestions: r.behavioral_questions,
            confrontationScript: r.confrontation_script,
            fullAnalysisJson: r.full_analysis_json,
            createdAt: r.created_at,
          }));
        }
      } catch (err) {
        this.logger.warn(`Postgres query failed, returning local store: ${err}`);
      }
    }

    return Array.from(this.memorySubmissions.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  public async getSubmissionById(id: string): Promise<StoredSubmission | null> {
    if (this.isPgConnected && this.pool) {
      try {
        const res = await this.pool.query(
          `SELECT * FROM candidate_submissions WHERE id = $1;`,
          [id],
        );
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
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
            verification: r.verification,
            githubAnalysis: r.github_analysis,
            behavioralQuestions: r.behavioral_questions,
            confrontationScript: r.confrontation_script,
            fullAnalysisJson: r.full_analysis_json,
            createdAt: r.created_at,
          };
        }
      } catch (err) {
        this.logger.warn(`Postgres query by id failed: ${err}`);
      }
    }

    return this.memorySubmissions.get(id) || null;
  }

  public async deleteSubmission(id: string): Promise<boolean> {
    this.memorySubmissions.delete(id);
    this.saveToLocalFile();

    if (this.isPgConnected && this.pool) {
      try {
        await this.pool.query(`DELETE FROM candidate_submissions WHERE id = $1;`, [id]);
      } catch (err) {
        this.logger.warn(`Postgres delete failed: ${err}`);
      }
    }

    return true;
  }

  private loadFromLocalFile() {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const data = fs.readFileSync(this.storageFilePath, 'utf-8');
        const list: StoredSubmission[] = JSON.parse(data);
        for (const item of list) {
          this.memorySubmissions.set(item.id, item);
        }
        this.logger.log(`Loaded ${list.length} cached submissions from local file.`);
      }
    } catch (e) {
      // Ignore
    }
  }

  private saveToLocalFile() {
    try {
      const list = Array.from(this.memorySubmissions.values());
      fs.writeFileSync(this.storageFilePath, JSON.stringify(list, null, 2), 'utf-8');
    } catch (e) {
      // Ignore
    }
  }
}
