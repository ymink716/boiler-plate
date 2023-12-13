import { ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QUESTIONS_REPOSITORY } from "src/common/constants/tokens.constant";
import { QuestionsRepository } from "src/questions/domain/repository/questions.repository";
import { QuestionNotFound } from "src/common/exception/error-types";
import { DeleteQuestionCommand } from "./delete-question.command";

@Injectable()
export class DeleteQuestionHandler implements ICommandHandler<DeleteQuestionCommand> {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsRepository: QuestionsRepository,
  ) {}
  
  async execute(command: DeleteQuestionCommand) {
    const { questionId, userId } = command;

    const question = await this.questionsRepository.findOneById(questionId);
    if (!question) {
      throw new NotFoundException(QuestionNotFound.message, QuestionNotFound.name);
    }
    
    question.checkIsAuthor(userId);
    await this.questionsRepository.softDelete(questionId);

    return { success: true }
  }
}