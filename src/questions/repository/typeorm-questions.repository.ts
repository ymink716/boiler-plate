import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "./questions.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "../entity/question.entity";

@Injectable()
export class TypeormQuestionsRepository implements QuestionsRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async findOneById(id: number): Promise<Question | null> {
    const question = await this.questionRepository.findOne({ 
      where: { id },
      relations: ['writer'],
    });

    return question;
  }

  async save(question: Question): Promise<Question> {
    return await this.questionRepository.save(question);
  }

  async findAll(): Promise<Question[]> {
    return await this.questionRepository.find();
  }

  async softDelete(id: number): Promise<void> {
    await this.questionRepository.softDelete({ id });
  }
}