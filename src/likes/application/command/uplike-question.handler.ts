import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {  QUESTION_LIKES_REPOSITORY } from "src/common/constants/tokens.constant";
import { UplikeQuestionCommand } from "./uplike-question.command";
import { QuestionLikesRepository } from "src/likes/domain/repository/question-likes.repository";
import { QuestionLike } from "src/likes/domain/question.like";
import { QuestionAlreadyLiked } from "src/common/exception/error-types";

@Injectable()
@CommandHandler(UplikeQuestionCommand)
export class UplikeQuestionHandler implements ICommandHandler<UplikeQuestionCommand> {
  constructor(
    @Inject(QUESTION_LIKES_REPOSITORY)
    private readonly questionLikesRepository: QuestionLikesRepository,
  ) {}
  
  async execute(command: UplikeQuestionCommand) {
    const { questionId, userId } = command;
        
    const questionLikesCount = await this.questionLikesRepository.count(userId, questionId);
    if (questionLikesCount > 0) {
      throw new BadRequestException(QuestionAlreadyLiked.message, QuestionAlreadyLiked.name);
    }

    const qustionLike = new QuestionLike({ userId, questionId });

    try {
      await this.questionLikesRepository.save(qustionLike);
      return { success: true }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}