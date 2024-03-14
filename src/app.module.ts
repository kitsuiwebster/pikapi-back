import { Module } from '@nestjs/common';
import { ItemsController } from './controllers/items.controller';
import { CouchDbService } from './services/couchdb.service';

@Module({
  imports: [],
  controllers: [ItemsController],
  providers: [CouchDbService],
})
export class AppModule {}
