import { IsNotEmpty, IsString } from 'class-validator';

export class AnalyzeCandidateDto {
  @IsString()
  @IsNotEmpty()
  jobDescription: string;

  @IsString()
  @IsNotEmpty()
  cvText: string;

  @IsString()
  @IsNotEmpty()
  linkedinText: string;

  @IsString()
  @IsNotEmpty()
  githubText: string;
}
