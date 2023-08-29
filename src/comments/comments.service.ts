import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { QuestionsService } from 'src/questions/questions.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentNotFound, IsNotCommentor } from 'src/common/exception/error-types';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENTS_REPOSITORY')
    private readonly commentsRepository: CommentsRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  async writeComment(createCommentDto: CreateCommentDto, user: User) {
    const { content, questionId } = createCommentDto;

    const question = await this.questionsService.getQuestion(questionId);

    const comment = await this.commentsRepository.save(content, user, question);

    return comment;
  }

  async editComment(updateCommentDto: UpdateCommentDto, commentId: number, user: User) {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    const writerId = comment.writer.id;
    const userId = user.id;

    this.isWriter(writerId, userId);

    const { content } = updateCommentDto;

    const updatedComment = await this.commentsRepository.update(comment, content);

    return updatedComment;
  }

  async deleteComment(commentId: number, user: User) {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }
    const writerId = comment.writer.id;
    const userId = user.id;
    
    this.isWriter(writerId, userId);

    await this.commentsRepository.softDelete(commentId);
  }

  isWriter(writerId: number, userId: number) {
    const isWriter = (writerId === userId);

    if (!isWriter) {
      throw new ForbiddenException(IsNotCommentor.message, IsNotCommentor.name);
    }
  }
}



