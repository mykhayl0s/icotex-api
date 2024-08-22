import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { Roles } from 'src/common/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ERole } from 'src/common/roles.enum';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { RolesGuard } from 'src/common/roles.guard';

@Controller('currency')
@ApiTags('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currencyService.createOrUpdate(createCurrencyDto);
  }

  @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyService.findOne(id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.currencyService.remove(id);
  }
}
