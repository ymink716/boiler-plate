import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateQuestionDto {
  @ApiProperty({ description: '제목, 2글자 이상 50글자 이하', example: '질문이 있어요(수정)' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ description: '질문 내용, 2글자 이상 500글자 이하', example: '제가 궁금한 것은...(수정)' })
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  @IsNotEmpty()
  readonly content: string;
}
