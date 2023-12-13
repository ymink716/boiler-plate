import { ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CommentsRepository } from "src/comments/domain/repository/comments.repository";
import { COMMENTS_REPOSITORY } from "src/common/constants/tokens.constant";
import { EditCommentCommand } from "./edit-comment.command";
import { CommentNotFound } from "src/common/exception/error-types";
import { Comment } from "src/comments/domain/comment";

@Injectable()
export class EditCommentHandler implements ICommandHandler<EditCommentCommand> {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
  ) {}
  
  async execute(command: EditCommentCommand): Promise<Comment> {
    const { commentId, content, userId } = command;
    
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    comment.checkIsAuthor(userId);
    comment.editContent(content);

    return await this.commentsRepository.save(comment);
  }
}