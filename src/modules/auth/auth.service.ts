import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '../user/schemas/user.schema';
import { use } from 'passport';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null> {
    const user = await this.userService.findOne(email);
    if (user && (await this.comparePassword(password, user.password))) {
      return user;
    }
    return null;
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const { role, email, username, _id } = user;
    const payload = { role, email, username, _id };

    const access_token = this.generateToken(payload, '1h');
    const refresh_token = this.generateToken(payload, '7d');

    await this.userService.update(user._id, {
      refreshToken: refresh_token,
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.userService.findById(payload._id);

      if (!user) {
        throw new BadRequestException('Invalid refresh token');
      }

      const { role, email, username, _id } = user;
      const newPayload = { role, email, username, _id };

      const accessToken = this.generateToken(newPayload, '1h');
      const refresh_token = this.generateToken(newPayload, '7d');

      return { access_token: accessToken, refresh_token };
    } catch (e) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  generateToken(payload: any, expiresIn: '1h' | '7d') {
    return this.jwtService.sign(JSON.parse(JSON.stringify(payload)), {
      expiresIn,
    });
  }
}
