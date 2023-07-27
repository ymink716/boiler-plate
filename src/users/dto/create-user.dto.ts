import { IsEmail, IsNotEmpty, IsString, Max, Min, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @Length(2, 10)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}