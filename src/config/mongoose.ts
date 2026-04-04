import { MongooseModuleOptions } from '@nestjs/mongoose';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

const config: MongooseModuleOptions = {
  uri: `mongodb://localhost:27017/${process.env.DB_DATABASE}`,
  user: process.env.DB_USERNAME,
  pass: process.env.DB_PASSWORD,
  authSource: 'admin',
};

export const mongoConfigFactory = (): MongooseModuleOptions => config;
