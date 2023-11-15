import { Inject, Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsRepository } from './repository/questions.repository';
import { Question } from './entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { InvalidQuestionContent, InvalidQuestionTitle, IsNotQuestionWriter, QuestionNotFound } from 'src/common/exception/error-types';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QUESTIONS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Title } from './vo/title';
import { Content } from './vo/content';
import { WriterCheckService } from './domain/writer-check.service';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsRepository: QuestionsRepository,
    private readonly writerCheckService: WriterCheckService,
  ) {}

  public async postQuestion(createQuestionDto: CreateQuestionDto, writer: User) {
    const title = new Title(createQuestionDto.title);
    const content = new Content(createQuestionDto.content);

    const question = new Question({ title, content, writer });
    const newQuestion = this.questionsRepository.save(question);

    return newQuestion;
  }

  public async getQuestions() {
    return await this.questionsRepository.findAll();
  }

  public async getQuestion(questionId: number) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    return question;
  }

  public async updateQuestion(questionId: number, user: User, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    const title = new Title(updateQuestionDto.title);
    const content = new Content(updateQuestionDto.content);

    this.writerCheckService.checkWriter(question, user);

    question.title = title;
    question.content = content;

    return await this.questionsRepository.save(question);
  }

  public async deleteQuestion(questionId: number, user: User) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    this.writerCheckService.checkWriter(question, user);

    await this.questionsRepository.softDelete(questionId);
  }
}
