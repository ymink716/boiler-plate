export class Profile {
  constructor(options: {
    email: string;
    nickname: string;
  }) {    
    this.email = options.email;
    this.nickname = options.nickname;
  }
  
  private readonly email: string;

  private readonly nickname: string;
}