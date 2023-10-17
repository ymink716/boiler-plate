import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { TypeormUsersRepository } from './typeorm-users.repository';
import { USERS_REPOSITORY } from 'src/common/constants/tokens.constant';

@Module({
  imports:[TypeOrmModule.forFeature([User])],
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
