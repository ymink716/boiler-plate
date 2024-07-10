import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LikesService } from '../application/likes.service';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ 
    summary: '답변에 대한 좋아요', 
    description: '해당 답변에 좋아요를 추가합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiCreatedResponse({ description: '좋아요 추가 성공' })
  @Post('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async uplikeComment(
    @GetUser('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number, 
  ) {
    await this.likesService.uplikeComment(commentId, userId);

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
