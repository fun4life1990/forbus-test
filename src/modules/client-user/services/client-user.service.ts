import { Injectable } from '@nestjs/common';
import { ConflictError } from '../../../error/conflict.error';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from '../../hash/hash.service';
import { UserService } from '../../user/services/user.service';
import { ClientUser, ClientUserDocument } from '../schemas/client-user.schema';

@Injectable()
export class ClientUserService {
  constructor(
    @InjectModel(ClientUser.name)
    private readonly clientUserModel: Model<ClientUser>,
    private readonly hashService: HashService,
    private readonly userService: UserService,
  ) {}

  findAll(): Promise<ClientUserDocument[]> {
    return this.clientUserModel.find({ deletedAt: null }).exec();
  }

  async create(dto: {
    email: string;
    password: string;
  }): Promise<ClientUserDocument> {
    const existing = await this.userService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictError('User with this email already exists');
    }

    const hashedPassword = await this.hashService.hash(dto.password);
    return new this.clientUserModel({
      email: dto.email,
      password: hashedPassword,
    }).save();
  }

  async deleteById(id: string): Promise<void> {
    await this.clientUserModel
      .findByIdAndUpdate(id, { deletedAt: new Date() })
      .exec();
  }
}
