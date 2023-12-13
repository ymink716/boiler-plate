import { Comment } from "src/comments/domain/comment";
import { CommentEntity } from "../entity/comment.entity";
import { Content } from "src/comments/domain/vo/content";


export class CommentMapper {
  public static toDomain(commentEntity: CommentEntity): Comment {
    const { id, content, createdAt, question, user } = commentEntity;
    
    const comment = new Comment({
      id, 
      content: new Content(content), 
      createdAt, 
      userId: user.id, 
      questionId: question.id, 
    });

    return comment;
  }

  public static toPersistence(comment: Comment): CommentEntity {
    const id = comment['id'];
    const content = comment['content'];

    const commentEntity = new CommentEntity();

    if (id) {
      commentEntity.id = id;
    }
    commentEntity.content = content.getContent();

    return commentEntity;
  }
}