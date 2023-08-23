import { UserProvider } from "../enums/user-provider.enum";

export interface OauthPayload {
  provider: UserProvider;
  providerId: string;
  email: string;
  name: string;
  picture: string;
}