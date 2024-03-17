import { Injectable } from '@nestjs/common';
import { User } from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import { CouchDbService } from '../services/couchdb.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly couchDbService: CouchDbService) {}

  async createUser(
    username: string,
    password: string,
    email: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User();
    newUser._id = uuidv4(); // generate a random UUID
    newUser.username = username;
    newUser.password = hashedPassword;
    newUser.email = email;
    // Save the new user to your CouchDB database here.
    await this.couchDbService.createDoc('users', newUser);
    return newUser;
  }

  async findUserByUsername(username: string): Promise<User | undefined> {
    // Find a user in your CouchDB database by their username here.
    const userDoc = await this.couchDbService.findDoc(
      'users',
      'username',
      username,
    );
    if (!userDoc) {
      return undefined;
    }
    const user = new User();
    user._id = userDoc._id;
    user.username = userDoc.username;
    user.password = userDoc.password;
    user.email = userDoc.email;
    return user;
  }
}
