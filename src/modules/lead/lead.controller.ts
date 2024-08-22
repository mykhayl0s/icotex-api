import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import {
  AuthUserPayload,
  RequestWithUser,
  RolesGuard,
} from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { ERole } from 'src/common/roles.enum';
import { AuthUser } from 'src/common/user.decorator';
import { UpdateLeadBalance } from './dto/update-lead-balance.dto';

@Controller('lead')
@ApiTags('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() createLeadDto: CreateLeadDto) {
    const balance = {
      btc: 0,
      eth: 0,
      usd: 0,
      eur: 0,
      gbp: 0,
    };
    return this.leadService.create({ ...createLeadDto, balance });
  }

  @Post('transaction')
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @AuthUser() user: AuthUserPayload,
  ) {
    return this.leadService.createTransaction({
      ...createTransactionDto,
      user: user._id,
    });
  }

  // @Patch('transaction')
  // @ApiBearerAuth()
  // @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // updateTransaction(@Body() createTransactionDto: UpdateTransactionDto, @AuthUser() user: AuthUserPayload) {
  //   return this.leadService.updateTransaction({ ...createTransactionDto, user: user._id })
  // }
  //
  // @Delete('transaction/:id')
  // @ApiBearerAuth()
  // @Roles(ERole.Admin, ERole.Manager, ERole.TeamLead)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // deleteTransaction(@Param('id') id: string ) {
  //   return this.leadService.deleteTransaction(id)
  // }

  @Get('transactions')
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'lead', required: false })
  findAllTransactions(@Query() { skip, limit, lead }: any) {
    return this.leadService.findAllTransactions({
      lead,
      skip: +skip,
      limit: +limit,
    });
  }

  // @Patch('balance')
  // @ApiBearerAuth()
  // @Roles(ERole.Admin, ERole.Manager, ERole.TeamLead)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // updateLeadBalance(@Body() dto: UpdateLeadBalance) {
  //   return this.leadService.updateLeadBalance(dto)
  // }

  @Get()
  findAll() {
    return this.leadService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findOne(@Param('id') id: string) {
    return this.leadService.findOne(id);
  }

  @Get('user/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async finByUser(@Param('id') id: string) {
    return this.leadService.finByUser(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.leadService.remove(id);
  }
}
