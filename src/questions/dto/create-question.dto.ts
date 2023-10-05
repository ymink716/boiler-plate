import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({ description: '제목', example: '질문이 있어요' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty({ description: '질문 내용', example: '제가 궁금한 것은...' })
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  @IsNotEmpty()
  readonly content: string;
}
