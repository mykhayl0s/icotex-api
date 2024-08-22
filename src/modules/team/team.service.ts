import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team, TeamDocument } from './schemas/team.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TeamService {
  constructor(@InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,) { }
  create(createTeamDto: CreateTeamDto) {
    return this.teamModel.create(createTeamDto)
  }

  findAll() {
    return `This action returns all team`;
  }

  findOne(id: string) {
    this.teamModel.findById(id)
  }

  async update(updateTeamDto: UpdateTeamDto) {
    const team = await this.teamModel.findById(updateTeamDto.id)
    if (!team) throw new NotFoundException()
    Object.assign(team, updateTeamDto)
    return await team.save()
  }

  async remove(id: string) {
    const team = await this.teamModel.findById(id)
    if (!team) throw new NotFoundException()
    return this.teamModel.findByIdAndDelete(id)
  }
}
