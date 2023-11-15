import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "../entity/comment.entity";

@Injectable()
export class TypeormCommentsRepository implements CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  public async findOneById(id: number): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({ 
      where: { id },
      relations: ['writer'],
    });

    return comment;
  }

  public async save(comment: Comment): Promise<Comment> {
    return await this.commentRepository.save(comment);
  }

  public async softDelete(id: number): Promise<void> {
    await this.commentRepository.softDelete({ id });
  }
}