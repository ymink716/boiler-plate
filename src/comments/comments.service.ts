import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENTS_REPOSITORY')
    private readonly commentsRepository: CommentsRepository
  ) {}

  async writeComment(createCommentDto: CreateCommentDto, user: User) {
    const { content, postId } = createCommentDto;

    
  }
}
