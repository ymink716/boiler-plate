import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QUESTIONS_REPOSITORY } from "src/common/constants/tokens.constant";
import { QuestionsRepository } from "src/questions/domain/repository/questions.repository";
import { Question } from "src/questions/domain/question";
import { UpdateQuestionCommand } from "./update-question.command";
import { QuestionNotFound } from "src/common/exception/error-types";

@Injectable()
@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler implements ICommandHandler<UpdateQuestionCommand> {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsRepository: QuestionsRepository,
  ) {}
  
  async execute(command: UpdateQuestionCommand): Promise<Question> {
    const { questionId, title, content, userId } = command;

    const question = await this.questionsRepository.findOneById(questionId);
    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }

    question.checkIsAuthor(userId);
    question.update(title, content);

    return await this.questionsRepository.save(question);
  }
}