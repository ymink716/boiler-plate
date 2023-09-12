import { INestApplication, ValidationPipe } from '@nestjs/common';

export const setUpTestingAppModule = (app: INestApplication) => {
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
};