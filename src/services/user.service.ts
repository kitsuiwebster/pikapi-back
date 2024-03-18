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
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User();
      newUser._id = uuidv4();
      newUser.username = username;
      newUser.password = hashedPassword;
      newUser.email = email;
      await this.couchDbService.createDoc('users', newUser);
      console.log('User successfully created:', newUser); // Log the successful creation
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error); // Log any error that occurs
      throw error; // Re-throw the error to be handled by the caller
    }
  }
  

  async findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User | undefined> {
    try {
      // Check if the input is an email
      const isEmail = usernameOrEmail.includes('@');
      let userDoc;
  
      if (isEmail) {
        userDoc = await this.couchDbService.findDoc('users', 'email', usernameOrEmail);
      } else {
        userDoc = await this.couchDbService.findDoc('users', 'username', usernameOrEmail);
      }
  
      if (!userDoc) {
        return undefined;
      }
  
      const user = new User();
      user._id = userDoc._id;
      user.username = userDoc.username;
      user.password = userDoc.password;
      user.email = userDoc.email;
  
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      throw error;
    }
  }  
}
