import { User } from "src/users/entity/user.entity";
import { QuestionLike } from "../entity/question-like.entity";
import { Question } from "src/questions/entity/question.entity";

export interface QuestionLikesRepository {
  count(userId: number, questionId: number): Promise<number>;
  save(questionLike: QuestionLike): Promise<QuestionLike>;
  findByUserIdAndQeustionId(userId: number, questionId: number): Promise<QuestionLike[]>;
  delete(questionLikeId: number): Promise<void>;
}