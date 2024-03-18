import { Controller, Get } from '@nestjs/common';
import * as Nano from 'nano';
import * as dotenv from 'dotenv';

dotenv.config();

@Controller()
export class AppController {
  private readonly nano: Nano.DocumentScope<any>;

  constructor() {
    const db = Nano(process.env.COUCHDB_URL);
    this.nano = db.use('pikapi');
  }

  @Get()
  async getHello(): Promise<string> {
    const doc = await this.nano.insert({ foo: 'bar' });
    return `Hello World! Document inserted with ID ${doc}`;
  }
}
