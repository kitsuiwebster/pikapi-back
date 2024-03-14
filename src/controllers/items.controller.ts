import { Controller, Get } from '@nestjs/common';
import { CouchDbService } from '../services/couchdb.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly couchDbService: CouchDbService) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.couchDbService.findAll();
  }
}
