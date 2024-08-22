import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadDocument } from './schemas/lead.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { UpdateLeadBalance } from './dto/update-lead-balance.dto';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly currencyService: CurrencyService,
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
    sortByDate,
  }: {
    lead: string | Types.ObjectId;
    skip: number;
    limit: number;
    sortByDate: 'asc' | 'desc';
  }) {
    let query = { ...(lead ? new Types.ObjectId(lead) : {}) };
    return this.transactionModel
      .find({ ...query })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortByDate });
  }

  findAll() {
    return this.leadModel
      .find()
      .populate({ path: 'transactions', model: 'Transaction' });
  }

  async findOne(id: string) {
    const lead = await this.leadModel
      .findById(id)
      .populate({ path: 'transactions', model: 'Transaction' });

    const currencies = await this.currencyService.getCurrenciesMap();
    const populatedBalance = {
      totalUsdValue: 0,
      totalChosenValue: 0,
    };
    let totalBalanceUsd = 0;
    const chosenCurrency = currencies.get(lead.currency) || 1;
    for (const [key, value] of lead.balance) {
      let chosenValue = 0;
      if (lead.currency === key) {
        chosenValue = value;
      } else {
        chosenValue = parseFloat(
          Number(value * ((currencies.get(key) || 1) / chosenCurrency)).toFixed(
            2,
          ),
        );
      }

      const usdValue = parseFloat(
        Number(value * (currencies.get(key) || 1)).toFixed(2),
      );
      populatedBalance[key] = {
        value,
        chosenValue,
        usdValue,
      };
      populatedBalance.totalUsdValue += usdValue;
      populatedBalance.totalChosenValue += chosenValue;
    }
    lead.balance = populatedBalance as any;

    return lead;
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

  async updateTransaction(dto: UpdateTransactionDto) {
    const transaction = await this.transactionModel.findById(dto.transaction);
    const lead = await this.leadModel.findById(transaction.lead);
    if (!(lead.balance instanceof Map)) {
      lead.balance = new Map(Object.entries(lead.balance));
    }
    const currentAmount = lead.balance.get(transaction.currency);
    lead.balance.set(transaction.currency, currentAmount - transaction.amount);
    const newCurrentAmount = lead.balance.get(dto.currency) || 0;
    lead.balance.set(transaction.currency, newCurrentAmount + dto.amount);
    transaction.amount = dto.amount;
    await lead.save();

    return transaction;
  }

  async deleteTransaction(id: string) {
    const transaction = await this.transactionModel.findById(id);
    const lead = await this.leadModel.findById(transaction.lead);
    if (!(lead.balance instanceof Map)) {
      lead.balance = new Map(Object.entries(lead.balance));
    }
    const currentAmount = lead.balance.get(transaction.currency);
    lead.balance.set(transaction.currency, currentAmount - transaction.amount);
    await lead.save();

    return transaction;
  }

  async updateLeadBalance(dto: UpdateLeadBalance) {
    const lead = await this.leadModel.findById(dto.lead);
    if (!lead) throw new NotFoundException('Lead not found');
    if (!(lead.balance instanceof Map)) {
      lead.balance = new Map(Object.entries(lead.balance));
    }
    lead.balance.set(dto.currency, dto.amount);
    await lead.save();
    return lead;
  }
}
