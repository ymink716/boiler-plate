import { IsNotEmpty, IsString, MaxLength, MinLength, IsNumber } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  @IsNotEmpty()
  readonly content: string;

  @IsNumber()
  @IsNotEmpty()
  readonly questionId: number;
}
