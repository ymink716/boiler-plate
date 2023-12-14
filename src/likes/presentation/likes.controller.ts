import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UplikeQuestionCommand } from '../application/command/uplike-question.command';
import { CommandBus } from '@nestjs/cqrs';
import { UnlikeQuestionCommand } from '../application/command/unlike-question.command';
import { UplikeCommentCommand } from '../application/command/uplike-comment.command';
import { UnlikeCommentCommand } from '../application/command/unlike-comment.command';

@ApiTags('likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ 
    summary: '질문에 대한 좋아요', 
    description: '해당 질문에 좋아요를 추가합니다.' 
  })
  @ApiBearerAuth('access_token')
  @Post('/questions/:questionId')
  @ApiCreatedResponse({ description: '좋아요 추가 성공' })
  @UseGuards(JwtAuthGuard)
  async uplikeQuestion(
    @GetUser('id') userId: number,
    @Param('questionId', ParseIntPipe) questionId: number, 
  ) {
    const command = new UplikeQuestionCommand(questionId, userId);

    return await this.commandBus.execute(command);
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
    const command = new UnlikeQuestionCommand(questionId, userId);

    return await this.commandBus.execute(command);
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
    @GetUser('id') userId: number,
    @Param('commentId', ParseIntPipe) commentId: number, 
  ) {
    const command = new UplikeCommentCommand(commentId, userId);

    return await this.commandBus.execute(command);
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
    const command = new UnlikeCommentCommand(commentId, userId);

    return await this.commandBus.execute(command);
  }
}
