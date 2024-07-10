import { Injectable } from "@nestjs/common";
import { QuestionsRepository } from "../domain/repository/questions.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QuestionEntity } from "./entity/question.entity";
import { Question } from "../domain/question";
import { QuestionMapper } from "./mapper/question.mapper";

@Injectable()
export class TypeormQuestionsRepository implements QuestionsRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async findOneById(id: number): Promise<Question | null> {
    const questionEntity = await this.questionRepository.findOne({ 
      where: { id },
      relations: ['user'],
    });

    if (!questionEntity) {
      return null;
    }

    return QuestionMapper.toDomain(questionEntity);
  }

  async save(question: Question): Promise<Question> {
    const savedQuestionEntity = await this.questionRepository.save(
      QuestionMapper.toPersistence(question)
    );

    return QuestionMapper.toDomain(savedQuestionEntity);
  }

  async find(): Promise<Question[]> {
    const questionEntities = await this.questionRepository.find();
    
    return questionEntities.map((entity) => QuestionMapper.toDomain(entity));
  }

  async softDelete(id: number): Promise<void> {
    await this.questionRepository.softDelete({ id });
  }
}