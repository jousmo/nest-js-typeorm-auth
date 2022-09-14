import { registerAs } from '@nestjs/config';

export default registerAs('configuration', () => ({
  apiKey: process.env.API_KEY,
  database: {
    name: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
  },
}));
