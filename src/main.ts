import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setUp } from './config/app.config';
import { ConfigService } from '@nestjs/config';
import { PORT } from './common/constants/config.constant';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    
  setUp(app);
  
  const configService = app.get(ConfigService);
  const port = configService.get(PORT);

  await app.listen(port);
}

bootstrap();
