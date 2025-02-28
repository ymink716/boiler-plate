import { Content } from './content';
import { Title } from './title';
import { ForbiddenException } from '@nestjs/common';
import { IsNotQuestionWriter } from 'src/common/exception/error-types';
import { ApiProperty } from '@nestjs/swagger';

export class Question {
  constructor(options: {
    id?: number; 
    title: Title;
    content: Content;
    views?: number;
    createdAt?: Date;
    userId: number;
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      this.title = options.title;
      this.content = options.content;
      if (options.views) {
        this.views = options.views;
      } else {
        this.views = 0;
      }    
      if (options.createdAt) {
        this.createdAt = options.createdAt;
      }
      this.userId = options.userId;
    }
  }

  @ApiProperty()
  private id: number;
  
  @ApiProperty()
  private title: Title;

  @ApiProperty()
  private content: Content;

  @ApiProperty()
  private createdAt: Date;

  @ApiProperty()
  private userId: number;

  @ApiProperty()
  private views: number;

  public checkIsAuthor(userId: number): void {
    if (this.userId !== userId) {
      throw new ForbiddenException(IsNotQuestionWriter.message, IsNotQuestionWriter.name);
    }

    return;
  }

  public update(title: string, content: string): void {
    this.title = new Title(title);
    this.content = new Content(content);
  }

  public increaseViews() {
    this.views += 1;
  }

  public getId() {
    return this.id;
  }
}
