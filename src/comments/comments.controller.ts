import { Controller, Post, UseGuards, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

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

  @Put('/:commentId')
  @UseGuards(JwtAuthGuard)
  async editComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const editedComment = await this.commentsService.editComment(
      updateCommentDto, commentId, user
    );

    return editedComment;
  }

  @Delete('/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    await this.commentsService.deleteComment(commentId, user);

    return { success: true };
  }
}
