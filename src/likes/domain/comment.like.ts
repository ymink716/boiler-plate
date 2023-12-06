export class CommentLike {
  constructor(options: {
    id?: number; 
    userId: number;
    commentId: number;
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
      this.commentId = options.commentId;
    }
  }

  private id: number;

  private createdAt: Date;

  private userId: number;

  private commentId: number;
}
