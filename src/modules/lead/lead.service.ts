import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schama';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    @InjectModel(Transaction.name) private readonly transactionModel: Model<TransactionDocument>
  ) { }

  async create(createLeadDto: CreateLeadDto) {
    return this.leadModel.create(createLeadDto)
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionModel.create({ ...createTransactionDto, lead: new Types.ObjectId(createTransactionDto.lead) })
    const lead = await this.leadModel.findById(createTransactionDto.lead)
    if (!(lead.balance instanceof Map)) {
      lead.balance = new Map(Object.entries(lead.balance));
    }
    const currentAmount = lead.balance.get(transaction.currency) || 0;
    lead.balance.set(transaction.currency, currentAmount + transaction.amount);
    lead.transactions.push(new Types.ObjectId(transaction._id))
    await lead.save()

    return transaction
  }

  findAll() {
    return this.leadModel.find().populate({ path: 'transactions' })
  }

  findOne(id: number) {
    return `This action returns a #${id} lead`;
  }

  update(id: number, updateLeadDto: UpdateLeadDto) {
    return `This action updates a #${id} lead`;
  }

  remove(id: number) {
    return `This action removes a #${id} lead`;
  }
}
