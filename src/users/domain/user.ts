import { UserProvider } from "src/common/enums/user-provider.enum";

export class User {
  constructor(options: {
    id?: number; 
    createdAt?: Date;
    email: string;
    provider: UserProvider;
    providerId: string;
    name: string;
    picture: string;
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      if (options.createdAt) {
        this.createdAt = options.createdAt;
      }
      this.email = options.email;
      this.provider = options.provider;
      this.providerId = options.providerId;
      this.name = options.name;
      this.picture = options.picture;
    }
  }

  private id: number;

  private email: string;

  private provider: UserProvider;

  private providerId: string;

  private name: string;

  private picture: string;

  private refreshToken: string | null;

  private createdAt: Date;

  private updatedAt: Date;

  private questions: number[];

  private comments: number[];

  private questionLikes: number[];

  private bookmarks: number[];

  public updateRefreshToken(token: string | null): void {
    this.refreshToken = token;
  }

  public isMatchedRefreshToken(token: string): boolean {
    return this.refreshToken === token;
  }

  public getId(): number {
    return this.id;
  }
}