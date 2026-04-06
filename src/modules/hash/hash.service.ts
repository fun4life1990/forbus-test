import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  async hash(data: string): Promise<string> {
    // hash password with bcrypt
    const saltOrRounds = 10;
    if (Buffer.byteLength(data) > 72) {
      throw new Error('hashing data should be shorter');
    }

    return await bcrypt.hash(data, saltOrRounds);
  }

  async compareHashed(input: string, hash: string): Promise<boolean> {
    if (Buffer.byteLength(input) > 72) {
      throw new Error('hashing data should be shorter');
    }

    return await bcrypt.compare(input, hash);
  }
}
