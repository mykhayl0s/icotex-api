import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    console.log(createLeadDto);
    return this.leadModel.create(createLeadDto);
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionModel.create({
      ...createTransactionDto,
      lead: new Types.ObjectId(createTransactionDto.lead),
    });
    const lead = await this.leadModel.findById(createTransactionDto.lead);
    if (!(lead.balance instanceof Map)) {
      lead.balance = new Map(Object.entries(lead.balance));
    }
    const currentAmount = lead.balance.get(transaction.currency) || 0;
    lead.balance.set(transaction.currency, currentAmount + transaction.amount);
    lead.transactions.push(new Types.ObjectId(transaction._id));
    await lead.save();

    return transaction;
  }

  findAllTransactions({
    lead,
    skip,
    limit,
  }: {
    lead: string | Types.ObjectId;
    skip: number;
    limit: number;
  }) {
    let query = { ...(lead ? new Types.ObjectId(lead) : {}) };
    return this.transactionModel
      .find({ ...query })
      .skip(skip)
      .limit(limit);
  }

  findAll() {
    return this.leadModel
      .find()
      .populate({ path: 'transactions', model: 'Transaction' });
  }

  findOne(id: string) {
    return this.leadModel
      .findById(id)
      .populate({ path: 'transactions', model: 'Transaction' });
  }

  finByUser(id: string) {
    return this.leadModel
      .findOne({ user: new Types.ObjectId(id) })
      .populate({ path: 'transactions', model: 'Transaction' });
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadModel.findById(id);
    Object.assign(lead, updateLeadDto);
    return lead.save();
  }

  async remove(id: string) {
    const lead = await this.leadModel.findById(id);
    if (lead) return this.leadModel.deleteOne(lead._id);
    throw new NotFoundException('Lead not found');
  }
}
