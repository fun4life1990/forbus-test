import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';
import { SymbolService } from '../../symbol/services/symbol.service';
import { BinanceMiniTickerDto } from '../../binance/dto/binance-mini-ticker.dto';
import { BINANCE_MINI_TICKER_EVENT } from '../../binance/binance.events';
import { SYNC_SYMBOL_TICKERS_EVENT } from '../sync-symbol.events';

@Injectable()
export class SyncSymbolService {
  private readonly logger = new Logger(SyncSymbolService.name);

  constructor(
    private readonly symbolService: SymbolService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(BINANCE_MINI_TICKER_EVENT)
  async handleMiniTickers(tickers: BinanceMiniTickerDto[]): Promise<void> {
    const symbols = await this.symbolService.findAll();

    const providerSymbols = new Set(symbols.map((s) => s.providerSymbol));

    const filtered = tickers.filter((t) => providerSymbols.has(t.s));

    this.eventEmitter.emit(SYNC_SYMBOL_TICKERS_EVENT, filtered);

    // this.logger.debug(`Filtered ${filtered.length}/${tickers.length} tickers`);
  }
}
