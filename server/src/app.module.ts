import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AnalysisModule } from './analysis/analysis.module';
import { SubmissionsModule } from './submissions/submissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AnalysisModule,
    SubmissionsModule,
  ],
})
export class AppModule {}
