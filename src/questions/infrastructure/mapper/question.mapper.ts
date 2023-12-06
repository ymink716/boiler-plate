import { Question } from "src/questions/domain/question";
import { QuestionEntity } from "../entity/question.entity";

export class QuestionMapper {
  public static toDomain(questionEntity: QuestionEntity): Question {
    const { id, title, content, createdAt, writer, comments, likes, bookmarks } = questionEntity;

    const question = new Question({
      id, title, content, createdAt, writer, comments, likes, bookmarks,
    });

    return question;
  }

  public static toPersistence(question: Question): QuestionEntity {
    const id = question['id'];
    const title = question['title'];
    const content = question['content'];
    const writer = question['writer'];
    const comments = question['comments'];
    const likes = question['likes'];
    const bookmarks = question['bookmarks'];

    const questionEntity = new QuestionEntity({
      title, content, writer, comments, likes, bookmarks
    });

    if (id) {
      questionEntity.id = id;
    }

    return questionEntity;
  }
}