import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entity/comment.entity";

@Injectable()
export class TypeormCommentsRepository implements CommentsRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findOneById(id: number): Promise<Comment | null> {
    const comment = await this.commentRepository.findOne({ 
      where: { id },
      relations: ['writer'],
    });

    return comment;
  }

  async save(comment: Comment): Promise<Comment> {
    const savedQuestion = await this.commentRepository.save(comment);

    return savedQuestion;
  }

  async findAll(): Promise<Comment[]> {
    const comments = await this.commentRepository.find();

    return comments;
  }

  async update(comment: Comment, content: string): Promise<Comment> {
    comment.content = content;

    const updatedQuestion = await this.commentRepository.save(comment);

    return updatedQuestion;
  }

  async softDelete(id: number): Promise<void> {
    await this.commentRepository.softDelete({ id });
  }
}