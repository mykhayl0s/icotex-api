import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Roles } from 'src/common/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ERole } from 'src/common/roles.enum';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) { }

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
  findAll() {
    return this.teamService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }

  @Patch()
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  update(@Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(updateTeamDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(ERole.Admin)
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.teamService.remove(id);
  }
}
