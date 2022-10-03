import { registerAs } from '@nestjs/config';

const environment = process.env.NODE_ENV;

export default registerAs('configuration', () => ({
  environment,
  postgres: {
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
  },
  postgresTypeOrm: {
    type: process.env.DB_DIALECT,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    synchronize: environment !== 'production',
    autoLoadEntities: environment !== 'production',
  },
  apiKey: process.env.API_KEY,
}));
