import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { TeamModule } from './modules/team/team.module';
import { LeadModule } from './modules/lead/lead.module';

@Module({
  imports: [UserModule, AuthModule, MongooseModule.forRoot('mongodb://localhost/nest'), TeamModule, LeadModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
