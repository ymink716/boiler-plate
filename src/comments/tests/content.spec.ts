import { BadRequestException } from '@nestjs/common';
import { Content } from 'src/comments/domain/content';

describe('Comment.content', () => {
  test.each([['t'], ['0'.repeat(256)]])(
    '내용이 2글자 미만, 255글자를 초과하면 BadRequestException이 발생한다.',
    (content) => {
      expect(() => new Content(content)).toThrow(BadRequestException);
    },
  );

  test.each([['tt'], ['0'.repeat(255)]])(
    '내용이 2글자 미만, 255글자를 초과하지 않으면 유효성 검사를 통과한다.',
    (content) => {
      const result = new Content(content);

      expect(result.getContent()).toEqual(content);
    },
  );
});

