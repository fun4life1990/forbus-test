import { Module } from '@nestjs/common';
import { SymbolModule } from '../symbol/symbol.module';
import { SymbolManagementService } from './services/symbol-management.service';
import { SymbolManagementController } from './controllers/symbol-management.controller';

@Module({
  imports: [SymbolModule],
  providers: [SymbolManagementService],
  controllers: [SymbolManagementController],
})
export class SymbolManagementModule {}
