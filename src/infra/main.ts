import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Env } from 'config/env';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');
  const configService = app.get<ConfigService<Env>>(ConfigService);

  const NODE_ENV = configService.get('NODE_ENV');
  const URL = configService.get('URL');
  const PORT = configService.get('PORT');

  await app.listen(PORT);
  logger.log('------------------------------------------');
  logger.log(`Environment: ${NODE_ENV}  `);
  logger.log(`Server is running on ${URL}:${PORT}`);
  logger.log('------------------------------------------');
}
bootstrap();
