import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SymbolEntity, SymbolSchema } from './schemas/symbol.schema';
import { SymbolService } from './services/symbol.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SymbolEntity.name, schema: SymbolSchema },
    ]),
  ],
  providers: [SymbolService],
  exports: [SymbolService],
})
export class SymbolModule {}
