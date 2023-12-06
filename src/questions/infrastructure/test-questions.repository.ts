// import { Content } from "../domain/vo/content";
// import { Title } from "../domain/vo/title";
// import { Question } from "./entity/question.entity";
// import { QuestionsRepository } from "../domain/repository/questions.repository";

// export class TestQuestionsRepository implements QuestionsRepository {
//   private nextId = 1;
//   private questions: Question[] = [];
//   private deletedQeustions: Question[] = [];

//   async findOneById(id: number) {
//     const question = this.questions.find(question => question.id === id);

//     if(!question) {
//       return null;
//     }

//     return question;
//   }

//   async save(question: Question) {
//     question.id = this.nextId++;
//     this.questions.push(question);

//     return question;
//   }

//   async findAll() {
//     return this.questions;
//   }

//   async update(question: Question, title: string, content: string) {
//     question.title = new Title(title);
//     question.content = new Content(content);

//     return question;
//   }

//   async softDelete(id: number) {
//     const deletedQuestion = this.questions.find(question => question.id === id);

//     if (!deletedQuestion) {
//       return
//     }

//     this.deletedQeustions.push(deletedQuestion);
//     this.questions = this.questions.filter(question => question.id !== deletedQuestion.id);
//   }

//   reset() {
//     this.nextId = 1;
//     this.questions = [];
//     this.deletedQeustions = [];
//   }
// }