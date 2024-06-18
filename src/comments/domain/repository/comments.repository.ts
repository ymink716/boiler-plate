import { Comment } from '../comment';

export interface CommentsRepository {
  findOneById(id: number): Promise<Comment | null>;
  save(comment: Comment): Promise<Comment>;
  softDelete(id: number): Promise<void>;
  findByQuestionId(questionId: number): Promise<Comment[]>;
}