import { Module, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const API_KEY = 'KEY12345';

// Only demonstrative the use of useFactory <= don't implement it like that
@Global()
@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'API_KEY',
      useValue: API_KEY,
    },
    {
      provide: 'USERS_LIST',
      useFactory: async (httpService: HttpService) => {
        const users = await firstValueFrom(
          httpService.get('https://jsonplaceholder.typicode.com/users'),
        );

        return users.data;
      },
      inject: [HttpService],
    },
  ],
  exports: ['API_KEY', 'USERS_LIST'],
})
export class GlobalsModule {}
