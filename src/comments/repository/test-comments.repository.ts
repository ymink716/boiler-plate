import { CommentsRepository } from "./comments.repository";
import { Comment } from "../entity/comment.entity";
import Content from "../domain/vo/content";

export class TestCommentsRepository implements CommentsRepository {
  private nextId = 1;
  private comments: Comment[] = [];
  private deletedComments: Comment[] = [];

  async findOneById(id: number) {
    const comment = this.comments.find(comment => comment.id === id);

    if(!comment) {
      return null;
    }

    return comment;
  }

  async save(comment: Comment) {
    comment.id = this.nextId++;
    this.comments.push(comment);

    return comment;
  }

  async findAll() {
    return this.comments;
  }

  async softDelete(id: number) {
    const deletedComment = this.comments.find(comment => comment.id === id);

    if (!deletedComment) {
      return
    }

    this.deletedComments.push(deletedComment);
    this.comments = this.comments.filter(comment => comment.id !== deletedComment.id);
  }

  reset() {
    this.nextId = 1;
    this.comments = [];
    this.deletedComments = [];
  }
}