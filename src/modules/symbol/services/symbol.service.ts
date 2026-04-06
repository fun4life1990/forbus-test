import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { SymbolEntity, SymbolDocument } from '../schemas/symbol.schema';
import { CreateSymbolDto } from '../dto/create-symbol.dto';
import { UpdateSymbolDto } from '../dto/update-symbol.dto';
import { FilterSymbolsDto } from '../dto/filter-symbols.dto';
import { GetAllSymbolsResponseDto } from '../dto/get-all-symbols-response.dto';
import { NotFoundError } from '../../../error/not-found.error';
import { ConflictError } from '../../../error/conflict.error';

@Injectable()
export class SymbolService {
  constructor(
    @InjectModel(SymbolEntity.name)
    private readonly symbolModel: Model<SymbolEntity>,
  ) {}

  async findAll(): Promise<SymbolDocument[]>;
  async findAll(filter: FilterSymbolsDto): Promise<GetAllSymbolsResponseDto>;
  async findAll(
    filter?: FilterSymbolsDto,
  ): Promise<SymbolDocument[] | GetAllSymbolsResponseDto> {
    if (!filter) {
      return this.symbolModel.find().exec();
    }

    const { page = 1, limit = 20 } = filter;

    const [data, total] = await Promise.all([
      this.symbolModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.symbolModel.countDocuments().exec(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    } as unknown as GetAllSymbolsResponseDto;
  }

  async findById(id: string): Promise<SymbolDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundError('Symbol not found');
    }

    const symbol = await this.symbolModel.findById(id).exec();
    if (!symbol) {
      throw new NotFoundError('Symbol not found');
    }
    return symbol;
  }

  async create(dto: CreateSymbolDto): Promise<SymbolDocument> {
    try {
      return await new this.symbolModel(dto).save();
    } catch (err: unknown) {
      const mongoErr = err as {
        code?: number;
        keyValue?: Record<string, unknown>;
      };
      if (mongoErr.code === 11000) {
        throw new ConflictError(this.buildDuplicateMessage(mongoErr));
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateSymbolDto): Promise<SymbolDocument> {
    if (!isValidObjectId(id)) {
      throw new NotFoundError('Symbol not found');
    }
    let symbol: SymbolDocument | null;
    try {
      symbol = await this.symbolModel
        .findByIdAndUpdate(id, dto, { new: true })
        .exec();
    } catch (err: unknown) {
      const mongoErr = err as {
        code?: number;
        keyValue?: Record<string, unknown>;
      };
      if (mongoErr.code === 11000) {
        throw new ConflictError(this.buildDuplicateMessage(mongoErr));
      }
      throw err;
    }
    if (!symbol) {
      throw new NotFoundError('Symbol not found');
    }
    return symbol;
  }

  async delete(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new NotFoundError('Symbol not found');
    }
    const result = await this.symbolModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundError('Symbol not found');
    }
  }

  private buildDuplicateMessage(err: {
    keyValue?: Record<string, unknown>;
  }): string {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
    return `Symbol with this ${field} already exists`;
  }
}
