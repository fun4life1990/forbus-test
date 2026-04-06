import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import cookieParser from 'cookie-parser';
import { BaseAppExceptionFilter } from './error/base-app-exception.filter';

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.useGlobalFilters(new BaseAppExceptionFilter(new Logger()));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  setupSwagger(app);

  await app.listen(port);
}
bootstrap()
  .then(() => console.log(`Server started on port ${port}`))
  .catch(console.error);
