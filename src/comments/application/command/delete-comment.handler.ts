import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "src/comments/domain/repository/comments.repository";
import { COMMENTS_REPOSITORY } from "src/common/constants/tokens.constant";
import { CommentNotFound } from "src/common/exception/error-types";
import { DeleteCommentCommand } from "./delete-comment.command";

@Injectable()
@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler implements ICommandHandler<DeleteCommentCommand> {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
  ) {}
  
  async execute(command: DeleteCommentCommand) {
    const { commentId, userId } = command;
    
    const comment = await this.commentsRepository.findOneById(commentId);
    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }
    
    comment.checkIsAuthor(userId);
    await this.commentsRepository.softDelete(commentId);

    return { success: true };
  }
}