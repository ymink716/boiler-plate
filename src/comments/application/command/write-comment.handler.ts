import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { WriteCommentCommand } from "./write-comment.command";
import { Inject, Injectable } from "@nestjs/common";
import { Content } from "src/comments/domain/content";
import { Comment } from "src/comments/domain/comment";
import { CommentsRepository } from "src/comments/domain/repository/comments.repository";
import { COMMENTS_REPOSITORY } from "src/common/constants/tokens.constant";

@Injectable()
@CommandHandler(WriteCommentCommand)
export class WriteCommentHandler implements ICommandHandler<WriteCommentCommand> {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
  ) {}
  
  async execute(command: WriteCommentCommand): Promise<Comment> {
    const { questionId, content, userId } = command;
    console.log(questionId, content, userId);
    const comment = new Comment({ 
      content: new Content(content),
      questionId,
      userId,
    });

    try {
      return await this.commentsRepository.save(comment);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}