import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';

const configurationService = new ConfigService();

export default new DataSource({
  type: configurationService.get('DB_DIALECT'),
  host: configurationService.get('DB_HOST'),
  port: Number(configurationService.get('DB_PORT')),
  username: configurationService.get('DB_USER'),
  password: configurationService.get('DB_PASSWORD'),
  database: configurationService.get('DB_NAME'),
  synchronize: false,
  logging: true,
  entities: ['src/*/*/*.entity.ts'],
  migrations: ['src/db/migrations/*.ts'],
} as DataSourceOptions);
