import { Question } from "./entity/question.entity";

export interface QuestionsRepository {
  findOneById(id: number): Promise<Question | null>;
  save(question: Question): Promise<Question>;
  findAll(): Promise<Question[]>;
  update(question: Question, title: string, content: string): Promise<Question>;
  softDelete(id: number): Promise<void>;
}