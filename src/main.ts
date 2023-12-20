import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { authMiddleware } from './auth/user/user-auth.middleware'; // Adjust the path
import * as express from 'express';
import * as path from 'path';

const port= 5001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use('/media', express.static(path.join(__dirname, '..', 'media')));

  app.use(authMiddleware()); // Use the factory function to get the middleware


  await app.listen(port, () => {
    Logger.log(`is running on http://localhost:${port}`);
  });
}
bootstrap();
