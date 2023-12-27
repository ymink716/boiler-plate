import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { QUESTIONS_REPOSITORY } from "src/common/constants/tokens.constant";
import { QuestionsRepository } from "src/questions/domain/repository/questions.repository";
import { QuestionNotFound } from "src/common/exception/error-types";
import { DeleteQuestionCommand } from "./delete-question.command";

@Injectable()
@CommandHandler(DeleteQuestionCommand)
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


// export class PostService {
//   delete() {
//     // 게시글 삭제 로직
//     // 게시글 삭제 로직
//     // 게시글 삭제 로직
//     // 게시글 삭제 로직

//     event.publish(new DeletedPostEvent())
//   }
// }

// export class CommentService {
//   delete() {
    
//   }
// }

// export class DeletedPostEvent {
//   handler() {
//     this.commentService.delete()
//   }
// }