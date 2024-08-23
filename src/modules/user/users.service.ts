import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ERole } from 'src/common/roles.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(dto);
    return newUser.save();
  }

  async findAll({ skip = 0, limit = 10 }: { skip?: number; limit?: number }) {
    const users = await this.userModel.find({}).skip(skip).limit(limit);
    const count = await this.userModel.find({}).countDocuments({});
    return {
      data: users,
      count,
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, dto);
  }

  async delete(_id: string) {
    const user = await this.userModel.findOne({ _id });
    if (!user) throw new NotFoundException('User not found');
    return this.userModel.findByIdAndDelete(_id);
  }

  async onModuleInit() {
    const user = await this.userModel.findOne({ role: ERole.Admin });
    if (!user) {
      const newUser = new this.userModel({
        name: 'icotexadmin',
        password: 'H4rdPassW@RD1!',
        email: 'admin@icotex.com',
        username: 'admin@icotex.com',
        role: ERole.Admin,
      });
      await newUser.save();
    }
  }
}
