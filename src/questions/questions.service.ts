import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionsRepository } from './questions.repository';
import { Question } from './entity/question.entity';
import { User } from 'src/users/entity/user.entity';
import { IsNotQuestionWriter, QuestionNotFound } from 'src/common/exception/error-types';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @Inject('QUESTIONS_REPOSITORY')
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async postQuestion(createQuestionDto: CreateQuestionDto, writer: User) {
    const { title, content } = createQuestionDto;

    const question = new Question({ title, content, writer });

    const newQuestion = this.questionsRepository.save(question);

    return newQuestion;
  }

  async getQuestions() {
    return await this.questionsRepository.findAll();
  }

  async getQuestion(questionId: number) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    return question;
  }

  async updateQuestion(questionId: number, user: User, updateQuestionDto: UpdateQuestionDto) {
    const question = await this.questionsRepository.findOneById(questionId);
    
    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    this.isWriter(question, user);

    const { title, content } = updateQuestionDto;

    const updatedQuestion = await this.questionsRepository.update(question, title, content);

    return updatedQuestion;
  }

  async deleteQuestion(questionId: number, user: User) {
    const question = await this.questionsRepository.findOneById(questionId);

    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    this.isWriter(question, user);

    await this.questionsRepository.softDelete(questionId);
  }

  isWriter(question: Question, writer: User) {
    const isWriter = (question.writer.id === writer.id);
    
    if (!isWriter) {
      throw new ForbiddenException(IsNotQuestionWriter.message, IsNotQuestionWriter.name);
    }
  }
}
