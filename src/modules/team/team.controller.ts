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
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Roles } from 'src/common/roles.decorator';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ERole } from 'src/common/roles.enum';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('team')
@ApiTags('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
  }

  @Get()
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@Query() { skip = 0, limit = 10 }: any) {
    return this.teamService.findAll({ skip: +skip, limit: +limit });
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}
