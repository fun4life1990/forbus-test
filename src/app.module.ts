import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { mongoConfigFactory } from './config/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserManagementModule } from './modules/user-management/user-management.module';
import { SymbolManagementModule } from './modules/symbol-management/symbol-management.module';
import { SyncSymbolModule } from './modules/sync-symbol/sync-symbol.module';
import { ClientModule } from './modules/client/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: mongoConfigFactory,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserManagementModule,
    SymbolManagementModule,
    SyncSymbolModule,
    ClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
