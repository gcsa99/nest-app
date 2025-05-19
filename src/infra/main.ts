import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Main');
  const envService = app.get(EnvService);

  const NODE_ENV = envService.get('NODE_ENV');
  const URL = envService.get('URL');
  const PORT = envService.get('PORT');

  await app.listen(PORT);
  logger.log('------------------------------------------');
  logger.log(`Environment: ${NODE_ENV}  `);
  logger.log(`Server is running on ${URL}:${PORT}`);
  logger.log('------------------------------------------');
}
bootstrap();
