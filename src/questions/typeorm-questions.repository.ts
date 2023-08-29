import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "./questions.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "./entity/question.entity";

@Injectable()
export class TypeormQuestionsRepository implements QuestionsRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionsRepository: Repository<Question>,
  ) {}

  async findOneById(id: number): Promise<Question | null> {
    const question = await this.questionsRepository.findOne({ where: { id }});

    return question;
  }

  async save(question: Question): Promise<Question> {
    const savedQuestion = await this.questionsRepository.save(question);

    return savedQuestion;
  }
}