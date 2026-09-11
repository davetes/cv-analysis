import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  GatekeeperQuestion,
  VerificationResult,
  GitHubAnalysisResult,
  OverallVerdict,
  CandidateAnalysisResponse,
} from '../../types';

@Entity('candidate_submissions')
export class CandidateSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'candidate_name', type: 'varchar', length: 255 })
  candidateName: string;

  @Column({ name: 'candidate_email', type: 'varchar', length: 255, nullable: true })
  candidateEmail: string;

  @Column({ name: 'target_role', type: 'varchar', length: 255, nullable: true })
  targetRole: string;

  @Column({ name: 'job_description', type: 'text' })
  jobDescription: string;

  @Column({ name: 'cv_text', type: 'text' })
  cvText: string;

  @Column({ name: 'linkedin_text', type: 'text' })
  linkedinText: string;

  @Column({ name: 'github_text', type: 'text' })
  githubText: string;

  @Column({ name: 'overall_verdict', type: 'varchar', length: 50 })
  overallVerdict: OverallVerdict;

  @Column({ name: 'linkedin_match_score', type: 'int', default: 100 })
  linkedinMatchScore: number;

  @Column({ name: 'gatekeeper_questions', type: 'jsonb', nullable: true })
  gatekeeperQuestions: GatekeeperQuestion[];

  @Column({ name: 'verification', type: 'jsonb', nullable: true })
  verification: VerificationResult;

  @Column({ name: 'github_analysis', type: 'jsonb', nullable: true })
  githubAnalysis: GitHubAnalysisResult;

  @Column({ name: 'behavioral_questions', type: 'jsonb', nullable: true })
  behavioralQuestions: string[];

  @Column({ name: 'confrontation_script', type: 'text', nullable: true })
  confrontationScript: string;

  @Column({ name: 'full_analysis_json', type: 'jsonb', nullable: true })
  fullAnalysisJson: CandidateAnalysisResponse;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
