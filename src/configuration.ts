import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  postgres: {
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    host: process.env.DB_HOST,
  },
}));
