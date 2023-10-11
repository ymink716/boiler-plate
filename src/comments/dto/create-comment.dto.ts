import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '답변 내용, 2글자 이상 255자 이하', example: '저도 추천!!' })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsNotEmpty()
  readonly content: string;

  @ApiProperty({ description: '질문글 ID', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  readonly questionId: number;
}
