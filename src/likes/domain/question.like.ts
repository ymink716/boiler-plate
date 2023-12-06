export class QuestionLike {
  constructor(options: {
    id?: number; 
    userId: number,
    questionId: number;
    createdAt?: Date;
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      if (options.createdAt) {
        this.createdAt = options.createdAt;
      }
      this.userId = options.userId;
      this.questionId = options.questionId;
    }
  }

  private id: number;

  private createdAt: Date;

  private userId: number;

  private questionId: number;
}
