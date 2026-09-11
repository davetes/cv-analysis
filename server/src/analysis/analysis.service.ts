import { Injectable, Logger } from '@nestjs/common';
import { AnalysisEngine } from './analysis-engine';
import { AnalyzeCandidateDto } from './dto/analyze-candidate.dto';
import { CANDIDATE_PRESETS } from '../presets/candidate-presets';
import { CandidateAnalysisResponse, PresetCandidate } from '../types';

@Injectable()
export class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);
  private readonly engine = new AnalysisEngine();

  /**
   * Analyze candidate data against JD, CV, LinkedIn, and GitHub
   */
  public analyzeCandidate(dto: AnalyzeCandidateDto): CandidateAnalysisResponse {
    this.logger.log(`Received candidate analysis request...`);
    const result = this.engine.analyze({
      jobDescription: dto.jobDescription,
      cvText: dto.cvText,
      linkedinText: dto.linkedinText,
      githubText: dto.githubText,
    });
    this.logger.log(`Analysis complete for candidate: ${result.candidate_name} [Verdict: ${result.overall_verdict}]`);
    return result;
  }

  /**
   * Return candidate preset templates for rapid recruiter evaluation
   */
  public getPresets(): PresetCandidate[] {
    return CANDIDATE_PRESETS;
  }

  /**
   * Get single preset by ID
   */
  public getPresetById(id: string): PresetCandidate | undefined {
    return CANDIDATE_PRESETS.find(p => p.id === id);
  }
}
