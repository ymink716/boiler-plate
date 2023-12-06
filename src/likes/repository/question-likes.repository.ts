import { QuestionLike } from "../infrastructure/entity/question-like.entity";

export interface QuestionLikesRepository {
  count(userId: number, questionId: number): Promise<number>;
  save(questionLike: QuestionLike): Promise<QuestionLike>;
  findByUserIdAndQeustionId(userId: number, questionId: number): Promise<QuestionLike[]>;
  remove(questionLikes: QuestionLike[]): Promise<void>;
}