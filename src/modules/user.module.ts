import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { CouchDbService } from '../services/couchdb.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService, CouchDbService, JwtService],
  exports: [UserService],
})
export class UserModule {}
