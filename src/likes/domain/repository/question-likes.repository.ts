import { QuestionLike } from "../question.like";

export interface QuestionLikesRepository {
  count(userId: number, questionId: number): Promise<number>;
  save(questionLike: QuestionLike): Promise<QuestionLike>;
  findByUserIdAndQeustionId(userId: number, questionId: number): Promise<QuestionLike[]>;
  remove(questionLikes: QuestionLike[]): Promise<void>;
}