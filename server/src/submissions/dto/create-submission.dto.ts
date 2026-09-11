import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  candidateName: string;

  @IsString()
  @IsOptional()
  candidateEmail?: string;

  @IsString()
  @IsOptional()
  targetRole?: string;

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
