import { Question } from "src/questions/domain/question";
import { QuestionEntity } from "../entity/question.entity";
import { Title } from "src/questions/domain/title";
import { Content } from "src/questions/domain/content";
import { UserEntity } from "src/users/infrastructure/entity/user.entity";

export class QuestionMapper {
  public static toDomain(questionEntity: QuestionEntity): Question {
    const { id, title, content, views, createdAt, user } = questionEntity;

    const question = new Question({
      id, 
      title: new Title(title), 
      content: new Content(content), 
      views,
      createdAt,
      userId: user.id, 
    });

    return question;
  }

  public static toPersistence(question: Question): QuestionEntity {
    const id = question['id'];
    const title = question['title'];
    const content = question['content'];
    const views = question['views'];
    const userId = question['userId'];
    
    const questionEntity = new QuestionEntity();

    if (id) {
      questionEntity.id = id;
    }
    questionEntity.title = title.getTitle();
    questionEntity.content = content.getContent();
    questionEntity.views = views;
    questionEntity.user = Object.assign(new UserEntity(), { id: userId });

    return questionEntity;
  }
}