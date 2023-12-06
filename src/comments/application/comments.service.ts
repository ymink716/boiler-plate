import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/infrastructure/entity/user.entity';
import { CreateCommentDto } from '../presentation/dto/create-comment.dto';
import { CommentsRepository } from '../domain/repository/comments.repository';
import { QuestionsService } from 'src/questions/application/questions.service';
import { UpdateCommentDto } from '../presentation/dto/update-comment.dto';
import { CommentNotFound } from 'src/common/exception/error-types';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';
import { Content } from '../domain/vo/content';
import { Comment } from '../domain/comment';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  public async writeComment(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const { questionId, content } = createCommentDto;

    const question = await this.questionsService.getQuestion(questionId);

    let comment = new Comment({ 
      content: new Content(content), 
      userId: user.id, 
      questionId: question.getId(),
    });

    comment = await this.commentsRepository.save(comment);
    return comment;
  }

  public async editComment(updateCommentDto: UpdateCommentDto, commentId: number, user: User): Promise<Comment> {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    comment.checkIsAuthor(user);

    const { content } = updateCommentDto;
    comment.editContent(content);

    const updatedComment = await this.commentsRepository.save(comment);
    return updatedComment;
  }

  public async deleteComment(commentId: number, user: User): Promise<void> {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }
    
    comment.checkIsAuthor(user);

    await this.commentsRepository.softDelete(commentId);
  }

  public async getComment(commentId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneById(commentId);
    
    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    return comment;
  }
}



