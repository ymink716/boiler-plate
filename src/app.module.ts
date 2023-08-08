import { Module } from '@nestjs/common';
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
})

export class AppModule {}
