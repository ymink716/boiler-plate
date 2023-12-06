import { ForbiddenException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { Content } from 'src/comments/domain/vo/content';
import { Comment } from '../infrastructure/entity/comment.entity';
import { Question } from 'src/questions/infrastructure/entity/question.entity';

describe('Comment Entity', () => {
  describe("checkIsAuthor()", () => {
    test("댓글 작성자가 아니라면 ForbiddenException이 발생한다.", () => {
      const user1 = { id: 1 } as User;
      const question = { id: 1 } as Question; 
      const comment = new Comment({ 
        content: new Content('content...'), 
        writer: user1, 
        question, 
      });
      const user2 = { id: 2 } as User;

      expect(() => comment.checkIsAuthor(user2)).toThrow(ForbiddenException);
    });
  });
});

