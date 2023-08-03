import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configModuleConfig } from './config/config-module.config';
import { typeormModuleConfig } from './config/typeorm-module.config';

@Module({
  imports: [
    configModuleConfig,
    typeormModuleConfig,
    AuthModule,
    UsersModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
