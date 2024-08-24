import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team, TeamDocument } from './schemas/team.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TeamService {
  constructor(
    @InjectModel(Team.name) private readonly teamModel: Model<TeamDocument>,
  ) {}
  create(createTeamDto: CreateTeamDto) {
    return this.teamModel.create(createTeamDto);
  }

  async findUserInTeam(_id: string | Types.ObjectId) {
    const teams = await this.teamModel.find({
      $or: [{ teamLeads: _id }, { sales: _id }, { manager: _id }],
    });

    const teamIds = teams.reduce((acc, team) => {
      if (team.teamLeads && Array.isArray(team.teamLeads)) {
        acc = acc.concat(team.teamLeads);
      }

      if (team.sales && Array.isArray(team.sales)) {
        acc = acc.concat(team.sales);
      }

      if (team.manager) {
        acc.push(team.manager);
      }

      return acc;
    }, [] as Types.ObjectId[]);

    console.log({ teamIds });

    return teamIds;
  }

  async findAll({ skip = 0, limit = 10 }: { skip?: number; limit?: number }) {
    const teams = await this.teamModel
      .find({})
      .skip(skip)
      .limit(limit)
      .populate({ path: 'teamLeads', model: 'User' })
      .populate({ path: 'sales', model: 'User' })
      .populate({ path: 'manager', model: 'User' });
    const count = await this.teamModel.find({}).countDocuments({});
    return {
      data: teams,
      count,
    };
  }

  findOne(id: string) {
    this.teamModel.findById(id);
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    return this.teamModel.findByIdAndUpdate(id, updateTeamDto);
  }

  async remove(id: string) {
    const team = await this.teamModel.findById(id);
    if (!team) throw new NotFoundException();
    return this.teamModel.findByIdAndDelete(id);
  }
}
