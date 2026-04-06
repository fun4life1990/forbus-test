import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { Server, Socket } from 'socket.io';

import { WebSocketAuthGuard } from '../../auth/guards/websocket-auth.guard';
import { BinanceMiniTickerDto } from '../../binance/dto/binance-mini-ticker.dto';
import { SYNC_SYMBOL_TICKERS_EVENT } from '../../sync-symbol/sync-symbol.events';
import { DISCONNECT_CLIENT_EVENT } from '../../user-management/user-management.events';

const PRICE_UPDATES_ROOM = 'price-updates';

@WebSocketGateway({ cors: { origin: true, credentials: true } })
@UseGuards(WebSocketAuthGuard)
export class ClientGateway {
  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket): void {
    void client.join(PRICE_UPDATES_ROOM);
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket): void {
    void client.leave(PRICE_UPDATES_ROOM);
  }

  @OnEvent(SYNC_SYMBOL_TICKERS_EVENT)
  handleTickers(tickers: BinanceMiniTickerDto[]): void {
    this.server.to(PRICE_UPDATES_ROOM).emit('priceUpdate', tickers);
  }

  @OnEvent(DISCONNECT_CLIENT_EVENT)
  handleDisconnectClient(userId: string): void {
    this.server.sockets.sockets.forEach((socket) => {
      if ((socket.data as { user?: { id: string } }).user?.id === userId) {
        socket.disconnect(true);
      }
    });
  }
}
