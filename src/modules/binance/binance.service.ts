import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WebsocketStream } from '@binance/connector-typescript';
import { BinanceMiniTickerDto } from './dto/binance-mini-ticker.dto';
import { BINANCE_MINI_TICKER_EVENT } from './binance.events';

@Injectable()
export class BinanceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BinanceService.name);
  private client: WebsocketStream;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  onModuleInit(): void {
    this.client = new WebsocketStream({
      callbacks: {
        open: () => this.logger.log('Binance WebSocket connected'),
        close: () => this.logger.log('Binance WebSocket disconnected'),
        message: (data: string) => this.handleMessage(data),
      },
    });
    this.client.subscribe(['!miniTicker@arr']);
  }

  onModuleDestroy(): void {
    this.client?.disconnect();
  }

  private handleMessage(data: string): void {
    try {
      const tickers = JSON.parse(data) as BinanceMiniTickerDto[];
      if (!Array.isArray(tickers)) return;
      this.eventEmitter.emit(BINANCE_MINI_TICKER_EVENT, tickers);
    } catch (err) {
      this.logger.error('Failed to parse Binance message', err);
    }
  }
}
