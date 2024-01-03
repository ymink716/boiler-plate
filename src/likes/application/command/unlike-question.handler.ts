import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable } from "@nestjs/common";
import {  QUESTION_LIKES_REPOSITORY } from "src/common/constants/tokens.constant";
import { QuestionLikesRepository } from "src/likes/domain/repository/question-likes.repository";
import { UnlikeQuestionCommand } from "./unlike-question.command";

@Injectable()
@CommandHandler(UnlikeQuestionCommand)
export class UnlikeQuestionHandler implements ICommandHandler<UnlikeQuestionCommand> {
  constructor(
    @Inject(QUESTION_LIKES_REPOSITORY)
    private readonly questionLikesRepository: QuestionLikesRepository,
  ) {}
  
  async execute(command: UnlikeQuestionCommand) {
    const { questionId, userId } = command;
        
    const questionLikes = await this.questionLikesRepository.findByUserIdAndQeustionId(userId, questionId);
    await this.questionLikesRepository.remove(questionLikes);

    return { success: true }
  }
}