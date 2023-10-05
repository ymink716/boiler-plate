import { Controller, Post, UseGuards, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '답변하기', 
    description: '질문에 대한 답변을 추가합니다.' })
  @ApiBody({ type: CreateCommentDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  async writeComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser() user: User,
  ) {
    const newComment = await this.commentsService.writeComment(createCommentDto, user);

    return { newComment };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: '답변 수정', description: '답변을 수정합니다.' })
  @ApiBody({ type: UpdateCommentDto })
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

    return { editedComment };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ summary: '답변 삭제', description: '답변을 삭제합니다.' })
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
