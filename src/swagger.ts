import { INestApplication } from '@nestjs/common';
import process from 'node:process';
import { ENV_DEV, ENV_LOCAL } from './constants';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  if (
    !process.env.NODE_ENV ||
    ![ENV_LOCAL, ENV_DEV].includes(process.env.NODE_ENV)
  ) {
    return;
  }

  const config = new DocumentBuilder()
    .setTitle(`Forbus Test (${process.env.NODE_ENV})`)
    .setDescription('API description')
    .setVersion('0.1')
    .addCookieAuth(
      'access_token',
      { type: 'apiKey', in: 'cookie', name: 'access_token' },
      'cookie-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
