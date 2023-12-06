import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from '../infrastructure/entity/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {

  @ApiOperation({ 
    description: '사용자 프로필을 가져옵니다.', 
    summary: '프로필' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    type: User,
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@GetUser() user: User) {
    return user;
  }
}