import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CommentsRepository } from '../domain/repository/comments.repository';
import { QuestionsService } from 'src/questions/application/questions.service';
import { CommentNotFound } from 'src/common/exception/error-types';
import { Comment } from '../domain/comment';
import { COMMENTS_QUERY_REPOSITORY, COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Content } from '../domain/content';
import { TypeormCommentQueryRepository } from '../infrastructure/typeorm-comments-query-repository';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
    @Inject(COMMENTS_QUERY_REPOSITORY)
    private readonly commentQueryRepository: TypeormCommentQueryRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  public async writeComment(questionId: number, content: string, userId: number): Promise<Comment> {
    await this.questionsService.getQuestion(questionId);

    const comment = new Comment({ 
      content: new Content(content),
      questionId,
      userId,
    });

    return await this.commentsRepository.save(comment);
  }

  public async editComment(commentId: number, content: string, userId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    comment.checkIsAuthor(userId);
    comment.editContent(content);

    return await this.commentsRepository.save(comment);
  }

  public async deleteComment(commentId: number, userId: number): Promise<void> {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }
    
    comment.checkIsAuthor(userId);
    await this.commentsRepository.softDelete(commentId);
  }

  public async getComment(commentId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneById(commentId);
    
    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    return comment;
  }

  public async getCommentsByQuestion(questionId: number): Promise<Comment[]> {
    throw new Error('Method not implemented.');
  }
}