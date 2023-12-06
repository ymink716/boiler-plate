import { Question } from 'src/questions/domain/question';
import { User } from 'src/users/entity/user.entity';

export class QuestionLike {
  constructor(options: {
    user: User,
    question: Question
  }) {
    if (options) {
      this.user = options.user;
      this.question = options.question;
    }
  }

  private id: number;

  private createdAt: Date;

  private user: User;

  private question: Question;
}
