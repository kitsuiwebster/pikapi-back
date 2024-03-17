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

  async createDoc(docType: string, doc: any): Promise<any> {
    try {
      const response = await this.db.insert({
        _id: `${docType}:${doc._id}`,
        type: docType,
        ...doc,
      });
      return response;
    } catch (error) {
      // Handle or throw the error accordingly
      throw new Error('Unable to create document');
    }
  }

  async findDoc(docType: string, field: string, value: string): Promise<any> {
    try {
      const response = await this.db.view('byTypeAndField', 'byField', {
        key: [docType, field, value],
      });
      if (response.rows.length === 0) {
        return undefined;
      }
      return response.rows[0].value;
    } catch (error) {
      // Handle or throw the error accordingly
      throw new Error('Unable to find document');
    }
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
