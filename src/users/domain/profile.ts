import { BadRequestException } from "@nestjs/common";
import { InvalidUserNickname } from "src/common/exception/error-types";

const MIN_NICKNAME_LENGTH = 2;
const MAX_NICKNAME_LENGTH = 10;

export class Profile {
  constructor(options: {
    email: string;
    nickname: string;
    picture: string;
  }) {
    if (this.isInvalidNickName(options.nickname)) {
      throw new BadRequestException(InvalidUserNickname.message, InvalidUserNickname.name);
    }
    
    this.email = options.email;
    this.nickname = options.nickname;
    this.picture = options.picture;
  }
  
  private readonly email: string;

  private nickname: string;

  private picture: string;

  private isInvalidNickName(nickname: string): boolean {
    return nickname.length < MIN_NICKNAME_LENGTH || nickname.length > MAX_NICKNAME_LENGTH;
  }
}