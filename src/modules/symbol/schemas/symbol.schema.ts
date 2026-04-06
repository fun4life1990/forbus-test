import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SymbolDocument = HydratedDocument<SymbolEntity>;

@Schema({ timestamps: true, collection: 'symbols' })
export class SymbolEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, default: false })
  isPublished: boolean;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, unique: true })
  providerSymbol: string;
}

export const SymbolSchema = SchemaFactory.createForClass(SymbolEntity);
