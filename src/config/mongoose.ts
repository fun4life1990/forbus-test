import { MongooseModuleOptions } from '@nestjs/mongoose';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: MongooseModuleOptions = {
  uri: process.env.DATABASE_URL,
};

export const mongoConfigFactory = (): MongooseModuleOptions => config;
