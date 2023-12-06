import { User } from 'src/users/entity/user.entity';
import { Comment } from 'src/comments/entity/comment.entity';
import { QuestionLike } from 'src/likes/entity/question-like.entity';
import { Bookmark } from 'src/bookmarks/entity/bookmark.entity';
import { Content } from './vo/content';
import { Title } from './vo/title';
import { ForbiddenException } from '@nestjs/common';
import { IsNotQuestionWriter } from 'src/common/exception/error-types';


export class Question {
  constructor(options: {
    id?: number; 
    title: Title;
    content: Content;
    createdAt?: Date;
    writer: User;
    comments: Comment[];
    likes: QuestionLike[];
    bookmarks: Bookmark[];
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      this.title = options.title;
      this.content = options.content;
      if (options.createdAt) {
        this.createdAt = options.createdAt;
      }
      this.writer = options.writer;
      this.comments = options.comments;
      this.likes = options.likes;
      this.bookmarks = options.bookmarks;
    }
  }

  private id: number;
  
  private title: Title;

  private content: Content;

  private createdAt: Date;

  private writer: User;

  private comments: Comment[];

  private likes: QuestionLike[];

  private bookmarks: Bookmark[];

  public checkIsAuthor(user: User): void {
    const writerId = this.writer.id;
    const userId = user.id;

    if (writerId !== userId) {
      throw new ForbiddenException(IsNotQuestionWriter.message, IsNotQuestionWriter.name);
    }
  }

  public update(title: string, content: string): void {
    this.title = new Title(title);
    this.content = new Content(content);
  }
}
