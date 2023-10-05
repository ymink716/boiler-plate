import { Body, Controller, Delete, Get, Post, Put, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '질문 남기기',
    description: '질문글을 생성합니다.' 
  })
  @ApiBody({ type: CreateQuestionDto })
  @Post()
  @UseGuards(JwtAuthGuard)
  async postQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
  ) {
    const newQuestion = await this.questionsService.postQuestion(createQuestionDto, user);

    return { newQuestion };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '질문글 목록 가져오기',
    description: '질문글 리스트를 가져옵니다.' 
  })
  @Get()
  async getQuestions() {
    const questions = await this.questionsService.getQuestions();

    return { questions };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '질문 상세보기',
    description: '해당 ID의 질문 상세보기.' 
  })
  @Get('/:questionId')
  async getQuestionDetail(@Param('questionId', ParseIntPipe) questionId: number) {
    const question = await this.questionsService.getQuestion(questionId);

    return { question };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '질문 수정',
    description: '질문을 수정합니다.' 
  })
  @ApiBody({ type: UpdateQuestionDto })
  @Put('/:questionId')
  @UseGuards(JwtAuthGuard)
  async updateQuestion(
    @Param('questionId', ParseIntPipe) questionId: number,
    @GetUser() user: User,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const updatedQuestion = await this.questionsService.updateQuestion(questionId, user, updateQuestionDto);

    return { updatedQuestion };
  }

  @ApiBearerAuth('access_token')
  @ApiOperation({ 
    summary: '질문 삭제',
    description: '해당 ID의 질문을 삭제합니다.' 
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
