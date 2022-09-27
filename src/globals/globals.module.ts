import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import configuration from '../configuration';

@Global()
@Module({
  imports: [],
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
  exports: ['PG'],
})
export class GlobalsModule {}
