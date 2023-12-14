import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable } from "@nestjs/common";
import { COMMENT_LIKES_REPOSITORY } from "src/common/constants/tokens.constant";
import { UnlikeCommentCommand } from "./unlike-comment.command";
import { CommentLikesRepository } from "src/likes/domain/repository/comment-likes.repository";

@Injectable()
@CommandHandler(UnlikeCommentCommand)
export class UnlikeCommentHandler implements ICommandHandler<UnlikeCommentCommand> {
  constructor(
    @Inject(COMMENT_LIKES_REPOSITORY)
    private readonly commentLikesRepository: CommentLikesRepository,
  ) {}
  
  async execute(command: UnlikeCommentCommand) {
    const { commentId, userId } = command;
        
    const commentLikes = await this.commentLikesRepository.findByUserIdAndCommentId(userId, commentId);
    await this.commentLikesRepository.remove(commentLikes);

    return { success: true }
  }
}