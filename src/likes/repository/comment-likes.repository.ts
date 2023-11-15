import { Comment } from "src/comments/entity/comment.entity";
import { CommentLike } from "../entity/comment-like.entity";
import { User } from "src/users/entity/user.entity";

export interface CommentLikesRepository {
  count(userId: number, commentId: number): Promise<number>;
  save(commentLike: CommentLike): Promise<CommentLike>;
  findByUserIdAndCommentId(userId: number, commentId: number): Promise<CommentLike[]>;
  delete(commentLikeId: number): Promise<void>;
}