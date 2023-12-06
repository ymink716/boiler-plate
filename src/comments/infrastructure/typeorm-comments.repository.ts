import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "../domain/repository/comments.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentEntity } from "./entity/comment.entity";
import { Comment } from '../domain/comment';
import { CommentMapper } from "./mapper/comment.mapper";

@Injectable()
export class TypeormCommentsRepository implements CommentsRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  public async findOneById(id: number): Promise<Comment | null> {
    const commentEntity = await this.commentRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });

    if (!commentEntity) {
      return null;
    }

    return CommentMapper.toDomain(commentEntity);
  }

  public async save(comment: Comment): Promise<Comment> {
    const savedCommentEntity = await this.commentRepository.save(
      CommentMapper.toPersistence(comment),
    );

    return CommentMapper.toDomain(savedCommentEntity);
  }

  public async softDelete(id: number): Promise<void> {
    await this.commentRepository.softDelete({ id });
  }
}