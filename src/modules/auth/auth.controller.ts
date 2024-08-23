import { Controller, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh-token/:token')
  @ApiParam({ name: 'token' })
  async refreshToken(@Param('token') token: string) {
    return this.authService.refreshAccessToken(token);
  }
}
