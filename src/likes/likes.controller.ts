import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async uplikeQuestion(
    @GetUser() user: User,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.uplikeQuestion(questionId, user);

    return { success: true };
  }

  @Delete('/questions/:questionId')
  @UseGuards(JwtAuthGuard)
  async unlikeQuestion(
    @GetUser('id') userId: number,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.unlikeQuestion(questionId, userId);

    return { success: true };
  }

  @Post('/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async uplikeComment(
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number, 
  ) {
    await this.likesService.uplikeComment(commentId, user);

    return { success: true };
  }

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
