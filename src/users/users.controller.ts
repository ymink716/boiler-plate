import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from './entity/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    description: '사용자 프로필을 가져옵니다.', 
    summary: '프로필' 
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: User) {
    return user;
  }
}