import { Comment } from "src/comments/domain/comment";
import { CommentEntity } from "../entity/comment.entity";
import { Content } from "src/comments/domain/content";
import { QuestionEntity } from "src/questions/infrastructure/entity/question.entity";
import { UserEntity } from "src/users/infrastructure/entity/user.entity";


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
    const questionId = comment['questionId'];
    const userId = comment['userId'];

    const commentEntity = new CommentEntity();
    
    if (id) {
      commentEntity.id = id;
    }
    commentEntity.content = content.getContent();

    const questionEntity = new QuestionEntity();
    questionEntity.id = questionId;
    commentEntity.question = questionEntity;

    const userEntity = new UserEntity();
    userEntity.id = userId;
    commentEntity.user = userEntity;

    return commentEntity;
  }
}