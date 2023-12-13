import { OauthPayload } from "src/common/interface/oauth-payload";
import { Profile } from "./profile";
import { Provider } from "./provider";

export class User {
  constructor(options: {
    id?: number; 
    createdAt?: Date;
    profile: Profile;
    provider: Provider;
  }) {
    if (options) {
      if (options.id) {
        this.id = options.id;
      }
      if (options.createdAt) {
        this.createdAt = options.createdAt;
      }
      this.profile = options.profile;
      this.provider = options.provider;
    }
  }

  private id: number;

  private profile: Profile;

  private provider: Provider;

  private refreshToken: string | null;

  private createdAt: Date;

  private updatedAt: Date;

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