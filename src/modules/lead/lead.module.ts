import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './controllers/lead.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { UserModule } from '../user/users.module';
import { CurrencyModule } from '../currency/currency.module';
import { User, UserSchema } from '../user/schemas/user.schema';
import { TeamModule } from '../team/team.module';
import { BulkLeadController } from './controllers/bulk-lead.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    UserModule,
    CurrencyModule,
    TeamModule,
  ],
  controllers: [LeadController, BulkLeadController],
  providers: [LeadService],
})
export class LeadModule {}
