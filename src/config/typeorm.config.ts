import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { DATABASE_HOST, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_SCHEMA, DATABASE_SYNCHRONIZE, DATABASE_TEST_SCHEMA, DATABASE_USERNAME, NODE_ENV } from "src/common/constants/config.constant";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get<string>(DATABASE_HOST),
      port: this.configService.get<number>(DATABASE_PORT),
      username: this.configService.get<string>(DATABASE_USERNAME),
      password: this.configService.get<string>(DATABASE_PASSWORD),
      database: this.configService.get<string>(NODE_ENV) === 'test' 
        ? this.configService.get<string>(DATABASE_TEST_SCHEMA)
        : this.configService.get<string>(DATABASE_SCHEMA),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: this.configService.get<string>(DATABASE_SYNCHRONIZE) === 'true',
      logging: true,
    };
  }
}