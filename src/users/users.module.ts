import { Module } from '@nestjs/common';
import { UsersController } from './presentation/users.controller';
import { UsersService } from './application/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeormUsersRepository } from './infrastructure/typeorm-users.repository';
import { USERS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { UserEntity } from './infrastructure/entity/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: TypeormUsersRepository,
    }
  ],
  exports: [UsersService]
})
export class UsersModule {}
