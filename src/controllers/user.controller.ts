// user.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import * as bcrypt from 'bcryptjs';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: User, @Res() res: Response) {
    const newUser = await this.userService.createUser(
      body.username,
      body.password,
      body.email,
    );
    res.status(201).send(newUser);
  }

  @Post('login')
  async login(@Body() body: User, @Res() res: Response) {
    const user = await this.userService.findUserByUsername(body.username);
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      res.status(401).send('Invalid username or password');
    } else {
      // Here you would generate a JWT and send it back to the client.
      res.status(200).send('Logged in');
    }
  }
}
