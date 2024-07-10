import { INestApplication, ValidationPipe } from '@nestjs/common';
import { BaseAPIDocumentation } from './swagger.config';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

export const setUp = (app: INestApplication) => {
  
  app.setGlobalPrefix('/api', { exclude: ['health'] });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,  // mapping class로 변환 허용
      transformOptions: {
        enableImplicitConversion: true,  // 암묵적으로 타입을 변환
      }
    })
  );

  app.enableCors({
    origin: '*',
    methods: "GET, POST, PATCH, DELETE, PUT",
    allowedHeaders: "Content-Type, Authorization",
  });
  
  app.use(cookieParser());

  const documentOptions = new BaseAPIDocumentation().initializeOptions();
  const document = SwaggerModule.createDocument(app, documentOptions);
  SwaggerModule.setup('api-docs', app, document);
};