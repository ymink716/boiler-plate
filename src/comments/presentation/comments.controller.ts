import { Controller, Post, UseGuards, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from '../domain/comment';
import { User } from 'src/users/domain/user';
import { CommandBus } from '@nestjs/cqrs';
import { WriteCommentCommand } from '../application/command/write-comment.command';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ 
    summary: '답변하기', 
    description: '질문에 대한 답변을 추가합니다.' })
  @ApiBearerAuth('access_token')
  @ApiBody({ type: CreateCommentDto })
  @ApiCreatedResponse({
    description: '답변 생성 성공',
    type: Comment,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async writeComment(
    @Body() createCommentDto: CreateCommentDto,
    @GetUser('id') userId: number,
  ) {
    const { questionId, content } = createCommentDto;

    const command = new WriteCommentCommand(questionId, content, userId);

    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '답변 수정', description: '답변을 수정합니다.' })
  @ApiBearerAuth('access_token')
  @ApiBody({ type: UpdateCommentDto })
  @ApiOkResponse({
    description: '답변 수정 성공',
    type: Comment,
  })
  @Put('/:commentId')
  @UseGuards(JwtAuthGuard)
  async editComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const { content } = updateCommentDto;
    return await this.commentsService.editComment(updateCommentDto, commentId, user);
  }

  @ApiOperation({ summary: '답변 삭제', description: '답변을 삭제합니다.' })
  @ApiBearerAuth('access_token')
  @ApiOkResponse({
    description: '답변 삭제 성공',
  })
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
