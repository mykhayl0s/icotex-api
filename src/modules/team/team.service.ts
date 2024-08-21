import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
