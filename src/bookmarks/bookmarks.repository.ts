import { User } from "src/users/entity/user.entity";
import { Bookmark } from "./entity/bookmark.entity";
import { Question } from "src/questions/entity/question.entity";

export interface BookmarksRepository {
  countByUserIdAndQuestionId(userId: number, questionId: number): Promise<number>;
  save(user: User, question: Question): Promise<Bookmark>;
  findByUserIdAndQuestionId(userId: number, questionId: number): Promise<Bookmark[]>;
  delete(bookmarkId: number): Promise<void>;
}