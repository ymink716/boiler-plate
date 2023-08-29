import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "./questions.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "./entity/question.entity";

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
    const savedQuestion = await this.questionRepository.save(question);

    return savedQuestion;
  }

  async findAll(): Promise<Question[]> {
    const questions = await this.questionRepository.find();

    return questions;
  }

  async update(question: Question, title: string, content: string): Promise<Question> {
    question.title = title;
    question.content = content;

    const updatedQuestion = await this.questionRepository.save(question);

    return updatedQuestion;
  }
}