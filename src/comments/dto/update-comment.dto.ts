import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({ description: '수정할 답변 내용, 2글자 이상 255자 이하', example: '저도 추천!!(수정)' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsNotEmpty()
  readonly content: string;
}