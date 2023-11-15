import { INestApplication, ValidationPipe } from '@nestjs/common';
import { BaseAPIDocumentation } from './swagger.config';
import { SwaggerModule } from '@nestjs/swagger';

export const setUp = (app: INestApplication) => {
  
  app.setGlobalPrefix('/api', { exclude: ['health'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const documentOptions = new BaseAPIDocumentation().initializeOptions();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api-docs', app, document);
};