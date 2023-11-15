import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './repository/comments.repository';
import { QuestionsService } from 'src/questions/questions.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentNotFound } from 'src/common/exception/error-types';
import { Comment } from './entity/comment.entity';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';
import Content from './vo/content';
import { CommentorCheckService } from './domain/writer-check.service';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
    private readonly questionsService: QuestionsService,
    private readonly commentorCheckService: CommentorCheckService,
  ) {}

  public async writeComment(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const question = await this.questionsService.getQuestion(createCommentDto.questionId);
    const content = new Content(createCommentDto.content);
    let comment = new Comment({ content, writer: user, question });

    comment = await this.commentsRepository.save(comment);

    return comment;
  }

  public async editComment(updateCommentDto: UpdateCommentDto, commentId: number, user: User): Promise<Comment> {
    const content = new Content(updateCommentDto.content);
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    this.commentorCheckService.checkWriter(comment, user);

    comment.content = content;
    const updatedComment = await this.commentsRepository.save(comment);

    return updatedComment;
  }

  public async deleteComment(commentId: number, user: User): Promise<void> {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }
    
    this.commentorCheckService.checkWriter(comment, user);

    await this.commentsRepository.softDelete(commentId);
  }

  async getComment(commentId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneById(commentId);
    
    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    return comment;
  }
}



