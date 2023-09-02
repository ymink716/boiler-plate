import { Controller, Delete, Param, ParseIntPipe, Post } from '@nestjs/common';
import { LikesService } from './likes.service';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/questions/:questionId')
  async uplikeQuestion(
    @GetUser() user: User,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.uplikeQuestion(questionId, user);

    return { success: true };
  }

  @Delete('/questions/:questionId')
  async unlikeQuestion(
    @GetUser() user: User,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    await this.likesService.unlikeQuestion(questionId, user);

    return { success: true };
  }
}
