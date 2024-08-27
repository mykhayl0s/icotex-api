import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { LeadService } from '../lead.service';
import { UserService } from 'src/modules/user/users.service';
import { Roles } from 'src/common/roles.decorator';
import { ERole } from 'src/common/roles.enum';
import { RolesGuard } from 'src/common/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { CreateLeadDto } from '../dto/create-lead.dto';
import { UpdateLeadDto } from '../dto/update-lead.dto';

@Controller('bulk-lead')
@ApiTags('bulk-lead')
export class BulkLeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  // @ApiBearerAuth()
  // @Roles(ERole.Admin, ERole.Manager, ERole.Sale, ERole.TeamLead)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() createLeadDto: CreateLeadDto[]) {
    return Promise.all(createLeadDto.map((el) => this.leadService.create(el)));
  }

  @Patch()
  // @ApiBearerAuth()
  // @Roles(ERole.Admin, ERole.Manager, ERole.TeamLead, ERole.User)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Body() updateLeadDto: [UpdateLeadDto]) {
    return Promise.all(
      updateLeadDto.map((el) => this.leadService.update(el._id, { ...el })),
    );
  }
}
