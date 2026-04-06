import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

@Schema()
export class AdminUser extends User {}

export type AdminUserDocument = HydratedDocument<AdminUser>;
export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);

// 'role' is the discriminatorKey on the base schema — Mongoose forbids
// child schemas from redeclaring it, so we remove it here while keeping
// the TypeScript inheritance intact.
AdminUserSchema.remove('role');
