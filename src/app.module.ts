// app.module.ts
import { Module } from '@nestjs/common';
import { CouchDbService } from './services/couchdb.service';
import { UserModule } from './modules/user.module';
import { JwtModule } from '@nestjs/jwt';
import { UserController } from './controllers/user.controller';


@Module({
  imports: [
    UserModule,
    // app.module.ts
      JwtModule.register({
        secret: process.env.JWT_SECRET, // Directly use the environment variable
        signOptions: { expiresIn: '1h' },
      }),
  ],
  controllers: [UserController],
  providers: [CouchDbService],
})
export class AppModule {}
