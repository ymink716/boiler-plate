import { InjectRepository } from "@nestjs/typeorm";
import { CommentEntity } from "./entity/comment.entity";
import { Repository } from "typeorm";


export class TypeormCommentQueryRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}
  
  async findByQuestionId(questionId: number): Promise<CommentEntity[]> {
    const commentEntities = this.commentRepository
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.user', 'user')
    .leftJoinAndSelect('comment.question', 'question')
    .leftJoinAndSelect('comment.likes', 'like')
    .select([
      'comment.id',
      'comment.content',
      'comment.createdAt',
      'user.id',
      'user.nickname',
      'question.id',
      'like.id',
      'like.userId',
    ])
    .where('question.id = :questionId', { questionId })
    .orderBy('comment.createdAt', 'DESC')
    .getMany();

    return commentEntities;
  }
}