import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import cookieParser from 'cookie-parser';

const port = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  setupSwagger(app);

  await app.listen(port);
}
bootstrap()
  .then(() => console.log(`Server started on port ${port}`))
  .catch(console.error);
