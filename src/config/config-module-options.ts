import { ConfigModuleOptions } from "@nestjs/config";

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath:
    process.env.NODE_ENV === 'production'
      ? './env/.production.env'
      : process.env.NODE_ENV === 'stage'
      ? './env/.stage.env'
      : './env/.development.env',
  expandVariables: true,
}