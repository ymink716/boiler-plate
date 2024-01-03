import { CommentLike } from "src/likes/domain/comment.like";
import { CommentLikeEntity } from "../entity/comment-like.entity";
import { CommentEntity } from "src/comments/infrastructure/entity/comment.entity";
import { UserEntity } from "src/users/infrastructure/entity/user.entity";


export class CommentLikeMapper {
  public static toDomain(commentLikeEntity: CommentLikeEntity): CommentLike {
    const { id, user, comment } = commentLikeEntity;

    const commentLike = new CommentLike({
      id, 
      userId: user.id, 
      commentId: comment.id
    });

    return commentLike;
  }

  public static toPersistence(commentLike: CommentLike): CommentLikeEntity {
    const id = commentLike['id'];
    const userId = commentLike['userId'];
    const commentId = commentLike['commentId'];
    
    const commentLikeEntity = new CommentLikeEntity();

    if (id) {
      commentLikeEntity.id = id;
    }
    commentLikeEntity.user = Object.assign(new UserEntity(), { id: userId });
    commentLikeEntity.comment = Object.assign(new CommentEntity(), { id: commentId });

    return commentLikeEntity;
  }
}