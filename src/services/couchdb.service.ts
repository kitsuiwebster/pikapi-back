import { Injectable } from '@nestjs/common';
import * as Nano from 'nano';
import * as dotenv from 'dotenv';

dotenv.config();


@Injectable()
export class CouchDbService {
  private readonly nano: Nano.DocumentScope<any>;

  constructor() {
    const db = Nano(process.env.COUCHDB_URL);

    this.nano = db.use('pikapi');
  }


  async createDoc(docType: string, doc: any): Promise<any> {
    try {
      const response = await this.nano.insert({
        _id: `${docType}:${doc._id}`,
        type: docType,
        ...doc,
      });
      console.log('Document created in CouchDB:', response); // Log the CouchDB response
      return response;
    } catch (error) {
      console.error('Error creating CouchDB document:', error); // Log the CouchDB error
      throw error; // Re-throw to be handled by the caller
    }
  }
  
  

  async findDoc(docType: string, field: string, value: string): Promise<any> {
    try {
      // Here you should reference the correct design document and view name
      // Change 'designDoc' to 'user_queries' and 'byField' to 'byUsernameOrEmail'
      const response = await this.nano.view('user_queries', 'byUsernameOrEmail', {
        key: [docType, field, value],
        include_docs: true
      });
      if (response.rows.length === 0) {
        return undefined;
      }
      return response.rows[0].doc; // Use .doc to get the actual document
    } catch (error) {
      console.error('Error finding document in CouchDB:', error);
      throw error;
    }
  }
  

  async findAll(): Promise<any[]> {
    try {
      const result = await this.nano.list({ include_docs: true });
      return result.rows.map((row) => row.doc);
    } catch (error) {
      // Handle or throw the error accordingly
      throw new Error('Unable to fetch documents');
    }
  }
}
