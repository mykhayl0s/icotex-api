import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { TeamService } from '../team/team.service';
import { UserService } from '../user/users.service';
import { ERole } from 'src/common/roles.enum';
import { error } from 'console';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name)
    private readonly leadModel: Model<LeadDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly currencyService: CurrencyService,
    private readonly teamService: TeamService,
    private readonly userService: UserService,
  ) {}

  async create(createLeadDto: CreateLeadDto) {
    let userId;
    let leadId;
    try {
      const balance = {
        btc: 0,
        eth: 0,
        usd: 0,
        eur: 0,
        gbp: 0,
      };

      const user = await this.userService.create({
        email: createLeadDto.email,
        password: createLeadDto.password,
        name: `${createLeadDto.firstName} ${createLeadDto.lastName}`,
        role: ERole.User,
        username: createLeadDto.email,
      });
      userId = user._id;
      const lead = await this.leadModel.create({
        ...createLeadDto,
        balance,
        sale: createLeadDto?.sale
          ? new Types.ObjectId(createLeadDto.sale)
          : createLeadDto?.sale,
      });
      leadId = lead._id;
      return lead;
    } catch (e) {
      if (userId) await this.userService.delete(userId);
      if (leadId) await this.leadModel.findByIdAndDelete(leadId);
      console.log(e);
      throw new BadRequestException(`Something went wrong, error`);
    }
  }

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionModel.create({
      ...createTransactionDto,
      lead: new Types.ObjectId(createTransactionDto.lead),
    });

    if (createTransactionDto.type === 'Deposit') {
      const lead = await this.leadModel.findById(createTransactionDto.lead);
      if (!(lead.balance instanceof Map)) {
        lead.balance = new Map(Object.entries(lead.balance));
      }
      const currentAmount = lead.balance.get(transaction.currency) || 0;
      lead.balance.set(
        transaction.currency,
        currentAmount + transaction.amount,
      );
      lead.transactions.push(new Types.ObjectId(transaction._id));
      await lead.save();

      return transaction;
    }

    if (createTransactionDto.type === 'Withdrawal') {
      const lead = await this.leadModel.findById(createTransactionDto.lead);
      if (!(lead.balance instanceof Map)) {
        lead.balance = new Map(Object.entries(lead.balance));
      }
      const currentAmount = lead.balance.get(transaction.currency) || 0;
      lead.balance.set(
        transaction.currency,
        currentAmount - transaction.amount,
      );
      lead.transactions.push(new Types.ObjectId(transaction._id));
      await lead.save();
      return transaction;
    }
  }

  async findAllTransactions({
    lead,
    skip,
    limit,
    sortByDate,
    filterByStatus,
    restrictedUser,
  }: {
    lead: string | Types.ObjectId;
    skip: number;
    limit: number;
    sortByDate: 'asc' | 'desc';
    filterByStatus: string;
    restrictedUser: null | Types.ObjectId | string;
  }) {
    const query = {
      ...(lead ? new Types.ObjectId(lead) : {}),
      ...(filterByStatus ? { status: filterByStatus } : {}),
    };
    const transactions = await this.transactionModel
      .find({ ...query })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortByDate });
    const count = await this.transactionModel
      .find({ ...query })
      .skip(skip)
      .limit(limit)
      .countDocuments({});
    return {
      data: transactions,
      count,
    };
  }

  async findAll({
    skip,
    limit,
    restrictedUser,
    sortByDate,
    filterByStatus,
    search,
  }: {
    skip: any;
    limit: any;
    restrictedUser: null | Types.ObjectId | string;
    sortByDate: 'asc' | 'desc';
    filterByStatus: string;
    search: string;
  }) {
    let query = {
      ...(search
        ? {
            $or: [
              { email: { $regex: search, $options: 'i' } },
              { firstName: { $regex: search, $options: 'i' } },
              { lastName: { $regex: search, $options: 'i' } },
              { phone: { $regex: search, $options: 'i' } },
            ],
          }
        : {}),
      ...(filterByStatus
        ? {
            status: filterByStatus,
          }
        : {}),
      sale: undefined,
    };
    delete query.sale;
    if (restrictedUser) {
      const usrs = await this.teamService.findUserInTeam(restrictedUser);
      query.sale = { $in: usrs };
    }

    const leads = await this.leadModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate({ path: 'transactions', model: 'Transaction' })
      .populate({ path: 'sale', model: 'User' })
      .sort({ createdAt: sortByDate });

    const count = await this.leadModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .countDocuments(query);
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
        function countDecimalPlaces(num: number): number {
          const parts = num.toString().split('.');
          if (parts.length === 1) return 0;
          return parts[1].length;
        }
        const newValue = Number(
          value * ((currencies.get(key) || 1) / chosenCurrency),
        );
        if (countDecimalPlaces(newValue) >= 8) {
          chosenValue = parseFloat(newValue.toFixed(8));
        } else {
          chosenValue = parseFloat(
            newValue.toFixed(countDecimalPlaces(newValue)),
          );
        }
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
    console.log(updateLeadDto);
    Object.assign(lead, {
      ...updateLeadDto,
      sale: updateLeadDto?.sale
        ? new Types.ObjectId(updateLeadDto.sale)
        : updateLeadDto?.sale,
    });
    return lead.save();
  }

  async verification({ lead, ...dto }: VereficationDto) {
    const dbLead = await this.leadModel.findOne({ user: lead });
    dbLead.verification = dto;
    return dbLead.save();
  }

  async updateVerification({ lead, ...dto }: UpdateVerificationDto) {
    return this.leadModel.findByIdAndUpdate(lead, {
      verification: dto,
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
