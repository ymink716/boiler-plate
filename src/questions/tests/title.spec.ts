import { BadRequestException } from '@nestjs/common';
import { Title } from '../domain/vo/title';

describe('Question.title', () => {
  test.each([['t'], ['0'.repeat(51)]])(
    '제목이 2글자 미만, 50글자를 초과하면 BadRequestException이 발생한다.',
    (content) => {
      expect(() => new Title(content)).toThrow(BadRequestException);
    },
  );

  test.each([['tt'], ['0'.repeat(50)]])(
    '제목이 2글자 미만, 50글자를 초과하지 않으면 유효성 검사를 통과한다.',
    (content) => {
      const result = new Title(content);

      expect(result.getTitle()).toEqual(content);
    },
  );
});

