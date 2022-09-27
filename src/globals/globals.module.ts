import { Module, Global } from '@nestjs/common';
import { ConfigType, ConfigModule } from '@nestjs/config';
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from '../configuration';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configurationService: ConfigType<typeof configuration>) => {
        const { postgresTypeOrm } = configurationService;
        return Object.assign({ ...postgresTypeOrm });
      },
      inject: [configuration.KEY],
    }),
  ],
  providers: [
    {
      provide: 'PG',
      useFactory: async (
        configurationService: ConfigType<typeof configuration>,
      ) => {
        const { postgres } = configurationService;
        const client = new Client(postgres);
        await client.connect();
        console.log('Connected Database');
        return client;
      },
      inject: [configuration.KEY],
    },
  ],
  exports: ['PG', TypeOrmModule],
})
export class GlobalsModule {}
