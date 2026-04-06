import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class ClientUser extends User {}

export type ClientUserDocument = HydratedDocument<ClientUser>;
export const ClientUserSchema = SchemaFactory.createForClass(ClientUser);

// 'role' is the discriminatorKey on the base schema — Mongoose forbids
// child schemas from redeclaring it, so we remove it here while keeping
// the TypeScript inheritance intact.
ClientUserSchema.remove('role');
