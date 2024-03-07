import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = 5001; // or any port you wish to use

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors(); // Enable CORS if needed
  
  await app.listen(port, () => {
    Logger.log(`Application is running on: ${port}`);
  });

//   app.listen(port, () => {
//     Logger.log(`Application is running on: ${port}`);
// });

}
bootstrap();
