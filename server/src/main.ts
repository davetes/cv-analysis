import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const logger = new Logger('HireAssistServer');
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: true,
    credentials: true,
  }));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 HireAssist AI NestJS Server is running on http://localhost:${port}/api`);
}

bootstrap();
