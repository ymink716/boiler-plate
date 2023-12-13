import { ICommandHandler } from "@nestjs/cqrs";
import { WriteCommentCommand } from "./write-comment.command";
import { Inject, Injectable } from "@nestjs/common";
import { QuestionsService } from "src/questions/application/questions.service";
import { Content } from "src/comments/domain/vo/content";
import { Comment } from "src/comments/domain/comment";
import { CommentsRepository } from "src/comments/domain/repository/comments.repository";
import { COMMENTS_REPOSITORY } from "src/common/constants/tokens.constant";

@Injectable()
export class WriteCommentHandler implements ICommandHandler<WriteCommentCommand> {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
    private readonly questionsService: QuestionsService,
  ) {}
  
  async execute(command: WriteCommentCommand): Promise<Comment> {
    const { questionId, content, userId } = command;
    
    const question = await this.questionsService.getQuestion(questionId);

    const comment = new Comment({ 
      content: new Content(content),
      questionId: question.getId(),
      userId,
    });

    return await this.commentsRepository.save(comment);
  }
}