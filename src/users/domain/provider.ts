import { UserProvider } from "src/common/enums/user-provider.enum";

export class Provider {
  constructor(options: {
    providerType: UserProvider;
    providerId: string;
  }) {
    this.providerType = options.providerType;
    this.providerId = options.providerId;
  }

  private readonly providerType: UserProvider;

  private readonly providerId: string;
}