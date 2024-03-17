import { Module } from '@nestjs/common';
import { ItemsController } from './controllers/items.controller';
import { CouchDbService } from './services/couchdb.service';
import { UserModule } from './modules/user.module';

@Module({
  imports: [UserModule],
  controllers: [ItemsController],
  providers: [CouchDbService],
})
export class AppModule {}
