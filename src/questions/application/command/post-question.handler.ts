import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable } from "@nestjs/common";
import { QUESTIONS_REPOSITORY } from "src/common/constants/tokens.constant";
import { QuestionsRepository } from "src/questions/domain/repository/questions.repository";
import { PostQuestionCommand } from "./post-question.command";
import { Question } from "src/questions/domain/question";
import { Title } from "src/questions/domain/title";
import { Content } from "src/questions/domain/content";

@Injectable()
@CommandHandler(PostQuestionCommand)
export class PostQuestionHandler implements ICommandHandler<PostQuestionCommand> {
  constructor(
    @Inject(QUESTIONS_REPOSITORY)
    private readonly questionsRepository: QuestionsRepository,
  ) {}
  
  async execute(command: PostQuestionCommand): Promise<Question> {
    console.log('dd')
    const { title, content, userId } = command;
    
    const question = new Question({ 
      title: new Title(title), 
      content: new Content(content), 
      userId: userId,
    });
    
    return this.questionsRepository.save(question);
  }
}