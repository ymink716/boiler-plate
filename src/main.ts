import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUp } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setUp(app);
  
  await app.listen(3000);
}

bootstrap();
