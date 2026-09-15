export interface GatekeeperQuestion {
    question: string;
    options: {
        A: string;
        B: string;
        C: string;
        D: string;
    };
    correct_answer: 'A' | 'B' | 'C' | 'D';
}
export interface VerificationResult {
    linkedin_match_score: number;
    discrepancies: string[];
}
export interface GitHubAnalysisResult {
    top_languages: string[];
    best_project: string;
    technical_questions: [string, string, string] | string[];
}
export type OverallVerdict = 'Strong Yes' | 'Maybe' | 'Red Flag';
export interface CandidateAnalysisResponse {
    candidate_name: string;
    gatekeeper_questions: GatekeeperQuestion[];
    verification: VerificationResult;
    github_analysis: GitHubAnalysisResult;
    overall_verdict: OverallVerdict;
    behavioral_questions: string[];
    confrontation_script: string;
}
export interface AnalyzeCandidateRequest {
    jobDescription: string;
    cvText: string;
    linkedinText: string;
    githubText: string;
}
export interface PresetCandidate {
    id: string;
    name: string;
    title: string;
    verdictHint: OverallVerdict;
    description: string;
    jobDescription: string;
    cvText: string;
    linkedinText: string;
    githubText: string;
}
