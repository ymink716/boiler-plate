import { Injectable } from "@nestjs/common";
import { CommentsRepository } from "./comments.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entity/comment.entity";
import { User } from "src/users/entity/user.entity";
import { Question } from "src/questions/entity/question.entity";

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

  async save(
    content: string, writer: User, question: Question
  ): Promise<Comment> {
    return await this.commentRepository.save(new Comment({
      content, writer, question
    }));
  }

  async findAll(): Promise<Comment[]> {
    const comments = await this.commentRepository.find();

    return comments;
  }

  async update(comment: Comment, content: string): Promise<Comment> {
    comment.content = content;

    const updatedComment = await this.commentRepository.save(comment);

    return updatedComment;
  }

  async softDelete(id: number): Promise<void> {
    await this.commentRepository.softDelete({ id });
  }
}