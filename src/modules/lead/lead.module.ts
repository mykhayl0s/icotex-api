import { Module } from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lead, LeadSchema } from './schemas/lead.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { UserModule } from '../user/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    UserModule,
  ],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
