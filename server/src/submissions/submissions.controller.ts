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
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { StoredSubmission } from '../database/database.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateSubmissionDto): Promise<StoredSubmission> {
    return this.submissionsService.create(dto);
  }

  @Get()
  findAll(): Promise<StoredSubmission[]> {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StoredSubmission> {
    return this.submissionsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ success: boolean; id: string }> {
    return this.submissionsService.remove(id);
  }
}
