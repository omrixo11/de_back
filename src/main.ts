import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port= 5001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  await app.listen(port, () => {
    Logger.log(`is running on http://localhost:${port}`);
  });
}
bootstrap();
