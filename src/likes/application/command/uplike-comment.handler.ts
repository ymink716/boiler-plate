import { ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import {  COMMENT_LIKES_REPOSITORY } from "src/common/constants/tokens.constant";
import { UplikeCommentCommand } from "./uplike-comment.command";
import { CommentLikesRepository } from "src/likes/domain/repository/comment-likes.repository";
import { CommentLike } from "src/likes/domain/comment.like";
import { CommentAlreadyLiked } from "src/common/exception/error-types";

@Injectable()
export class UplikeCommentHandler implements ICommandHandler<UplikeCommentCommand> {
  constructor(
    @Inject(COMMENT_LIKES_REPOSITORY)
    private readonly commentLikesRepository: CommentLikesRepository,
  ) {}
  
  async execute(command: UplikeCommentCommand) {
    const { commentId, userId } = command;
        
    const commentLikesCount = await this.commentLikesRepository.count(userId, commentId);
    if (commentLikesCount > 0) {
      throw new BadRequestException(CommentAlreadyLiked.message, CommentAlreadyLiked.name);
    }

    const commentLike = new CommentLike({ commentId, userId });
    
    try {
      await this.commentLikesRepository.save(commentLike);
      return { success: true }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}