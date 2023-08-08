import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
    ConfigModule,

  ],
  controllers: [AuthController],
  providers: [
    GoogleStrategy, 
    JwtStrategy,
    JwtRefreshStrategy,
    AuthService, 
    UsersService, 
  ]
})
export class AuthModule {}
