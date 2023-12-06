import { Controller, Post, UseGuards, Body, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/infrastructure/entity/user.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Comment } from '../domain/comment';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
    @GetUser() user: User,
  ) {
    return await this.commentsService.writeComment(createCommentDto, user);
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
    @GetUser() user: User,
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
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
