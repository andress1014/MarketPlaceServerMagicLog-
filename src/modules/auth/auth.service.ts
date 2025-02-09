import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;

    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        roleCode: user.role ? user.role.code : null, // 🔥 Agregamos el código del rol
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return { token };
  }
}
