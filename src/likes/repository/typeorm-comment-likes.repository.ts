import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentLikesRepository } from "./comment-likes.repository";
import { CommentLike } from "../entity/comment-like.entity";
import { User } from "src/users/entity/user.entity";
import { Comment } from "src/comments/entity/comment.entity";

@Injectable()
export class TypeormCommentLikesRepository implements CommentLikesRepository {
  constructor(
    @InjectRepository(CommentLike)
    private readonly commentLikesRepository: Repository<CommentLike>,
  ) {}

  async count(userId: number, commentId: number): Promise<number> {
    const commentLikesCount = await this.commentLikesRepository.count({
      relations: {
        user: true,
        comment: true,
      },      
      where: {
        user: {
          id: userId,
        },
        comment: {
          id: commentId,
        }
      },
    });

    return commentLikesCount;
  }

  async save(commentLike: CommentLike): Promise<CommentLike> {
    return await this.commentLikesRepository.save(commentLike);
  }

  async findByUserIdAndCommentId(userId: number, commentId: number): Promise<CommentLike[]> {
    const commentLikes = await this.commentLikesRepository.find({
      relations: {
        user: true,
        comment: true,
      },      
      where: {
        user: {
          id: userId,
        },
        comment: {
          id: commentId,
        }
      },
    });

    return commentLikes;
  }

  async remove(commentLikes: CommentLike[]): Promise<void> {
    await this.commentLikesRepository.remove(commentLikes);
  }
}