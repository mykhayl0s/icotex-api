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
import { User, UserDocument } from '../user/schemas/user.schema';
import { UpdateVerificationDto, VereficationDto } from './dto/verefication.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly currencyService: CurrencyService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    return this.leadModel.create({
      ...createLeadDto,
      sale: createLeadDto?.sale
        ? new Types.ObjectId(createLeadDto.sale)
        : createLeadDto?.sale,
    });
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

  async findAllTransactions({
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
    const query = { ...(lead ? new Types.ObjectId(lead) : {}) };
    const transactions = await this.transactionModel
      .find({ ...query })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortByDate });
    const count = await this.transactionModel.countDocuments({});
    return {
      data: transactions,
      count,
    };
  }

  async findAll({ skip, limit }: { skip: any; limit: any }) {
    const leads = await this.leadModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate({ path: 'transactions', model: 'Transaction' })
      .populate({ path: 'sale', model: 'User' });
    const count = await this.leadModel.countDocuments({});
    return {
      data: leads,
      count,
    };
  }

  async findOne(id: string) {
    const lead = await this.leadModel
      .findById(id)
      .populate({ path: 'transactions', model: 'Transaction' })
      .populate({ path: 'sale', model: 'User' });

    const currencies = await this.currencyService.getCurrenciesMap();
    const populatedBalance = {
      totalUsdValue: 0,
      totalChosenValue: 0,
    };
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

  async finByUser(id: string) {
    const lead = await this.leadModel
      .findOne({ user: id })
      .populate({ path: 'transactions', model: 'Transaction' })
      .populate({ path: 'sale', model: User.name });

    const currencies = await this.currencyService.getCurrenciesMap();
    const populatedBalance = {
      totalUsdValue: 0,
      totalChosenValue: 0,
    };
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

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const lead = await this.leadModel.findById(id);
    Object.assign(lead, {
      sale: updateLeadDto?.sale
        ? new Types.ObjectId(updateLeadDto.sale)
        : updateLeadDto?.sale,
    });
    return lead.save();
  }

  async verification(dto: VereficationDto) {
    return this.leadModel.findOneAndUpdate(
      { user: dto.lead },
      { verification: dto },
    );
  }

  async updateVerification(dto: VereficationDto | UpdateVerificationDto) {
    return this.leadModel.findByIdAndUpdate(dto.lead, {
      verification: {
        ...dto,
        verifiedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    const lead = await this.leadModel.findById(id);
    if (lead) {
      await this.userModel.findOneAndDelete({ email: lead.email });
      return this.leadModel.deleteOne(lead._id);
    }
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
    await this.transactionModel.findByIdAndDelete(id);
    await this.leadModel.findByIdAndUpdate(transaction.lead, {
      $pull: { transactions: new Types.ObjectId(id) },
    });

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
