import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './auth.types';
@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: '1',
      email: 'interviewer@test.com',
      password: 'password123',
      role: 'interviewer',
    },
    {
      id: '2',
      email: 'candidate@test.com',
      password: 'password123',
      role: 'candidate',
    },
  ];

  login(email: string, password: string) {
    const user = this.users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // NEVER return password
    const { password: _, ...safeUser } = user;
    return safeUser;
  }
}
