// user.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: User, @Res() res: Response) {
    try {
      const newUser = await this.userService.createUser(
        body.username,
        body.password,
        body.email,
      );
      // Include a success property in the response
      res.status(201).send({ success: true, user: newUser });
    } catch (error) {
      console.error('Error during registration:', error);
      // You can also send the error details to the client if needed
      res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
  }

  

  @Post('login')
  async login(@Body() body: any, @Res() res: Response) {
    console.log("Login method hit");
    const user = await this.userService.findUserByUsernameOrEmail(body.usernameOrEmail);
    if (!user) {
      console.log(`User not found for identifier: ${body.usernameOrEmail}`);
      return res.status(401).send('Invalid username or password');
    }
    const passwordsMatch = await bcrypt.compare(body.password, user.password);
    if (!passwordsMatch) {
      console.log('Password does not match');
      return res.status(401).send('Invalid username or password');
    }
    const payload = { username: user.username, sub: user._id };
    const jwtToken = this.jwtService.sign(payload);
    console.log('Login successful, token:', jwtToken);
    return res.status(200).send({ jwtToken });
  }
}
