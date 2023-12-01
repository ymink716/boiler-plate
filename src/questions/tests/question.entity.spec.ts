import { User } from "src/users/entity/user.entity";
import { Question } from "../entity/question.entity";
import { Title } from "../domain/vo/title";
import { Content } from "../domain/vo/content";
import { ForbiddenException } from "@nestjs/common";

describe("Question Entity", () => {
  describe("checkIsAuthor()", () => {
    test("질문 작성자가 아니라면 ForbiddenException이 발생한다.", () => {
      const user1 = { id: 1 } as User;
      const user2 = { id: 2 } as User;
      const question = new Question({
        title: new Title("test"),
        content: new Content("content..."),
        writer: user1,
      });

      expect(() => question.checkIsAuthor(user2)).toThrow(ForbiddenException);
    });
  });
});



    // test('작성자가 아니라면 ForbiddenException이 발생한다.', async () => {
    //   const user2 = { id: 2 } as User;
    //   const question = new Question({
    //     title: "test",
    //     content: "test content...",
    //     writer: user,
    //   });

    //   const savedQeustion = await questionsRepository.save(question);

    //   await expect(
    //     questionsService.updateQuestion(savedQeustion.id, user2, updateQuestionDto)
    //   ).rejects.toThrow(ForbiddenException);
    // });