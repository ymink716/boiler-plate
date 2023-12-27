import { ConfigModuleOptions } from "@nestjs/config";

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath:
    process.env.NODE_ENV === 'production'
      ? '.production.env'
      : process.env.NODE_ENV === 'development'
      ? '.development.env'
      : '.local.env',
  expandVariables: true,
}