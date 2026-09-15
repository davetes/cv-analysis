import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { DatabaseService, StoredSubmission } from '../database/database.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { AnalysisEngine } from '../analysis/analysis-engine';
import { CANDIDATE_PRESETS } from '../presets/candidate-presets';

@Injectable()
export class SubmissionsService implements OnModuleInit {
  private readonly logger = new Logger(SubmissionsService.name);
  private readonly engine = new AnalysisEngine();

  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    await this.seedDefaultsIfEmpty();
  }

  public async seedDefaultsIfEmpty(): Promise<void> {
    const existing = await this.db.getAllSubmissions();
    if (existing.length === 0) {
      this.logger.log('Seeding candidate submissions into database...');
      const jobIds = ['job-scalewave-backend', 'job-hypergrowth-frontend', 'job-neurotech-fullstack'];

      for (const [idx, preset] of CANDIDATE_PRESETS.entries()) {
        const analysis = this.engine.analyze({
          jobDescription: preset.jobDescription,
          cvText: preset.cvText,
          linkedinText: preset.linkedinText,
          githubText: preset.githubText,
        });

        const submission: StoredSubmission = {
          id: `sub-${preset.id}-${Date.now() + idx}`,
          jobId: jobIds[idx % jobIds.length],
          candidateName: preset.name,
          candidateEmail: `${preset.id}@example.com`,
          targetRole: preset.title,
          jobDescription: preset.jobDescription,
          cvText: preset.cvText,
          linkedinText: preset.linkedinText,
          githubText: preset.githubText,
          overallVerdict: analysis.overall_verdict,
          linkedinMatchScore: analysis.verification.linkedin_match_score,
          gatekeeperQuestions: analysis.gatekeeper_questions,
          candidateQuizAnswers: idx === 0 ? { 0: 'A', 1: 'B', 2: 'A' } : idx === 1 ? { 0: 'A', 1: 'C', 2: 'A' } : { 0: 'C', 1: 'A', 2: 'A' },
          verification: analysis.verification,
          githubAnalysis: analysis.github_analysis,
          behavioralQuestions: analysis.behavioral_questions,
          confrontationScript: analysis.confrontation_script,
          fullAnalysisJson: analysis,
          createdAt: new Date(Date.now() - idx * 3600000).toISOString(),
        };

        await this.db.saveSubmission(submission);
      }
      this.logger.log(`Seeded ${CANDIDATE_PRESETS.length} candidate submissions successfully.`);
    }
  }

  public async create(dto: CreateSubmissionDto): Promise<StoredSubmission> {
    this.logger.log(`Processing candidate application for: ${dto.candidateName} (Job: ${dto.jobId || 'General'})`);

    const analysis = this.engine.analyze({
      jobDescription: dto.jobDescription,
      cvText: dto.cvText,
      linkedinText: dto.linkedinText,
      githubText: dto.githubText,
    });

    const submission: StoredSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      jobId: dto.jobId || undefined,
      candidateName: dto.candidateName || analysis.candidate_name,
      candidateEmail: dto.candidateEmail || null,
      targetRole: dto.targetRole || 'Software Engineer',
      jobDescription: dto.jobDescription,
      cvText: dto.cvText,
      linkedinText: dto.linkedinText,
      githubText: dto.githubText,
      overallVerdict: analysis.overall_verdict,
      linkedinMatchScore: analysis.verification.linkedin_match_score,
      gatekeeperQuestions: analysis.gatekeeper_questions,
      candidateQuizAnswers: dto.candidateQuizAnswers || null,
      verification: analysis.verification,
      githubAnalysis: analysis.github_analysis,
      behavioralQuestions: analysis.behavioral_questions,
      confrontationScript: analysis.confrontation_script,
      fullAnalysisJson: analysis,
      createdAt: new Date().toISOString(),
    };

    const saved = await this.db.saveSubmission(submission);
    this.logger.log(`Application recorded with ID: ${saved.id} [Verdict: ${saved.overallVerdict}]`);
    return saved;
  }

  public async findAll(jobId?: string): Promise<StoredSubmission[]> {
    return this.db.getAllSubmissions(jobId);
  }

  public async findOne(id: string): Promise<StoredSubmission> {
    const sub = await this.db.getSubmissionById(id);
    if (!sub) {
      throw new NotFoundException(`Candidate submission with ID ${id} not found.`);
    }
    return sub;
  }

  public async remove(id: string): Promise<{ success: boolean; id: string }> {
    await this.db.deleteSubmission(id);
    return { success: true, id };
  }
}
