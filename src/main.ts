// Local:::::::

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { Logger } from '@nestjs/common';

const port = 5001; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  // Serve static files from 'media' directory
  const mediaPath = join(__dirname,'..', 'media');
  expressApp.use('/media', express.static(mediaPath));

  app.enableCors();

  await app.listen(port);
  Logger.log(`Application is running on port: ${port}`);
}

bootstrap();


// Prod:

// import { NestFactory } from '@nestjs/core';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { AppModule } from './app.module';
// import { Logger } from '@nestjs/common';
// import * as path from 'path';

// const port = 5001;

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   // const pcIpAddress = '102.152.215.199';
//   // const allowedOrigins = [
//   //   'https://dessa.tn',
//   //   'https://www.dessa.tn',
//   //   `http://${pcIpAddress}`,
//   //   `https://${pcIpAddress}`,
//   // ];

//   // app.enableCors({
//   //   origin: allowedOrigins,
//   // });

//   const staticAssetsPath = path.join(__dirname, '..','media');
//   app.useStaticAssets(staticAssetsPath, {
//     prefix: '/media/',
//   });

//   await app.listen(port);
//   Logger.log(`Application is running on: http://localhost:${port}`);
//   console.log(`Serving static assets from: ${staticAssetsPath}`);
// }

// bootstrap();

