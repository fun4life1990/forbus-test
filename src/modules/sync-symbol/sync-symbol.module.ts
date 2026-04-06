import { Module } from '@nestjs/common';
import { BinanceModule } from '../binance/binance.module';
import { SymbolModule } from '../symbol/symbol.module';
import { SyncSymbolService } from './services/sync-symbol.service';

@Module({
  imports: [BinanceModule, SymbolModule],
  providers: [SyncSymbolService],
})
export class SyncSymbolModule {}
