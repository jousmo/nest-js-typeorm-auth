import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (user && isMatch) {
      return user;
    }
    return null;
  }
}
