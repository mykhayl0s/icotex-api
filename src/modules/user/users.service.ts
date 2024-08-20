import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) { }

  async findOne(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async create(dto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(dto);
    return newUser.save();
  }
}