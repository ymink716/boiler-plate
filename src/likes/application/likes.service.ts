import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CommentAlreadyLiked } from 'src/common/exception/error-types';
import { CommentLikesRepository } from '../domain/repository/comment-likes.repository'; 
import { CommentsService } from 'src/comments/application/comments.service'; 
import { COMMENT_LIKES_REPOSITORY } from 'src/common/constants/tokens.constant';
import { CommentLike } from '../domain/comment.like'; 

@Injectable()
export class LikesService {
  constructor(
    @Inject(COMMENT_LIKES_REPOSITORY)
    private readonly commentLikesRepository: CommentLikesRepository,
    private readonly commentsService: CommentsService,
  ) {}

  async uplikeComment(commentId: number, userId: number): Promise<void> {
    await this.commentsService.getComment(commentId);

    const commentLikesCount = await this.commentLikesRepository.count(userId, commentId);
    if (commentLikesCount > 0) {
      throw new BadRequestException(CommentAlreadyLiked.message, CommentAlreadyLiked.name);
    }

    const commentLike = new CommentLike({ commentId, userId });
    await this.commentLikesRepository.save(commentLike);
  }

  async unlikeComment(commentId: number, userId: number): Promise<void> {
    const commentLikes = await this.commentLikesRepository.findByUserIdAndCommentId(userId, commentId);

    await this.commentLikesRepository.remove(commentLikes);
  }
}