import { ApiProperty } from "@nestjs/swagger";
import { CommentEntity } from "src/comments/infrastructure/entity/comment.entity";
import { CommentLikeEntity } from "src/likes/infrastructure/entity/comment-like.entity";
import { QuestionEntity } from "src/questions/infrastructure/entity/question.entity";
import { UserEntity } from "src/users/infrastructure/entity/user.entity";

export class ResponseCommentDto {
  constructor(comment: CommentEntity) {
    this.id = comment.id;
    this.content = comment.content;
    this.createdAt = comment.createdAt;
    this.user = comment.user;
    this.likes = comment.likes;
  }

  @ApiProperty()
  private readonly id: number;
  
  @ApiProperty()
  private readonly content: string;
  
  @ApiProperty()
  private readonly createdAt: Date;
  
  @ApiProperty()
  private readonly user: UserEntity;
    
  @ApiProperty()
  private readonly likes: CommentLikeEntity[];
}