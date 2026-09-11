import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalyzeCandidateDto } from './dto/analyze-candidate.dto';
import { CandidateAnalysisResponse, PresetCandidate } from '../types';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  analyzeCandidate(@Body() dto: AnalyzeCandidateDto): CandidateAnalysisResponse {
    return this.analysisService.analyzeCandidate(dto);
  }

  @Get('presets')
  getPresets(): PresetCandidate[] {
    return this.analysisService.getPresets();
  }

  @Get('presets/:id')
  getPresetById(@Param('id') id: string): PresetCandidate {
    const preset = this.analysisService.getPresetById(id);
    if (!preset) {
      throw new Error(`Preset with id '${id}' not found.`);
    }
    return preset;
  }
}
