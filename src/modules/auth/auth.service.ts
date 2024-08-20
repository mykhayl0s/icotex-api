import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { User, UserDocument } from '../user/schemas/user.schema';
import { PickType } from '@nestjs/mapped-types';
import { OmitType } from '@nestjs/swagger';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser({ email, password }: { email: string, password: string }): Promise<User | null> {
    const user = await this.userService.findOne(email);
    if (user && await this.comparePassword(password, user.password)) {
      return user;
    }
    return null;
  }


  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    if (!user) {
      throw new BadRequestException('Invalid credentials')
    }
    const payload = OmitType(User, ['password'])
    console.log(payload)
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
