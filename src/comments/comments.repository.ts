import { User } from "src/users/entity/user.entity";
import { Comment } from "./entity/comment.entity";
import { Question } from "src/questions/entity/question.entity";

export interface CommentsRepository {
  findOneById(id: number): Promise<Comment | null>;
  save(content: string, writer: User, question: Question): Promise<Comment>;
  update(comment: Comment, content: string): Promise<Comment>;
  softDelete(id: number): Promise<void>;
}