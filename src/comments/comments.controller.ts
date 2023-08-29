import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async writeComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    const newComment = await this.commentsService.writeComment(createCommentDto, user);

    return newComment;
  }

  async editComment() {

  }

  async deleteComment() {

  }
}
