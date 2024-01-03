import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocumentation {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('익명 질문 앱 API')
      .setDescription('익명 질문 앱 API 문서입니다.')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'access_token',
          description: 'access token을 입력하세요.',
          in: 'header',
        },
        'access_token',
      )
      .build();
  }
}
