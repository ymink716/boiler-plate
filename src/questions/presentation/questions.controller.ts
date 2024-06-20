import { Body, Controller, Delete, Get, Post, Put, UseGuards, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Question } from '../domain/question';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { ResponseQuestionDto } from './dto/response-question.dto';
import { QuestionsService } from '../application/questions.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
  ) {}

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
  ): Promise<Question> {
    const { title, content } = createQuestionDto;

    return await this.questionsService.postQuestion(title, content, userId);
  }

  @ApiOperation({ 
    summary: '작성글 목록',
    description: '사용자가 작성한 질문 리스트를 가져옵니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    description: '작성한 질문 목록 가져오기 성공',
    type: ResponseQuestionDto,
  })
  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getQeustionsByUser(@GetUser('id') userId: number): Promise<ResponseQuestionDto[]> {
    return await this.questionsService.getQuestionsByUser(userId);
  }

  @ApiOperation({ 
    summary: '북마크한 글 목록',
    description: '사용자가 북마크한 질문 리스트를 가져옵니다.' 
  })
  @ApiBearerAuth('access_token')
  @ApiResponse({
    status: 200,
    description: '북마크한 질문 목록 가져오기 성공',
    type: ResponseQuestionDto,
  })
  @Get('/bookmarks')
  @UseGuards(JwtAuthGuard)
  async getQuestionsByBookmark(@GetUser('id') userId: number): Promise<ResponseQuestionDto[]> {
    return await this.questionsService.getQuestionsByBookmarks(userId);
  }

  @ApiOperation({ 
    summary: '질문 상세보기',
    description: '해당 ID의 질문 상세보기.' 
  })
  @ApiResponse({
    status: 200,
    description: '질문 상세보기 성공',
    type: ResponseQuestionDto,
  })
  @Get('/:questionId')
  async getQuestionDetail(
    @Param('questionId', ParseIntPipe) questionId: number,
  ): Promise<ResponseQuestionDto> {
    return await this.questionsService.getQuestion(questionId);
  }



  @ApiOperation({ 
    summary: '질문글 목록 가져오기',
    description: '질문글 리스트를 가져옵니다.' 
  })
  @ApiResponse({
    status: 200,
    description: '질문 목록 가져오기 성공',
    type: ResponseQuestionDto,
  })
  @ApiQuery({ name: 'search', required: false, description: '검색어', example: '서울', allowEmptyValue: true })
  @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1, allowEmptyValue: true })
  @ApiQuery({ name: 'take', required: false, description: '개수', example: 10, allowEmptyValue: true })
  @Get()
  async getQuestions(@Query() getQuestionsDto: GetQuestionsDto): Promise<ResponseQuestionDto[]> {
    const { search, page, take } = getQuestionsDto;

    return await this.questionsService.getQuestions(search, page, take);
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
  ): Promise<Question> {
    const { title, content } = updateQuestionDto;

    return await this.questionsService.updateQuestion(questionId, title, content, userId);
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
    await this.questionsService.deleteQuestion(questionId, userId);  

    return { success: true }
  }
}
