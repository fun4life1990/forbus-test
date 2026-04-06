import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUser, AdminUserDocument } from '../schemas/admin-user.schema';

@Injectable()
export class AdminUserService {
  constructor(
    @InjectModel(AdminUser.name)
    private readonly adminUserModel: Model<AdminUser>,
  ) {}

  findAll(): Promise<AdminUserDocument[]> {
    return this.adminUserModel.find({ deletedAt: null }).exec();
  }
}
