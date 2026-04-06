import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfigFactory } from './config/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { SymbolManagementModule } from './modules/symbol-management/symbol-management.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: mongoConfigFactory,
    }),
    AuthModule,
    UserManagementModule,
    SymbolManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
