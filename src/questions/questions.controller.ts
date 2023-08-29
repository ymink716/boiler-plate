import { Body, Controller, Delete, Get, Post, Put, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/common/custom-decorators/get-user.decorator';
import { User } from 'src/users/entity/user.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async postQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @GetUser() user: User,
  ) {
    const newQuestion = await this.questionsService.postQuestion(createQuestionDto, user);

    return { newQuestion };
  }

  @Get()
  async getQuestions() {
    const questions = await this.questionsService.getQuestions();

    return { questions };
  }

  @Get('/:questionId')
  async getQuestionDetail(@Param('questionId', ParseIntPipe) questionId: number) {
    const question = await this.questionsService.getQuestion(questionId);

    return { question };
  }

  @Put('/:questionId')
  @UseGuards(JwtAuthGuard)
  async updateQuestion() {
    const updatedQuestion = await this.questionsService.updateQuestion();
  }

  @Delete('/:questionId')
  @UseGuards(JwtAuthGuard)
  async deleteQuestion() {

  }
}
