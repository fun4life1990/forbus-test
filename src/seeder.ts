import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommandFactory } from 'nest-commander';
import { mongoConfigFactory } from './config/mongoose';
import { UserSeedModule } from './modules/user-seed/user-seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ useFactory: mongoConfigFactory }),
    UserSeedModule,
  ],
})
class SeederModule {}

async function bootstrap() {
  await CommandFactory.run(SeederModule, { logger: new Logger() });
}

bootstrap();
