import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Currency, CurrencyDocument } from './schemas/currency.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>,
  ) {}

  async createOrUpdate(dto: CreateCurrencyDto) {
    const currency = await this.currencyModel.findOne({
      code: dto.code,
    });
    if (!currency) return this.currencyModel.create(dto);
    Object.assign(currency, dto);

    return currency.save();
  }

  findAll() {
    return this.currencyModel.find();
  }

  async getCurrenciesMap() {
    const currencies = await this.currencyModel.find();
    const map = new Map<string, number>();
    for (const currency of currencies) {
      map.set(currency.code, currency.exchangeRate);
    }
    return map;
  }

  findOne(_id: string) {
    return this.currencyModel.find({ _id });
  }

  remove(_id: string) {
    return this.currencyModel.find({ _id });
  }
}
