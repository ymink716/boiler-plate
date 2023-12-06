import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { LikesService } from '../application/likes.service';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/infrastructure/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ 
    summary: '질문에 대한 좋아요', 
    description: '해당 질문에 좋아요를 추가합니다.' 
  })
  @ApiBearerAuth('access_token')
  @Post('/questions/:questionId')
  @ApiCreatedResponse({ description: '좋아요 추가 성공' })
  @UseGuards(JwtAuthGuard)
  async uplikeQuestion(
    @GetUser() user: User,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.uplikeQuestion(questionId, user);

    return { success: true };
  }

  @ApiOperation({ 
    summary: '질문에 대한 좋아요 삭제', 
    description: '해당 질문에 좋아요를 삭제합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({ status: 200, description: '좋아요 삭제 성공' })
  @Delete('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async unlikeQuestion(
    @GetUser('id') userId: number,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.unlikeQuestion(questionId, userId);

    return { success: true };
  }

  @ApiOperation({ 
    summary: '답변에 대한 좋아요', 
    description: '해당 답변에 좋아요를 추가합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({ description: '좋아요 추가 성공' })
  @Post('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async uplikeComment(
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number, 
  ) {
    await this.likesService.uplikeComment(commentId, user);

    return { success: true };
  }

  @ApiOperation({ 
    summary: '답변에 대한 좋아요 삭제', 
    description: '해당 답변에 좋아요를 삭제합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({ status: 200, description: '좋아요 삭제 성공' })
  @Delete('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async unlikeComment(
    @GetUser('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number, 
  ) {
    await this.likesService.unlikeComment(commentId, userId);

    return { success: true };
  }
}
