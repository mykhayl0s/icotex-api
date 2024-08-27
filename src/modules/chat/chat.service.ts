import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './chat.schema';
import {User} from '../user/schemas/user.schema';
import {AuthUserPayload} from '../../common/roles.guard';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage({ room, content, user, isNew }): Promise<Message> {
    const createdMessage = new this.messageModel({
      room,
      user,
      content,
      isNew,
    });
    return createdMessage.save();
  }

  async readMessage({ id }): Promise<Message> {
    const foundMessage = await this.messageModel.findById(id);
    Object.assign(foundMessage, { isNew: false });
    return foundMessage.save();
  }

  async getMessages(
    room: string,
    authUser: AuthUserPayload
  ): Promise<{ count: number; messages: Message[] }> {
    if (room === authUser._id.toString()) {
      await this.messageModel.updateMany({ room }, { isNew: false })
    }
    const count = await this.messageModel.countDocuments({ room });
    const messages = await this.messageModel.find({ room });
    return { count, messages };
  }

  async getNewMessagesCount(
    room: string,
  ): Promise<number> {
    return this.messageModel.countDocuments({ room, isNew: true });
  }
}
