import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { StoredJob } from '../database/database.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateJobDto): Promise<StoredJob> {
    return this.jobsService.create(dto);
  }

  @Get()
  findAll(): Promise<any[]> {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.jobsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ success: boolean; id: string }> {
    return this.jobsService.remove(id);
  }
}
