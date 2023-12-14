import { Body, Controller, Delete, Get, Post, Put, UseGuards, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Question } from '../domain/question';
import { CommandBus } from '@nestjs/cqrs';
import { PostQuestionCommand } from '../application/command/post-question.command';
import { UpdateQuestionCommand } from '../application/command/update-question.command';
import { DeleteQuestionCommand } from '../application/command/delete-question.command';
import { GetQuestionQuery } from '../application/query/get-question.query';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { GetQuestionsQuery } from '../application/query/get-questions.query';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ 
    summary: '질문 남기기',
    description: '질문글을 생성합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiBody({ type: CreateQuestionDto })
  @ApiResponse({
    status: 201,
    description: '질문 등록 성공',
    type: Question,
  })
  @Post()
  @UseGuards(JwtAuthGuard)
  async postQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser('id') userId: number,
  ) {
    const { title, content } = createQuestionDto;

    const command = new PostQuestionCommand(title, content, userId);

    return this.commandBus.execute(command);
  }

  @ApiOperation({ 
    summary: '질문글 목록 가져오기',
    description: '질문글 리스트를 가져옵니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    description: '질문 목록 가져오기 성공',
    type: Question,
  })
  @ApiQuery({ name: 'search', required: false, description: '검색어', example: '서울', allowEmptyValue: true })
  @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1, allowEmptyValue: false })
  @ApiQuery({ name: 'take', required: false, description: '개수', example: 10, allowEmptyValue: false })
  @Get()
  async getQuestions(@Query() getQuestionsDto: GetQuestionsDto) {
    const { search, page, take } = getQuestionsDto;

    const command = new GetQuestionsQuery(search, page, take);

    return this.commandBus.execute(command);
  }

  @ApiOperation({ 
    summary: '질문 상세보기',
    description: '해당 ID의 질문 상세보기.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    description: '질문 상세보기 성공',
    type: Question,
  })
  @Get('/:questionId')
  async getQuestionDetail(@Param('questionId', ParseIntPipe) questionId: number) {
    const command = new GetQuestionQuery(questionId);

    return this.commandBus.execute(command);
  }

  @ApiOperation({ 
    summary: '질문 수정',
    description: '질문을 수정합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    description: '질문 수정 성공',
    type: Question,
  })
  @ApiBody({ type: UpdateQuestionDto })
  @Put('/:questionId')
  @UseGuards(JwtAuthGuard)
  async updateQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @GetUser('id') userId: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const { title, content } = updateQuestionDto;

    const command = new UpdateQuestionCommand(questionId, title, content, userId);

    return this.commandBus.execute(command);  
  }

  @ApiOperation({ 
    summary: '질문 삭제',
    description: '해당 ID의 질문을 삭제합니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    description: '질문 삭제 성공',
  })
  @Delete('/:questionId')
  @UseGuards(JwtAuthGuard)
  async deleteQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @GetUser('id') userId: number,
  ) {
    const command = new DeleteQuestionCommand(questionId, userId);

    return this.commandBus.execute(command);  
  }
}
