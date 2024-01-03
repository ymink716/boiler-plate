import { ForbiddenException } from '@nestjs/common';
import { IsNotCommentor } from 'src/common/exception/error-types';
import { Content } from './content';
import { User } from 'src/users/domain/user';

export class Comment {
  constructor(options: {
    id?: number; 
    content: Content;
    createdAt?: Date;
    deletedAt?: Date;
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
      if (options.deletedAt) {
        this.deletedAt = options.deletedAt;
      }
      this.content = options.content;
      this.userId = options.userId;
      this.questionId = options.questionId;
    }
  }

  private id: number;

  private content: Content;

  private createdAt: Date;

  private deletedAt: Date;

  private userId: number;

  private questionId: number;

  public checkIsAuthor(userId: number): void {
    if (this.userId !== userId) {
      throw new ForbiddenException(IsNotCommentor.message, IsNotCommentor.name);
    }

    return;
  }

  public editContent(content: string): void {
    this.content = new Content(content);
  }

  public getId(): number {
    return this.id;
  }
}