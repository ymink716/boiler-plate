import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsRepository } from './comments.repository';
import { QuestionsService } from 'src/questions/questions.service';

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
}
