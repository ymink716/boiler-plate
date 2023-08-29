import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @MinLength(2)
  @MaxLength(500)
  @IsNotEmpty()
  readonly content: string;
}
