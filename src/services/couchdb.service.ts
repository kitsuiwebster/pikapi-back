import { Injectable } from '@nestjs/common';
import * as Nano from 'nano';

@Injectable()
export class CouchDbService {
  private readonly db: Nano.DocumentScope<any>;

  constructor() {
    const nano = Nano({
      url: process.env.COUCHDB_URL,
      requestDefaults: {
        auth: {
          username: process.env.COUCHDB_USER,
          password: process.env.COUCHDB_PASSWORD,
        },
      },
    });

    this.db = nano.db.use(process.env.COUCHDB_DBNAME);
  }

  async findAll(): Promise<any[]> {
    try {
      const result = await this.db.list({ include_docs: true });
      return result.rows.map((row) => row.doc);
    } catch (error) {
      // Handle or throw the error accordingly
      throw new Error('Unable to fetch documents');
    }
  }
}
