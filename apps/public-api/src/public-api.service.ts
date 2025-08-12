import { Injectable } from '@nestjs/common';

@Injectable()
export class PublicApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
