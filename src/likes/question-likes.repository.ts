import { QuestionLike } from "./entity/question-like.entity";

export interface QuestionLikesRepository {
  findOneById(id: number): Promise<QuestionLike | null>;
  count(userId: number, questionId: number): Promise<number>;
  save(questionLike: QuestionLike): Promise<QuestionLike>;
  delete(id: number): Promise<void>;
}