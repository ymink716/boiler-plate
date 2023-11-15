import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUp } from './config/app.config';

const port = 80;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  setUp(app);
  
  await app.listen(port);
}

bootstrap();
