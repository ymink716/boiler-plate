import { User } from 'src/users/entity/user.entity';
import { ForbiddenException } from '@nestjs/common';
import { IsNotCommentor } from 'src/common/exception/error-types';
import { Content } from './vo/content';

export class Comment {
  constructor(options: {
    id?: number; 
    content: Content;
    createdAt?: Date;
    userId: number;
    questionId: number;
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      if (options.createdAt) {
        this.createdAt = options.createdAt;
      }
      this.content = options.content;
      this.userId = options.userId;
      this.questionId = options.questionId;
    }
  }

  private id: number;

  private content: Content;

  private createdAt: Date;

  private updatedAt: Date;

  private deletedAt: Date;

  private userId: number;

  private questionId: number;

  private likeIds: number[];

  public checkIsAuthor(user: User): void {
    const userId = user.id;

    if (this.userId !== userId) {
      throw new ForbiddenException(IsNotCommentor.message, IsNotCommentor.name);
    }
  }

  public editContent(content: string): void {
    this.content = new Content(content);
  }

  public getId(): number {
    return this.id;
  }
}