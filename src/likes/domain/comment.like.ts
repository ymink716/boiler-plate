export class CommentLike {
  constructor(options: {
    id?: number; 
    userId: number;
    commentId: number;
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      this.userId = options.userId;
      this.commentId = options.commentId;
    }
  }

  private id: number;

  private userId: number;

  private commentId: number;
}
