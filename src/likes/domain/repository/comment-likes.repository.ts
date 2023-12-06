import { CommentLike } from "../comment.like";

export interface CommentLikesRepository {
  count(userId: number, commentId: number): Promise<number>;
  save(commentLike: CommentLike): Promise<CommentLike>;
  findByUserIdAndCommentId(userId: number, commentId: number): Promise<CommentLike[]>;
  remove(commentLikes: CommentLike[]): Promise<void>;
}