import { Inject, Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { QuestionsService } from 'src/questions/questions.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentNotFound, InvalidCommentContent, IsNotCommentor } from 'src/common/exception/error-types';
import { Comment } from './entity/comment.entity';
import { COMMENTS_REPOSITORY } from 'src/common/constants/tokens.constant';

@Injectable()
export class CommentsService {
  constructor(
    @Inject(COMMENTS_REPOSITORY)
    private readonly commentsRepository: CommentsRepository,
    private readonly questionsService: QuestionsService,
  ) {}

  async writeComment(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const { content, questionId } = createCommentDto;

    if (content.length < 2 || content.length > 255) {
      throw new BadRequestException(InvalidCommentContent.message, InvalidCommentContent.name);
    }

    const question = await this.questionsService.getQuestion(questionId);
    const comment = await this.commentsRepository.save(content, user, question);

    return comment;
  }

  async editComment(updateCommentDto: UpdateCommentDto, commentId: number, user: User): Promise<Comment> {
    const { content } = updateCommentDto;

    if (content.length < 2 || content.length > 255) {
      throw new BadRequestException(InvalidCommentContent.message, InvalidCommentContent.name);
    }

    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    const writerId = comment.writer.id;
    const userId = user.id;

    this.isWriter(writerId, userId);

    const updatedComment = await this.commentsRepository.update(comment, content);

    return updatedComment;
  }

  async deleteComment(commentId: number, user: User): Promise<void> {
    const comment = await this.commentsRepository.findOneById(commentId);

    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }
    
    const writerId = comment.writer.id;
    const userId = user.id;
    
    this.isWriter(writerId, userId);

    await this.commentsRepository.softDelete(commentId);
  }

  isWriter(writerId: number, userId: number): void {
    const isWriter = (writerId === userId);

    if (!isWriter) {
      throw new ForbiddenException(IsNotCommentor.message, IsNotCommentor.name);
    }
  }

  async getComment(commentId: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOneById(commentId);
    
    if (!comment) {
      throw new NotFoundException(CommentNotFound.message, CommentNotFound.name);
    }

    return comment;
  }
}



