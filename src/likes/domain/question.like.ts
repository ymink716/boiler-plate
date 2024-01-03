export class QuestionLike {
  constructor(options: {
    id?: number; 
    userId: number,
    questionId: number;
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      this.userId = options.userId;
      this.questionId = options.questionId;
    }
  }

  private id: number;

  private userId: number;

  private questionId: number;
}
