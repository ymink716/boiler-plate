import { ConfigModule } from "@nestjs/config";

export const configModuleConfig = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: './env/.development.env',
})