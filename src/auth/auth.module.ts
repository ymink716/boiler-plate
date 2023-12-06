import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthService } from './application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy, 
    JwtStrategy,
    JwtRefreshStrategy,
    AuthService, 
  ]
})
export class AuthModule {}
