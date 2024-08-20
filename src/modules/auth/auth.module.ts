// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/users.module';

import { AuthController } from './auth.controller';

@Module({
    controllers: [AuthController],
    imports: [
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: '60m' },
        }),
        UserModule,
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule { }
