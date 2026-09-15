import { Injectable, Logger, OnModuleInit, NotFoundException } from '@nestjs/common';
import { DatabaseService, StoredJob } from '../database/database.service';
import { CreateJobDto } from './dto/create-job.dto';
import { CANDIDATE_PRESETS } from '../presets/candidate-presets';

@Injectable()
export class JobsService implements OnModuleInit {
  private readonly logger = new Logger(JobsService.name);

  constructor(private readonly db: DatabaseService) {}

  async onModuleInit() {
    await this.seedDefaultJobs();
  }

  public async seedDefaultJobs(): Promise<void> {
    const existing = await this.db.getAllJobs();
    if (existing.length === 0) {
      this.logger.log('Seeding initial jobs into database...');
      const defaultJobs = [
        {
          id: 'job-scalewave-backend',
          title: 'Staff Backend Engineer - Core Infrastructure',
          company: 'ScaleWave Systems',
          location: 'San Francisco, CA (Hybrid)',
          jobDescription: CANDIDATE_PRESETS[0].jobDescription,
          instructions: 'Please paste your comprehensive resume, LinkedIn profile, and active GitHub repos. An automated 3-question pre-screen test will be administered upon submission.',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'job-hypergrowth-frontend',
          title: 'Lead Frontend Architect - Design Systems & Web Apps',
          company: 'HyperGrowth Enterprise',
          location: 'New York, NY (Hybrid)',
          jobDescription: CANDIDATE_PRESETS[1].jobDescription,
          instructions: 'We are looking for proven frontend leaders. Please submit your CV, public LinkedIn profile, and GitHub code repositories.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'job-neurotech-fullstack',
          title: 'Senior Full-Stack Engineer (Next.js & NestJS)',
          company: 'NeuroTech Systems',
          location: 'Remote (US/Canada)',
          jobDescription: CANDIDATE_PRESETS[2].jobDescription,
          instructions: 'Submit your resume and GitHub links. We verify technology alignment and run code deep-dive assessments.',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
        },
      ];

      for (const j of defaultJobs) {
        await this.db.saveJob(j);
      }
      this.logger.log(`Successfully seeded ${defaultJobs.length} default jobs.`);
    }
  }

  public async create(dto: CreateJobDto): Promise<StoredJob> {
    const slug = dto.company.toLowerCase().replace(/[^a-z0-9]/g, '') + '-' + dto.title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    const id = `job-${slug}-${Date.now().toString().slice(-4)}`;

    const job: StoredJob = {
      id,
      title: dto.title,
      company: dto.company,
      location: dto.location || 'Remote',
      jobDescription: dto.jobDescription,
      instructions: dto.instructions || 'Please complete all fields and submit your profile for automated pre-screening.',
      createdAt: new Date().toISOString(),
    };

    const saved = await this.db.saveJob(job);
    this.logger.log(`Created new job posting: ${saved.title} at ${saved.company} (ID: ${saved.id})`);
    return saved;
  }

  public async findAll(): Promise<any[]> {
    const jobs = await this.db.getAllJobs();
    const submissions = await this.db.getAllSubmissions();

    // Map applicant count to each job
    return jobs.map(j => {
      const applicants = submissions.filter(s => s.jobId === j.id || (!s.jobId && s.targetRole?.toLowerCase().includes(j.title.toLowerCase().slice(0, 10))));
      return {
        ...j,
        applicantCount: applicants.length,
      };
    });
  }

  public async findOne(id: string): Promise<any> {
    const job = await this.db.getJobById(id);
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found.`);
    }
    const submissions = await this.db.getAllSubmissions(id);
    return {
      ...job,
      applicants: submissions,
    };
  }

  public async remove(id: string): Promise<{ success: boolean; id: string }> {
    await this.db.deleteJob(id);
    return { success: true, id };
  }
}
