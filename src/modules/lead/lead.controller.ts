import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { AuthUserPayload, RequestWithUser, RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { ERole } from 'src/common/roles.enum';
import { AuthUser } from 'src/common/user.decorator';

@Controller('lead')
@ApiTags('lead')
export class LeadController {
  constructor(private readonly leadService: LeadService) { }

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
      gbp: 0
    }
    return this.leadService.create({ ...createLeadDto, balance });
  }

  @Post('transaction')
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  createTransaction(@Body() createTransactionDto: CreateTransactionDto, @AuthUser() user: AuthUserPayload) {
    return this.leadService.createTransaction({ ...createTransactionDto, user: user._id })
  }

  @Get('transactions')
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllTransactions() {
    return this.leadService.findAllTransactions();
  }

  @Get()
  findAll() {
    return this.leadService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.leadService.findOne(id);
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
