import * as bcrypt from 'bcryptjs';

export class User {
  _id: string;
  username: string;
  password: string;
  email: string;

  async passwordIsValid(plaintextPassword: string): Promise<boolean> {
    return await bcrypt.compare(plaintextPassword, this.password);
  }
}
