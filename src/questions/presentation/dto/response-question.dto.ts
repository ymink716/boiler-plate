import { ApiProperty } from '@nestjs/swagger';
import { BookmarkEntity } from 'src/bookmarks/infrastructure/entity/bookmark.entity';
import { CommentEntity } from 'src/comments/infrastructure/entity/comment.entity';
import { QuestionLikeEntity } from 'src/likes/infrastructure/entity/question-like.entity';
import { QuestionEntity } from 'src/questions/infrastructure/entity/question.entity';
import { UserEntity } from 'src/users/infrastructure/entity/user.entity';

export class ResponseQuestionDto {
  constructor(question: QuestionEntity) {
    this.id = question.id;
    this.title = question.title;
    this.content = question.content;
    this.createdAt = question.createdAt;
    this.user = question.user;
    this.comments = question.comments;
    this.likes = question.likes;
    this.bookmarks = question.bookmarks;
  }

  @ApiProperty()
  private readonly id: number;

  @ApiProperty()
  private readonly title: string;

  @ApiProperty()
  private readonly content: string;

  @ApiProperty()
  private readonly createdAt: Date;

  @ApiProperty()
  private readonly user: UserEntity;

  @ApiProperty()
  private readonly comments: CommentEntity[];

  @ApiProperty()
  private readonly likes: QuestionLikeEntity[];

  @ApiProperty()
  private readonly bookmarks: BookmarkEntity[];
}
