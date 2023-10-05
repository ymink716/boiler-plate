import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '질문에 대한 좋아요', 
    description: '해당 질문에 좋아요를 추가합니다.' 
  })
  @Post('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async uplikeQuestion(
    @GetUser() user: User,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.uplikeQuestion(questionId, user);

    return { success: true };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '질문에 대한 좋아요 삭제', 
    description: '해당 질문에 좋아요를 삭제합니다.' 
  })
  @Delete('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async unlikeQuestion(
    @GetUser('id') userId: number,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.unlikeQuestion(questionId, userId);

    return { success: true };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '답변에 대한 좋아요', 
    description: '해당 답변에 좋아요를 추가합니다.' 
  })
  @Post('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async uplikeComment(
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number, 
  ) {
    await this.likesService.uplikeComment(commentId, user);

    return { success: true };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '답변에 대한 좋아요 삭제', 
    description: '해당 답변에 좋아요를 삭제합니다.' 
  })
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
