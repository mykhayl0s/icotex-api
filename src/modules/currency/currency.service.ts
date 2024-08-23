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

  async onModuleInit() {
    const defaultCurrencies = [
      { code: 'btc', name: 'Bitcoind', symbol: 'BTC', exchangeRate: 59000 },
      { code: 'usd', name: 'US Dollar', symbol: 'USD', exchangeRate: 1 },
      { code: 'eth', name: 'Etherum', symbol: 'ETH', exchangeRate: 27000 },
      { code: 'eur', name: 'Euro', symbol: 'EUR', exchangeRate: 1.1 },
      { code: 'gbp', name: 'GB Pound', symbol: 'BTC', exchangeRate: 1.3 },
    ];

    for (const currency of defaultCurrencies) {
      const existingCurrency = await this.currencyModel.findOne({
        code: currency.code,
      });

      if (!existingCurrency) this.currencyModel.create(currency);
    }
  }
}
