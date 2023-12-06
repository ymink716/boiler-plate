import { Body, Controller, Delete, Get, Post, Put, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { QuestionsService } from '../application/questions.service';
import { CreateQuestionDto } from '../dto/create-question.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { UpdateQuestionDto } from '../dto/update-question.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Question } from '../domain/question';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

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
    @GetUser() user: User,
  ) {
    return await this.questionsService.postQuestion(createQuestionDto, user);
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
  @Get()
  async getQuestions() {
    return await this.questionsService.getQuestions();
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
    return await this.questionsService.getQuestion(questionId);
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
    @GetUser() user: User,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return await this.questionsService.updateQuestion(questionId, user, updateQuestionDto);
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
    @GetUser() user: User,
  ) {
    await this.questionsService.deleteQuestion(questionId, user);

    return { success: true };
  }
}
